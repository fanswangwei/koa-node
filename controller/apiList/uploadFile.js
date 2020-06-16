const path = require('path');
const fs = require('fs');


const upload_file = (ctx) => {
  let remotefilePath = null;
  let files = ctx.request.files;
  if (files['file']) {
    let fileType = files.file.name.split('.')[1];
    // 创建可读流
    const reader = fs.createReadStream(files['file']['path']);
    let filePath = `${path.resolve(__dirname, '../../static/files')}/${files['file']['name']}`;
    if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(fileType.toLowerCase()) !== -1){
      filePath = `${path.resolve(__dirname, '../../static/images')}/${files['file']['name']}`;
      remotefilePath = `/images/${files['file']['name']}`;
    }else if(['json'].indexOf(fileType.toLowerCase()) !== -1){
      filePath = `${path.resolve(__dirname, '../../static/json')}/${files['file']['name']}`;
      remotefilePath = `/json/${files['file']['name']}`;
    }else {
      filePath = `${path.resolve(__dirname, '../../static/files')}/${files['file']['name']}`;
      remotefilePath = `/files/${files['file']['name']}`;
    }
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  return remotefilePath;
}

async function uploadFile(ctx) {
  let fileUrl = await upload_file(ctx);
  
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