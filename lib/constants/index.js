const { tooManyReqErr, tokenInvalidErr, cookieInvalidErr, widgetNotFoundErr, } = require('./errors.js');
const { getTokenUrl, timelineUrl, geoListUrl } = require('./urls.js');

const fmtDate = d => {
	if(typeof d == "string") d = new Date(d);
	if(isNaN(d)) throw `Error! Please provide a parsable date value in place of ${d}`
	return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

const TIME_RANGES = {
  PAST_HOUR: "now 1-H",
  PAST_DAY: "now 1-d",
  PAST_WEEK: "now 7-d",
  PAST_MONTH: "today 1-m",
  PAST_YEAR: "today 12-m",
  ALL: "all",
  CUSTOM: (startDate, endDate) => 
  	`${fmtDate(startDate)} ${fmtDate(endDate)}`,
}

const { GEOS } = require("./geos.js");
const { CATEGORIES } = require('./categories.js');

const PROPERTIES = {
	WEB_SEARCH: "",
	IMAGE_SEARCH: "images",
	NEWS_SEARCH: "news",
	GOOGLE_SHOPPING: "froogle",
	YOUTUBE_SEARCH: "youtube",
}

module.exports = { 
	getTokenUrl, timelineUrl, geoListUrl,
	TIME_RANGES, GEOS, PROPERTIES, CATEGORIES,
	tooManyReqErr, tokenInvalidErr, cookieInvalidErr, widgetNotFoundErr, 
}