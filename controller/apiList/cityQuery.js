const cityJson = require('../../static/json/city-mapping.json')
// 对象去重
const deduplicationObj = (key, parentKey) => {
  let itemObj = {}
  return cityJson.reduce( (previousItem, currentItem) => {
    itemObj[currentItem[key]] ? '' : itemObj[currentItem[key]] = true && previousItem.push({label: currentItem[key.split('_')[0]], value: currentItem[key], parent_value: parentKey ? currentItem[parentKey] : ''});
    return previousItem
  }, []);
}
const getChildrenList = (cityData, key) => {
    return cityData.filter( item => {
      return item.parent_value == key
    })
}
const dealCityData = () => {
  // 城市数据分类（国家、省、市、区）
  let countryListArr = deduplicationObj('country_code'),
  provinceListArr = deduplicationObj('province_code', 'country_code'),
  cityListArr = deduplicationObj('city_code', 'province_code');
  areaListArr = deduplicationObj('area_code', 'city_code');
  // 重组数据对象
  // 城市对象
  cityListArr.map( item => {
    item['children'] = getChildrenList(areaListArr, item.value)
  })
  // 省份对象
  provinceListArr.map( item => {
    item['children'] = getChildrenList(cityListArr, item.value)
  })
  // 国家对象
  countryListArr.map( item => {
    item['children'] = getChildrenList(provinceListArr, item.value)
  })
  return {areaListArr, cityListArr, provinceListArr, countryListArr};
}
async function cityQuery (ctx){
  let {areaListArr, cityListArr, provinceListArr, countryListArr} = dealCityData()
  // 获取请求参数
  let {isDeep, area_code} = ctx.request.query;
  // 返回数据
  let responseData = [];
  if(area_code) {
    // 根据area_code返回城市数据(默认深层次返回)
    responseData = countryListArr.filter(item => { return item.value == area_code })
    if (!responseData.length) responseData = provinceListArr.filter(item => { return item.value == area_code });
    if (!responseData.length) responseData = cityListArr.filter(item => { return item.value == area_code });
    if (!responseData.length) responseData = areaListArr.filter(item => { return item.value == area_code });
  }else {
    // 无传参返回全部
    responseData = countryListArr;
  }
  // 是否深层次返回
  if((!Number(isDeep) || !Boolean(isDeep)) && isDeep != undefined){
    responseData.map( item => {
      delete item.children;
    })
  }
  // 返回的数据data
  ctx.data = responseData
}
module.exports = {
  cityQuery
}