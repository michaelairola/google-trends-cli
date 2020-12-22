const { baseClient, tooManyReqErr, cookieInvalidErr } = require("./base_client.js");

const getTokenUrl = "https://trends.google.com/trends/api/explore"
const timelineUrl = "https://trends.google.com/trends/api/widgetdata/multiline"
const NID = "205=VTd7voueBNi20e6V-j6ARWHUdPt3bE4g16psrE84kqTNegojJ9YhB2Ad4yAaPi60_zpADPWz2cF2Ip9Rpl90gn3lPefiadEG86TJqKDvnC9idyHTZQsoPAI24zuLmC1_AGkhEktm5rwAD3W-yxxmoEJSFdmJLu4y3Ny6UlMJveG3-j0YOHkpR28Xd-XxU_7ffVuMvva2ApwfmpAM"

const defaultInit = { NID };

class TrendsClient {
  constructor({ NID, getTokenUrl, timelineUrl } = defaultInit) {
    this.NID = NID || defaultInit.NID 
    this.queryAuthorized = false;
    this.dataReceived = false;
    this.queryObj = {};
    this.widgets = [];
    this.error = undefined;
  }
  async authQuery(queryObj) {
    return new Promise(async resolve => {
      this.queryObj = queryObj;
      const res = await baseClient(getTokenUrl, this.queryObj, { headers: { cookie: `NID=${NID};` } })
      if(typeof res == "string") {
        this.queryAuthorized = false;
        this.widgets = [];
        if(res == tooManyReqErr) this.error = cookieInvalidError
        else this.error = res;
      } else {
        this.queryAuthorized = true;
        this.widgets = res.widgets
        this.error = undefined
      }
      resolve(this.error);
    })
  }
  getWidget(t) {
    if(!this.queryAuthorized) throw this.error;
    return this.widgets.find(({ id }) => id == t) || {};
  }
  async getTimeline(queryObj) {
    return new Promise(async resolve => {
      if(!this.queryAuthorized) throw this.error;
      const { request: req, token } = this.getWidget("TIMESERIES");
      const timelineRes = await baseClient(timelineUrl, { ...this.queryObj, token, req });
      if(typeof timelineRes == "string") {
        this.dataReceived = false;
        this.data = undefined;
        this.error = timelineRes;
      } else {
        this.dataReceived = true;
        this.data = timelineRes.default;
        this.error = undefined;
      }
      resolve(this.error)
    })
  }
}

module.exports = { 
	TrendsClient,
};