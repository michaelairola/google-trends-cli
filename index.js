const { TrendsClient, TIME_RANGES, GEOS } = require("./lib/index.js");
// saves about 350ms to pass in cookie
const cookie = "NID=205=aksdsOWLfmVm8Y529fZmVLh_x_lvcb59R6nO7_fVjb-8NnwXcbTLjsQkNUjcq9womNyTsYXDD_YZIdgh4Ki8S8iouWTnG2ZDbblHR1AswVnRCH5zHQLKWqADC-Uhs0oyZq1goc4WERPIODtfWFaGN15R_oFnZp2jtgVK1GdMpnQ; expires=Thu, 24-Jun-2021 16:34:52 GMT; path=/; domain=.google.com; HttpOnly";

(async () => {try {
  const trendsCli = new TrendsClient({ cookie });
  let err = await trendsCli.authQuery({
    keyword: "Hello",
    geo: GEOS.UNITED_STATES,
    time: TIME_RANGES.CUSTOM("11/24/20", "12/24/20"),
  })
  if(err) throw err;
  const widget = await trendsCli.getTimeline()
  if(widget.error) throw error;
  console.log(widget);
} catch(e) {
  console.log(e)
}})()