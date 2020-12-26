const { baseClient } = require("./base_client.js");
const { getNIDCookie, objectEmpty, reqToQueryObj } = require("./utils.js");
const { 
  getTokenUrl, timelineUrl, comparedGeoUrl, relatedUrl,
  TIME_RANGES, GEOS, CATEGORIES,
  tooManyReqErr, cookieInvalidErr, widgetNotFoundErr
} = require("./constants");

const widgetUrlMap = {
  "TIMESERIES": timelineUrl,
  "GEO_MAP": comparedGeoUrl,
  "RELATED_TOPICS": relatedUrl,
  "RELATED_QUERIES": relatedUrl,
}

class TrendsClient {
  constructor({ cookie } = {}) {
    this.cookie = cookie || getNIDCookie();
    this.queryObj = {};
    this.widgets = [];
    this.toggles = {};
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
  async getWidgetData(widgetType, apiUrl, cb = data => data) {
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
        widget.data = cb(apiRes.default);
        widget.error = undefined;
      }
      this.replaceWidget(widgetType, widget);        
      return resolve(widget);
    })    
  }
  async getTimeline() {
    return await this.getWidgetData("TIMESERIES", timelineUrl);
  }
  async getGeoMap() {
    return await this.getWidgetData("GEO_MAP", comparedGeoUrl);
  }
  async getRelatedTopics() {
    return await this.getWidgetData("RELATED_TOPICS", relatedUrl);
  }
  async getRelatedQueries() {
    return await this.getWidgetData("RELATED_QUERIES", relatedUrl);
  }

  toggle(t, v) {
    this.toggles[t] = v;
  }
  toggleTimeline(v) {
    return this.toggle("TIMESERIES", v)
  }
  toggleGeoMap(v) {
    return this.toggle("GEO_MAP", v)
  }
  toggleRelatedTopics(v) {
    return this.toggle("RELATED_TOPICS", v)
  }
  toggleRelatedQueries(v) {
    return this.toggle("RELATED_QUERIES", v)
  }
  toggleAll(v) {
    this.toggleTimeline(v)
    this.toggleGeoMap(v)
    this.toggleRelatedTopics(v)
    this.toggleRelatedQueries(v)
  }
  async Query(query) {
    const err = await this.authQuery(query)
    if(err) throw err;
    let result = {}
    const widgetTypes = Object.keys(this.toggles).filter(key => this.toggles[key])    
    let responses = await Promise.all(widgetTypes.map(key => 
       this.getWidgetData(key, widgetUrlMap[key])
    ))
    widgetTypes.forEach((key, i) => result[key] = responses[i])
    return result
  }
}

module.exports = { TrendsClient, TIME_RANGES, GEOS, CATEGORIES };