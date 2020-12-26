const { tooManyReqErr, tokenInvalidErr, cookieInvalidErr, widgetNotFoundErr, } = require('./errors.js');
const { getTokenUrl, timelineUrl, comparedGeoUrl, relatedUrl, geoListUrl } = require('./urls.js');

const { TIME_RANGES } = require('./time_ranges.js');
const { GEOS } = require('./geos.js');
const { CATEGORIES } = require('./categories.js');

const PROPERTIES = {
	WEB_SEARCH: "",
	IMAGE_SEARCH: "images",
	NEWS_SEARCH: "news",
	GOOGLE_SHOPPING: "froogle",
	YOUTUBE_SEARCH: "youtube",
}

module.exports = { 
	getTokenUrl, timelineUrl, geoListUrl, comparedGeoUrl, relatedUrl,
	TIME_RANGES, GEOS, PROPERTIES, CATEGORIES,
	tooManyReqErr, tokenInvalidErr, cookieInvalidErr, widgetNotFoundErr, 
}