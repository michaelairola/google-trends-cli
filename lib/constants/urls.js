
const TrendsApiUrl = "https://trends.google.com/trends/api"
const getTokenUrl = `${TrendsApiUrl}/explore`
const timelineUrl = `${TrendsApiUrl}/widgetdata/multiline`
const geoListUrl = `${TrendsApiUrl}/explore/pickers/geo`
const catListUrl = `${TrendsApiUrl}/explore/pickers/category`
module.exports = { getTokenUrl, timelineUrl, geoListUrl, catListUrl }