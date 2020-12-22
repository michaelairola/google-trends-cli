const { 
  getTLWidget, 
  getTLTrend,
} = require("./gTrendsClient.js");
(async () => {try {
  const tWidget = await getTLWidget({ 
    hl: "en-US", 
    tz: "480", 
    req: {
      comparisonItem: [{ 
          "keyword":"Hi","geo":"","time":"today 12-m"
      }],
      category:0,
      property:""
    },
  });
  const { request, token } = tWidget;
  const timelineData = await getTLTrend({ 
    hl: "en-US", tz: 480, 
    token, 
    req: request, 
  });
  console.log(timelineData[0])
} catch(e) {
  console.log(e)
}})()