const axios = require("axios");
const createUrl = require("./createUrl.js");

const startStr = /\)]}',*/i

const tooManyReqErr = "We're sorry, but you have sent too many requests to us recently. Please try again later.";
const cookieInvalidErr = "NID Cookie is invalid for requesting a token to authorize any further requests.";
const tokenInvalidErr = "The server cannot process the request because it is malformed.";

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