const axios = require("axios");
const env = process.env;
const { GEOS, PROPERTIES, TIME_RANGES, CATEGORIES } = require("./constants");

const getNIDCookie = async () => {
  const res = await axios("https://google.com")
  const cookies = res.headers['set-cookie']
  return cookies.find(cookie => cookie.startsWith("NID"))
}

const objectEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

const getHostLang = () => 
	env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES || "en-US";

const getTzOffset = () =>
	new Date().getTimezoneOffset();

const reqToQueryObj = ({ keyword, keywords, geo, time, property, category } = {}) => {
  if(keyword) keywords = [ keyword ]
  property = property || PROPERTIES.WEB_SEARCH;
  geo = geo || GEOS.ALL;
  time = time || TIME_RANGES.PAST_WEEK;
  category = category || CATEGORIES.All
  return {
    hl: getHostLang(), 
    tz: getTzOffset(),
    req: {
		comparisonItem: keywords.map(keyword => ({
		  keyword, geo, time
		})),
		property, category,
	}
  }
}

module.exports = { getNIDCookie, objectEmpty, reqToQueryObj }