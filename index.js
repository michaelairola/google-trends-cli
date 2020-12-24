const { TrendsClient } = require("./lib/index.js");
// saves about 350ms to pass in cookie
const cookie = "NID=205=aksdsOWLfmVm8Y529fZmVLh_x_lvcb59R6nO7_fVjb-8NnwXcbTLjsQkNUjcq9womNyTsYXDD_YZIdgh4Ki8S8iouWTnG2ZDbblHR1AswVnRCH5zHQLKWqADC-Uhs0oyZq1goc4WERPIODtfWFaGN15R_oFnZp2jtgVK1GdMpnQ; expires=Thu, 24-Jun-2021 16:34:52 GMT; path=/; domain=.google.com; HttpOnly";

(async () => {try {
  const trendsCli = new TrendsClient({ cookie });
  let err = await trendsCli.authQuery({
    comparisonItem: [
      { 
          "keyword":"Hi","geo":"","time":"today 12-m"
      },
    ],
  })
  if(err) throw err;
  const { data, error } = await trendsCli.getTimeline()
  if(error) throw error;
  console.log("data:", data);
} catch(e) {
  console.log(e)
}})()