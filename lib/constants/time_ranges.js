const fmtDate = d => {
	if(typeof d == "string") d = new Date(d);
	if(isNaN(d)) throw `Error! Please provide a parsable date value in place of ${d}`
	return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}
const TIME_RANGES = {
	Past_hour: "now 1-H",
	Past_4_hours: "now 4-H",
	Past_day: "now 1-d",
	Past_7_days: "now 7-d",
	Past_30_days: "today 1-m",
	Past_90_days: "today 3-m",
	Past_12_months: "today 12-m",
	Past_5_years: "today 5-y",
	_2008_present: "all_2008",
	_2004_present: "all",
CUSTOM: (startDate, endDate) => `${fmtDate(startDate)} ${fmtDate(endDate)}`,
}
module.exports = { TIME_RANGES }