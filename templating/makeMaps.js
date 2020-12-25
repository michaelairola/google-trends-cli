const fs = require('fs');
const axios = require('axios');
const { baseClient } = require('../lib/base_client.js');
const { geoListUrl, catListUrl, trendsExploreUrl } = require('../lib/constants/urls.js');

// can't reference utils cause then its a loop
const getNIDCookie = async () => {
  const res = await axios("https://google.com")
  const cookies = res.headers['set-cookie']
  return cookies.find(cookie => cookie.startsWith("NID"))
}

const getKey = name => {
	name = name.replaceAll(/[,\.'\&\-]/g,"")
	name = name.replaceAll(/\(.*\)/g, " ")
	name = name.replaceAll(/[ \-’]+/g, " ")
	name = name.replaceAll(" ", "_")
	name = name.replaceAll("+", "plus")
	name = name.replace(/_$/g, "")
	if(name.match(/^\d/)) name = `_${name}`
	return name
}

const writeFile = (obj, list, fileName) => {
	const listFileName = `./out/${fileName}.txt`
	fs.writeFile(listFileName, list, () => {
		console.log(`${listFileName} updated!`)
	})
	const mapFileName = `../lib/constants/${fileName}.js`
	fs.writeFile(mapFileName, obj, () => {
		console.log(`${mapFileName} updated!`)
	})	
}

const flattenChildren = parents => parents.reduce((acc,{ id, name, children }) => {
	let subchildren = [];
	if(children) subchildren = flattenChildren(children);
	acc = [ ...acc, { id, name }, ...subchildren ];
	return acc;
},[])
const sortAndCheckUniqueness = list => list.sort((a,b) => a.id - b.id).reduce((acc, { id, name }) => {
	const key = getKey(name);
	if(acc[key] && acc[key] != id) console.log("warning!", acc[key], id)
	acc[key] = id;
	return acc;
}, {});

const getGeos = async (cookie) => {	
	const { children } = await baseClient(geoListUrl, {}, { headers: { cookie } })
	let objStr = 'const GEOS = {\n';
	objStr += `\tAll: "",\n`
	let nameList = "GEO Options:\n";
	children.forEach(({ id, name, children }) => {
		let key = getKey(name);
		objStr += `\t${key}: "${id}",\n`
		nameList += `\t${key}\n`
	})
	objStr += `}\nmodule.exports = { GEOS };`
	writeFile(objStr, nameList, 'geos')
}
const getCats = async (cookie) => {	
	const { children } = await baseClient(catListUrl, {}, { headers: { cookie } })
	const allCats = sortAndCheckUniqueness(flattenChildren(children));
	let objStr = 'const CATEGORIES = {\n';
	objStr += `\tAll: 0,\n`
	Object.keys(allCats).forEach(key => {
		objStr += `\t${key}: ${allCats[key]},\n`
	})
	objStr += `}\nmodule.exports = { CATEGORIES };`
	let nameList = "Category Options:\n";
	children.forEach(({ id, name, children }) => {
		let key = getKey(name);
		nameList += `\t${key}\n`
	})
	writeFile(objStr, nameList, "categories")
}

const getTimes = async cookie => {
	const data = await baseClient(trendsExploreUrl, {}, { headers: { cookie } });
	const [ matchStr ] = data.match(/exploreTimePicker = \[.*?\]/)
	let exploreTimePicker = []
	eval(matchStr);
	let objStr = `const fmtDate = d => {
	if(typeof d == "string") d = new Date(d);
	if(isNaN(d)) throw \`Error! Please provide a parsable date value in place of \${d}\`
	return \`\${d.getFullYear()}-\${d.getMonth()+1}-\${d.getDate()}\`
}\n`
	objStr += `const TIME_RANGES = {\n`;
	let list = `TIME_RANGE Options\n`;
	exploreTimePicker.forEach(({ id, name }) => {
		const key = getKey(name) 
		objStr += `\t${key}: "${id}",\n`
		list += `\t${key}\n`
	})
	objStr += `CUSTOM: (startDate, endDate) => \`\${fmtDate(startDate)} \${fmtDate(endDate)}\`,\n`
	objStr += `}\nmodule.exports = { TIME_RANGES }`
	writeFile(objStr,list,"time_ranges")
}
const makeMaps = async () => {
	const cookie = await getNIDCookie();
	// getTimes(cookie);
	// getGeos(cookie);
	getCats(cookie);
}
makeMaps();