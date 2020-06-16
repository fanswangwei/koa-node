
async function xlsxToJson(ctx) {
  let files = ctx.request.files;
  if(files && files.file){
    console.log(files.file.name)
    ctx.data = {
      file: files.file
    }
  }else {
    ctx.error = {
      msg: '文件格式错误'
    }
  }
}
module.exports = {
  xlsxToJson
}