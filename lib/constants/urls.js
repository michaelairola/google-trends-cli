
const TrendsUrl = "https://trends.google.com/trends"
const TrendsApiUrl = `${TrendsUrl}/api`
const trendsExploreUrl = `${TrendsUrl}/explore`
const getTokenUrl = `${TrendsApiUrl}/explore`
const timelineUrl = `${TrendsApiUrl}/widgetdata/multiline`
const geoListUrl = `${TrendsApiUrl}/explore/pickers/geo`
const catListUrl = `${TrendsApiUrl}/explore/pickers/category`
module.exports = { getTokenUrl, timelineUrl, geoListUrl, catListUrl, trendsExploreUrl }