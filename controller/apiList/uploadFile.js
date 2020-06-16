const path = require('path');
const fs = require('fs');


const upload_file = (ctx) => {
  console.log(JSON.stringify(ctx.request, null, ' '));
  let remotefilePath = null;
  if (ctx.request.files['file']) {
    // 创建可读流
    const reader = fs.createReadStream(ctx.request.files['file']['path']);
    let filePath = `${path.resolve(__dirname, '../../static')}/${ctx.request.files['file']['name']}`;
    remotefilePath = `http://127.0.0.1:4004/${ctx.request.files['file']['name']}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  return remotefilePath;
}

async function uploadFile(ctx) {
  let fileUrl = await upload_file(ctx);
  // console.log(ctx.request.files.file)
  
  if(fileUrl){
    ctx.data = {
      url: fileUrl,
      message: '文件上传成功'
    }
  } else {
    ctx.error = {
      url: fileUrl,
      message: '文件上传失败',
    }
  }
}
module.exports = {
  uploadFile
}