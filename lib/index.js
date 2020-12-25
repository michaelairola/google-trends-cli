const { baseClient } = require("./base_client.js");
const { getNIDCookie, objectEmpty, reqToQueryObj } = require("./utils.js");
const { 
  getTokenUrl, timelineUrl, 
  TIME_RANGES, GEOS, CATEGORIES,
  tooManyReqErr, cookieInvalidErr, widgetNotFoundErr
} = require("./constants");

class TrendsClient {
  constructor({ cookie } = {}) {
    this.cookie = cookie || getNIDCookie();
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
        this.widgets = [];
        if(res == tooManyReqErr) this.error = cookieInvalidError
        else this.error = res;
      } else {
        this.widgets = res.widgets
        this.error = undefined
      }
      resolve(this.error);
    })
  }
  getWidget(t) {
    let widget = this.widgets.find(({ id }) => id == t) || {};
    widget.error = objectEmpty(widget) ? widgetNotFoundErr(t) : undefined; 
    return widget;
  }
  replaceWidget(t,w) {
    this.widgets = this.widgets.map(widget => widget.id == t ? w : widget);
  }
  async getWidgetData(widgetType, apiUrl) {
    if(this.error) throw this.error;
    const widget = this.getWidget(widgetType);
    const { request: req, token, data, error } = widget;
    if(error || data) return widget; 
    return new Promise(async resolve => {
      const apiRes = await baseClient(apiUrl, { ...this.queryObj, token, req });
      if(typeof apiRes == "string") {
        widget.data = undefined
        widget.error = apiRes;
      } else {
        widget.data = apiRes.default;
        widget.error = undefined;
      }
      this.replaceWidget(widgetType, widget);        
      return resolve(widget);
    })    
  }
  async getTimeline() {
    return await this.getWidgetData("TIMESERIES", timelineUrl);
  } 
}

module.exports = { TrendsClient, TIME_RANGES, GEOS, CATEGORIES };