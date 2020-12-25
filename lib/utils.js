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

const checkValues = ({ property, geo, category}) => {
  let key;
  if(!Object.values(PROPERTIES).includes(property)) key = "property"
  if(!Object.values(GEOS).includes(geo)) key = "geo"
  if(!Object.values(CATEGORIES).includes(category)) key = "category"
  return key ? `Please provide a proper ${key} value.` : undefined
}

const reqToQueryObj = ({ keyword, keywords, geo, time, property, category } = {}) => {
  if(keyword) keywords = [ keyword ]
  property = property || PROPERTIES.WEB_SEARCH;
  geo = geo || GEOS.ALL;
  time = time || TIME_RANGES.PAST_7_DAYS;
  category = category || CATEGORIES.ALL
  let e = checkValues({ property, geo, time, category })
  if(e) throw e
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