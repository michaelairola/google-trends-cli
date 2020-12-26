# Google Trends API Client!
Ever wanted the data from [Google Trends](https://trends.google.com/trends/explore) in json format? You're in luck! 

This client uses and simplifies the google trends API so you can create easy queries, while also allowing for the scalability of multiple searches. Perfect for data-scientists who need lots of trends simultaneously!

---

## 1) Install
Make sure you have Node installed. Then run

    npm install google-trends-cli
  
### or

    yarn add google-trends-cli

yarn is always safer, but hey if you're used to using npm then go for it. I'm not gonna stop you.

---

## 2) Usage 
Create a file names `index.js` and place this in it:

     // load the library and associated option values
     const { TrendsClient, TIME_RANGES, GEOS } = require("google-trends-cli");
     
     // must be in an asynchronous function
     (async () => {try {
       // initialize new client
       const trendsCli = new TrendsClient();
       // Authorize specific query
       const query = {
         keyword: "Hello",
         geo: GEOS.UNITED_STATES,
         time: TIME_RANGES.PAST_7_DAYS,
       }
       trendsCli.toggleAll(true)
       const response = await trendsCli.Query(query);
       console.log(response);
     } catch(e) {
       console.log(e)
     }})()

In your terminal, run `node index.js`. If it responds with a list of data items, congratulations! You did it sport.

# TrendsClient Methods

## 1) `new TrendsClient({ cookie })`

Initializes a new Google Trends Client. The cookie optional argument passed in is just a NID cookie, necessary for Authorizing query request. If cookie isn't supplied, Google Trends Client gets one from host [google.com](googl.com).
Example NID cookie: `"NID=205=dvwJyLE9N3dGUfsmwLik56lFe9Bgk0snFGU3sziiC2yiq4uEe06OqHX2sSzo5SVXeGRL2ap7A1prutPpceJpG5_kYVpEvLiMCEvcyn6_qPPWYgU5vD7ZKnb7iqBVUjN85zRlGa6gaVTui9nWFzOwdk2q7_cr_V7h8E7eynntYJM; expires=Sat, 26-Jun-2021 01:28:49 GMT; path=/; domain=.google.com; HttpOnly"`

## 2) `toggleAll(toggle)`
This method toggles all the different widget possibilities so that when the Query method is called, these data items are returned. Optional toggle methods that are similar to this one (but only toggle one widget at a time) are `toggleTimeline`, `toggleGeoMap`, `toggleRelatedQueries`, and `toggleRelatedTopics`.

## 3) `Query({ keyword, keywords, geo, time, category }) => widgets` 
### variables:
| Option   | Default                 | Type    |  Description | Example |
|:--------:|:-----------------------:|:-------:|:----------------------:|-------------|
| keyword  | ""                      | string  | keyword to query for   | "Hello" |
| keywords | [ "" ]                  | Array   | keywords to query and compare against each other | [ "Hello", "Hi" ] |
| geo      | `GEOS.ALL`              | string  | Geographic zone to query for. All GEO values allowed are located [here](/docs/geos.md) | `GEOS.UNITED_STATES` | 
| time     | `TIME_RANGES.PAST_7_DAYS` | string  | Time range to query for. All Time range values are located [here](/docs/time_ranges.md)| `TIME_RANGES.CUSTOM("11/24/20", "12/24/20")` |
| category | `CATEGORIES.ALL`        | string  | Category to query for. All category values allowed are located [here](/docs/categories.md) | `CATEGORIES.ARTS_ENTERTAINMENT` |
| widgets    | undefined               | Array  | response widget. A widget has an error property if something went wrong and a data property if the data was successfully retrieved. | `{ data: { timelineData: { ... } } }` |
