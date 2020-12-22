const { 
  TrendsClient,
  // getTLWidget, 
  // getTLTrend,
} = require("./lib/index.js");
(async () => {try {
  const trendsCli = new TrendsClient();
  let e = await trendsCli.authQuery({ 
    hl: "en-US", 
    tz: "480", 
    req: {
      comparisonItem: [{ 
          "keyword":"Hi","geo":"","time":"today 12-m"
      }],
      category:0,
      property:""
    },
  })
  if(e) throw e;
  e = await trendsCli.getTimeline({ hl: "en-US", tz: 480 })
  if(e) throw e;
  console.log("data:", trendsCli.data.timelineData[0]);
} catch(e) {
  console.log(e)
}})()