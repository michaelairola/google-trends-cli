const axios = require("axios");
const createUrl = require("./createUrl.js");
const { tooManyReqErr, tokenInvalidErr, cookieInvalidErr } = require("./errors.js");
const startStr = /\)]}',*/i

const resToJson = res => {
  let body = res.data
  if(startStr.test(body)) {
    body = res.data.replace(startStr, "");
    return JSON.parse(body)
  } else if (body.includes(tooManyReqErr)) {
    return tooManyReqErr;
  } else if (body.includes(tokenInvalidErr)) {
    return tokenInvalidErr
  } else {
  	return body;
  }
}

const baseClient = async (baseUrl, queryObj, opts = {}) => 
  resToJson(await axios(createUrl(baseUrl, queryObj), { validateStatus: () => true, ...opts }))

module.exports = { baseClient, tooManyReqErr, cookieInvalidErr };