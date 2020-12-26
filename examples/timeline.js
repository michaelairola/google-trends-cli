     // load the library and associated option values
     const { TrendsClient, TIME_RANGES, GEOS } = require("../lib/index.js");
     
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
       // trendsCli.toggleAll(true)
       trendsCli.toggleTimeline(true)
       const response = await trendsCli.Query(query);
       console.log(response);
     } catch(e) {
       console.log(e)
     }})()