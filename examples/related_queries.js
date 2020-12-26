     // load the library and associated option values
     const { TrendsClient, TIME_RANGES, GEOS } = require("../lib/index.js");
     
     // must be in an asynchronous function
     (async () => {try {
       // initialize new client
       const trendsCli = new TrendsClient();
       // Authorize specific query
       let err = await trendsCli.authQuery({
         keyword: "Hello",
         geo: GEOS.UNITED_STATES,
         time: TIME_RANGES.PAST_7_DAYS,
       })
       if(err) throw err;
       // Get data associated with above query
       const { error, data } = await trendsCli.getRelatedTopics()
       if(error) throw error;
       console.log(data);
     } catch(e) {
       console.log(e)
     }})()