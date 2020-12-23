#Google Trends API Client!
Warning, this is a work in progress so it might not work how it is intended, especially if google changes how the trends api works. However, I wanted a way to programatically get the google trends data in order to 

Currently, you are only able to get the timeline data. Other data retrieval processes are a work in progress.

## 1) Install
    npm install google-trends-cli
 or
	yarn add google-trends-cli

## 2) Usage 
    const { TrendsClient } = require("./lib/index.js");
    
    // must be used in asyncronous function
    (async () => {try {
      // initialize the google trends client
      const trendsCli = new TrendsClient();
      // Authorize a client request for the query 
      // 'Hello World' for the past 12 months 
      let e = await trendsCli.authQuery({
        comparisonItem: [
          { 
              "keyword":"Hello World!","geo":"","time":"today 12-m"
          },
        ],
      })
      if(e) throw e;
      // Request the data for the above request
      e = await trendsCli.getTimeline()
      if(e) throw e;
      console.log("data:", trendsCli.data);
    } catch(e) {
      console.log(e)
    }})()

## Documentation a work in progress!
Still reverse engineering the trends api, so documentation isn't written up yet. Keep in mind this is in the very beginning phases so don't expect too much from this module. Good luck!