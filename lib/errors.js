// errors that are used to match with google response errors, don't change!
const tooManyReqErr = "We're sorry, but you have sent too many requests to us recently. Please try again later.";
const tokenInvalidErr = "The server cannot process the request because it is malformed.";
// trends client errors
const cookieInvalidErr = "NID Cookie is invalid for requesting a token to authorize any further requests.";
const widgetNotFoundErr = id => `widget with id ${id} not found.`;

module.exports = { tooManyReqErr, tokenInvalidErr, cookieInvalidErr, widgetNotFoundErr, }