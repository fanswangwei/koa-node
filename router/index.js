const Router = require('koa-router');
const router = new Router();
const cityQuery = require('./routes/cityQuery')
const uploadFile = require('./routes/uploadFile')

router.use('/city/query', cityQuery.routes(), cityQuery.allowedMethods());
router.use('/upload/file', uploadFile.routes(), uploadFile.allowedMethods());

module.exports = router; 