const Router = require('koa-router')
const router = new Router()
const controller = require('../../controller')

router.post('/', controller.xlsxToJson.xlsxToJson)

module.exports = router;