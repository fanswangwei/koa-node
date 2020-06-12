const Router = require('koa-router');
const router = new Router();
const cityQuery = require('./routes/cityQuery')

router.use('/city/query', cityQuery.routes(), cityQuery.allowedMethods());

module.exports = router; 