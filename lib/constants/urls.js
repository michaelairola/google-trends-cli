const TrendsUrl = "https://trends.google.com/trends"

// for getting data
const TrendsApiUrl = `${TrendsUrl}/api`
const getTokenUrl = `${TrendsApiUrl}/explore`
const timelineUrl = `${TrendsApiUrl}/widgetdata/multiline`
const comparedGeoUrl = `${TrendsApiUrl}/widgetdata/comparedgeo`
const relatedUrl = `${TrendsApiUrl}/widgetdata/relatedsearches`

// for generating geo and cat lists
const trendsExploreUrl = `${TrendsUrl}/explore`
const geoListUrl = `${trendsExploreUrl}/pickers/geo`
const catListUrl = `${trendsExploreUrl}/pickers/category`

module.exports = { getTokenUrl, timelineUrl, comparedGeoUrl, relatedUrl, geoListUrl, catListUrl, trendsExploreUrl }