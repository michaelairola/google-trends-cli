const axios = require("axios")

const startStr = /\)]}',*/i
const errStr = "We're sorry, but you have sent too many requests to us recently. Please try again later."
const tokenInvalid = "The server cannot process the request because it is malformed."

const getTokenUrl = "https://trends.google.com/trends/api/explore"
const timelineUrl = "https://trends.google.com/trends/api/widgetdata/multiline"
const NID = "205=VTd7voueBNi20e6V-j6ARWHUdPt3bE4g16psrE84kqTNegojJ9YhB2Ad4yAaPi60_zpADPWz2cF2Ip9Rpl90gn3lPefiadEG86TJqKDvnC9idyHTZQsoPAI24zuLmC1_AGkhEktm5rwAD3W-yxxmoEJSFdmJLu4y3Ny6UlMJveG3-j0YOHkpR28Xd-XxU_7ffVuMvva2ApwfmpAM"

const resToJson = res => {
  let body = res.data
  if(startStr.test(body)) {
    body = res.data.replace(startStr, "");
    return JSON.parse(body)
  } else if (body.includes(errStr)) {
    const url = res.config.url
    throw `Api endpoint unauthorized. make sure proper cookies are implemented: ${url}`
  } else if (body.includes(tokenInvalid)) {
    throw `Api token is invalid. Please make sure the token requested works`
  } else {
    console.log(body)
    throw "Api response does not start with expected characters. Api either changed starting characters, or the request was not authorized"
  }
}
const encodeJson = json => encodeURI(JSON.stringify(json))
const jsonToQueryStr = (json = {}) => Object.keys(json).map(key => 
  typeof json[key] == "object" ? 
    `${key}=${encodeJson(json[key])}` :
    `${key}=${json[key]}`
).join("&")
const createUrl = (base, queryObj) => `${base}?${jsonToQueryStr(queryObj)}`

const gTrendsClient = async (baseUrl, queryObj, opts = {}) => 
  resToJson(await axios(createUrl(baseUrl, queryObj), { validateStatus: () => true, ...opts }))

const getWidgets = (queryObj) => gTrendsClient(getTokenUrl, queryObj, { headers: { cookie: `NID=${NID};` } })

const getWidget = type => async (queryObj) => {
	const res = await getWidgets(queryObj)
	const { widgets } = res;
	return widgets.find(({id})=> id == type)	
} 
const getTLWidget = getWidget("TIMESERIES");

const getTLTrend = async queryObj => {
	const res = await gTrendsClient(timelineUrl, queryObj);
	const { default: { timelineData } } = res;
	return timelineData;
}
module.exports = { 
	gTrendsClient, 
	getWidgets, 
	getTLWidget,
	getTLTrend,
};