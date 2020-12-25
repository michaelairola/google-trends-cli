# Google Trends API Client!
Ever wanted the data from [Google Trends](https://trends.google.com/trends/explore) in json format? You're in luck! 

This client uses and simplifies the google trends API so you can create easy queries, while also allowing for the scalability of multiple searches. Perfect for data-scientists who need lots of trends simultaneously!

## 1) Install
    npm install google-trends-cli
 or
	yarn add google-trends-cli

## 2) Usage 

     // load the library and associated option values
     const { TrendsClient, TIME_RANGES, GEOS } = require("./lib/index.js");
     
     // must be in an asynchronous function
     (async () => {try {
       // initialize new client
       const trendsCli = new TrendsClient();
       // Authorize specific query
       let err = await trendsCli.authQuery({
         keyword: "Hello",
         geo: GEOS.United_States,
         time: TIME_RANGES.PAST_WEEK,
       })
       if(err) throw err;
       // Get data associated with above query
       const { error, data } = await trendsCli.getTimeline()
       if(error) throw error;
       console.log(data.timelineData);
     } catch(e) {
       console.log(e)
     }})()

# TrendsClient Methods

## Constructor (`new TrendsClient({ cookie })`)

### arguments
  | Option |Required| Type | Description | Example |
  |--------|-|----|-------|-------------|
  | cookie |false | string | NID cookie, necessary for Authorizing query request | "NID=205=dvwJyLE9N3dGUfsmwLik56lFe9Bgk0snFGU3sziiC2yiq4uEe06OqHX2sSzo5SVXeGRL2ap7A1prutPpceJpG5_kYVpEvLiMCEvcyn6_qPPWYgU5vD7ZKnb7iqBVUjN85zRlGa6gaVTui9nWFzOwdk2q7_cr_V7h8E7eynntYJM; expires=Sat, 26-Jun-2021 01:28:49 GMT; path=/; domain=.google.com; HttpOnly" | 
  Initializes a new Google Trends Client. If cookie isn't supplied, Google Trends Client gets one from host [google.com](googl.com).

## authQuery({ keyword, keywords, geo, time, category }) = error 
### variables:
  | Option |Default| Type | Description | Example |
  |--------|-|----|-------|-------------|
  | keyword | "" | string | keyword to query for | "Hello" |
  | keywords | [ keyword ] | Array | keywords to query and compare against each other | [ "Hello", "Hi" ] |
  | geo  | GEOS.All | string | Geographic zone to query for. All options are located [here](/templating/geos.txt) | GEOS.United_States | 
  | time | TIME_RANGES.PAST_WEEK | string | Time range to query for. | TIME_RANGES.CUSTOM("11/24/20", "12/24/20") |
  | category | CATEGORIES.All | string | Category to query for. All options are located [here](/templating/categories.txt) | CATEGORIES.Arts_Entertainment |
  | error | undefined | string | error if query is malformed or unauthorized. If query is authorized, error is undefined. | "The server cannot process the request because it is malformed." |

## getTimeline()
### Return Value: 
  The return value of this method is a widget that is used for requesting the data, with an error or data key appended to it. If the request is invalid, the error property will be filled, otherwise the response data will be placed in the data field.

# TrendsClient still a WIP
Please keep in mind that this is in the early stages of development, as I have not been able to implement the 