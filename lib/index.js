const { baseClient } = require("./base_client.js");
const { getNIDCookie, getHostLang, getTzOffset } = require("./env.js");

const { tooManyReqErr, cookieInvalidErr } = require("./errors.js");

const TrendsApiUrl = "https://trends.google.com/trends/api"
const getTokenUrl = `${TrendsApiUrl}/explore`
const timelineUrl = `${TrendsApiUrl}/widgetdata/multiline`

const reqToQueryObj = req => ({
  hl: getHostLang(), 
  tz: getTzOffset(),
  req
})

class TrendsClient {
  constructor({ cookie } = {}) {
    this.cookie = cookie || getNIDCookie();
    this.queryAuthorized = false;
    this.queryObj = {};
    this.widgets = [];
    this.error = undefined;
  }
  async authQuery(reqObj) {
    return new Promise(async resolve => {
      const cookie = await this.cookie;
      this.queryObj = reqToQueryObj(reqObj);
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
  replaceWidget(w,t) {
    this.widgets = this.widgets.map(widget => widget.id == t ? w : widget);
  }
  async getWidgetData(widgetType, apiUrl) {
    return new Promise(async resolve => {
      if(!this.queryAuthorized) throw this.error;
      const widget = this.getWidget(widgetType);
      const { request: req, token } = widget;
      const timelineRes = await baseClient(apiUrl, { ...this.queryObj, token, req });
      if(typeof timelineRes == "string") {
        widget.error = timelineRes;
        this.error = timelineRes;
      } else {
        widget.data = timelineRes.default;
        this.error = undefined;
      }
      this.replaceWidget(widget, widgetType);        
      return resolve(widget);
    })    
  }
  async getTimeline() {
    return await this.getWidgetData("TIMESERIES", timelineUrl);
  } 
}

module.exports = { TrendsClient };