const { baseClient, tooManyReqErr, cookieInvalidErr } = require("./base_client.js");

const getTokenUrl = "https://trends.google.com/trends/api/explore"
const timelineUrl = "https://trends.google.com/trends/api/widgetdata/multiline"
const NID = "205=VTd7voueBNi20e6V-j6ARWHUdPt3bE4g16psrE84kqTNegojJ9YhB2Ad4yAaPi60_zpADPWz2cF2Ip9Rpl90gn3lPefiadEG86TJqKDvnC9idyHTZQsoPAI24zuLmC1_AGkhEktm5rwAD3W-yxxmoEJSFdmJLu4y3Ny6UlMJveG3-j0YOHkpR28Xd-XxU_7ffVuMvva2ApwfmpAM"

const getWidgets = async queryObj => {
  const widgets = await baseClient(getTokenUrl, queryObj, { headers: { cookie: `NID=${NID};` } })
  if(typeof widgets == "string") {
    if(widgets == tooManyReqErr) throw cookieInvalidErr
    else throw widgets; 
  }
  return widgets;
}
const getWidget = type => async (queryObj) => {
	const res = await getWidgets(queryObj)
	const { widgets } = res;
	return widgets.find(({id})=> id == type)	
} 
const getTLWidget = getWidget("TIMESERIES");

const getTLTrend = async queryObj => {
	const res = await baseClient(timelineUrl, queryObj);
	if(typeof res == "string") throw res;
  const { default: { timelineData } } = res;
	return timelineData;
}
module.exports = { 
	getWidgets, 
	getTLWidget,
	getTLTrend,
};