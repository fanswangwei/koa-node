let config = {}
const NODE_ENV = process.env.NODE_ENV || "";

switch(NODE_ENV){
  case "developmemt":
    config = require("./dev");
  case "test":
    config = require("./test");
  case "production":
    config = require("./production");
  default:
    config = require("./production");
}




module.exports = config;