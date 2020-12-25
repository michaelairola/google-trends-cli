# Google Trends API Client!
Ever wanted the data from [Google Trends](https://trends.google.com/trends/explore) in json format? You're in luck! 

This client uses and simplifies the google trends API so you can create easy queries, while also allowing for the scalability of multiple searches. Perfect for data-scientists who need lots of trends simultaneously!

## 1) Install
Make sure you have Node installed. Then run

    npm install google-trends-cli
  
### or

    yarn add google-trends-cli

yarn is always safer, but hey if you're used to using npm then go for it. I'm not gonna stop you.

## 2) Usage 
Create a file names `index.js` and place this in it:

     // load the library and associated option values
     const { TrendsClient, TIME_RANGES, GEOS } = require("google-trends-cli");
     
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
       console.log(data);
     } catch(e) {
       console.log(e)
     }})()

In your terminal, run `node index.js`. If it responds with a list of data items, congratulations! You did it sport.

# TrendsClient Methods

## * `new TrendsClient({ cookie })`

Initializes a new Google Trends Client. The cookie optional argument passed in is just a NID cookie, necessary for Authorizing query request. If cookie isn't supplied, Google Trends Client gets one from host [google.com](googl.com).
Example NID cookie: `"NID=205=dvwJyLE9N3dGUfsmwLik56lFe9Bgk0snFGU3sziiC2yiq4uEe06OqHX2sSzo5SVXeGRL2ap7A1prutPpceJpG5_kYVpEvLiMCEvcyn6_qPPWYgU5vD7ZKnb7iqBVUjN85zRlGa6gaVTui9nWFzOwdk2q7_cr_V7h8E7eynntYJM; expires=Sat, 26-Jun-2021 01:28:49 GMT; path=/; domain=.google.com; HttpOnly"`

## * `authQuery({ keyword, keywords, geo, time, category }) => error` 
### variables:
| Option   | Default                 | Type    |  Description | Example |
|:--------:|:-----------------------:|:-------:|:----------------------:|-------------|
| keyword  | ""                      | string  | keyword to query for   | "Hello" |
| keywords | [ "" ]                  | Array   | keywords to query and compare against each other | [ "Hello", "Hi" ] |
| geo      | `GEOS.All`              | string  | Geographic zone to query for. All GEO values allowed are located [here](/templating/geos.txt) | `GEOS.United_States` | 
| time     | `TIME_RANGES.PAST_WEEK` | string  | Time range to query for. | `TIME_RANGES.CUSTOM("11/24/20", "12/24/20")` |
| category | `CATEGORIES.All`        | string  | Category to query for. All category values allowed are located [here](/templating/categories.txt) | `CATEGORIES.Arts_Entertainment` |
| error    | undefined               | string  | error if query is malformed or unauthorized. If query is authorized, error is undefined. | "The server cannot process the request because it is malformed." |


## * `getTimeline()`
  The return value of this method is a widget that is used for requesting the data, with an error or data key appended to it. If the request is invalid, the error property will be filled, otherwise the response data will be placed in the data field.

---

# WIP Reminder
Please keep in mind that this is in the early stages of development, as I have not been able to implement the geo or related searches data part of the Google Trends Api. It shouldn't be too hard though! send a PR if you feel like you can handle it 