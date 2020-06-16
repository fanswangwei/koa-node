const Koa = require('koa');
const app = new Koa();

const logger = require('koa-logger');
const onerror = require('koa-onerror');
const dayjs = require('dayjs');
const views = require('koa-views');
const path = require('path');
const koaBody = require('koa-body');
const static = require('koa-static');

const router = require('./router');
const config = require('./config');

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
});

// 通过 ctx.data || ctx.error 全局控制 API
app.use(async (ctx, next)=>{
  await next();

  if(ctx.data || ctx.dataMessage){
    ctx.body = {
      code: 200,
      data: ctx.data || {},
      message: ctx.dataMessage || "success"
    }
  }else if(ctx.error || ctx.errorMessage){
    ctx.body = {
      code: 500,
      data: ctx.error || "",
      message: ctx.errorMessage || "error"
    }
  }
})
// 配置静态web服务的中间件
// app.use(static('static'));
app.use(static(__dirname + '/static'));

// 上传参数
app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    maxFileSize: 2000*1024*1024
  }
}))

// 日志
app.use(logger((str, args) => {
  console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} ${args.slice(1).join(' ')}`);
}))

// 路由
app.use(router.routes()).use(router.allowedMethods())


// 抛出错误
onerror(app, {
  engine: 'ejs',
  template: __dirname + '/error.ejs'
});

// 记录错误日志
app.on("error",(err, ctx)=>{  
  console.error(`
    --------------- error -----------------

    timestamp: ${new Date().toISOString()}
    ctx.request.method : ${ctx.request.method}
    ctx.request.path   : ${ctx.request.href}
    ctx.request.query  : ${JSON.stringify({...ctx.request.query})}
    ctx.request.body   : ${JSON.stringify({...ctx.request.body})}

    ${err.stack}

    ------------------------------------
  `);
}); 

app.listen(config.port);
console.log(`-----------  Server is start in PORT: ${config.port}, NODE_ENV: ${process.env.NODE_ENV}  -----------`);