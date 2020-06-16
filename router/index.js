const Router = require('koa-router');
const router = new Router();
const cityQuery = require('./routes/cityQuery')
const uploadFile = require('./routes/uploadFile')
const xlsxToJson = require('./routes/xlsxToJson')

router.use('/city/query', cityQuery.routes(), cityQuery.allowedMethods());
router.use('/upload/file', uploadFile.routes(), uploadFile.allowedMethods());
router.use('/upload/xlsxToJson', xlsxToJson.routes(), xlsxToJson.allowedMethods());

module.exports = router; 