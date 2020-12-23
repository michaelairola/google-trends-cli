const axios = require("axios");
const { baseClient, tooManyReqErr, cookieInvalidErr } = require("./base_client.js");

const getTokenUrl = "https://trends.google.com/trends/api/explore"
const timelineUrl = "https://trends.google.com/trends/api/widgetdata/multiline"

const getNIDCookie = async () => {
  const res = await axios("https://google.com")
  const cookies = res.headers['set-cookie']
  return cookies.find(cookie => cookie.startsWith("NID"))
}

class TrendsClient {
  constructor() {
    this.cookie = getNIDCookie();
    this.queryAuthorized = false;
    this.dataReceived = false;
    this.queryObj = {};
    this.widgets = [];
    this.error = undefined;
  }
  async authQuery(queryObj) {
    return new Promise(async resolve => {
      const cookie = await this.cookie;
      this.queryObj = queryObj;
      const res = await baseClient(getTokenUrl, this.queryObj, { headers: { cookie } })
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