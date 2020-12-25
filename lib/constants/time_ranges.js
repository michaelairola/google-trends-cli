const fmtDate = d => {
	if(typeof d == "string") d = new Date(d);
	if(isNaN(d)) throw `Error! Please provide a parsable date value in place of ${d}`
	return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}
const TIME_RANGES = {
	PAST_HOUR: "now 1-H",
	PAST_4_HOURS: "now 4-H",
	PAST_DAY: "now 1-d",
	PAST_7_DAYS: "now 7-d",
	PAST_30_DAYS: "today 1-m",
	PAST_90_DAYS: "today 3-m",
	PAST_12_MONTHS: "today 12-m",
	PAST_5_YEARS: "today 5-y",
	_2008_PRESENT: "all_2008",
	_2004_PRESENT: "all",
CUSTOM: (startDate, endDate) => `${fmtDate(startDate)} ${fmtDate(endDate)}`,
}
module.exports = { TIME_RANGES }