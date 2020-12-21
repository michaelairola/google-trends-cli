const { 
  getTLWidget, 
  getTLTrend,
} = require("./gTrendsClient.js");

const NID_Cookie = "205=FZQJDIKVEaMsbmR8vAHtOtQxqQxHxzafHRfPN_DP41YmlJ_ct8TpQzsPXK1PHvmpB1R8rvFu_SATcmZi72ah1RiTjs_UZiQiERbSRNXwsvdAiX3C1oFpKnEOQsuwJVmNWxFyHzd5ykrhPjo9xodNvfKt1Z2XAmj0TjAJGhlyR3tfvlAWpukcfWjSRM7rOrhPrdSlS2i7sG_gqKpKp9uHwsi9DQ17FLnj7SFwxN37gSxYrUXf26BIQkzkyHNwQVwY"

const y = async () => { try {
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
  }, NID_Cookie);
  const { request, token } = tWidget;
  const timelineData = await getTLTrend({ 
    hl: "en-US", tz: 480, 
    token, 
    req: request, 
  });
  console.log(timelineData[0])
} catch(e) {
  console.log(e)
}}
y()
