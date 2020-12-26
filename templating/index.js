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
	name = name.replaceAll(/[,\.'\&​]/g,"")
	name = name.replaceAll(/\(.*\)/g, " ")
	name = name.replaceAll(/[/– \-’]+/g, " ")
	name = name.replaceAll(" ", "_")
	name = name.replaceAll("+", "plus")
	name = name.replace(/_$/g, "")
	if(name.match(/^\d/)) name = `_${name}`
	name = name.toUpperCase()
	return name
}

const writeFile = (obj, list, fileName) => {
	const listFileName = `../docs/${fileName}.md`
	fs.writeFile(listFileName, list, () => {
		console.log(`${listFileName} updated!`)
	})
	const mapFileName = `../lib/constants/${fileName}.js`
	fs.writeFile(mapFileName, obj, () => {
		console.log(`${mapFileName} updated!`)
	})	
}
const listOfUnunique = (parents, acc = [], NonUnique = []) => {
	parents.forEach(({ id, name, children }) => {
		const key = getKey(name)
		const sameKeyList = acc.filter(v => v.key == key);
		if(sameKeyList.length && !sameKeyList.find(v => v.id == id)){
			if(!NonUnique.includes(key)) {
				NonUnique = [ ...NonUnique, key ]
			}
		} else acc = [ ...acc, { key, id } ];
		if(children) {
			NonUnique = listOfUnunique(children, acc, NonUnique)
		}
	})
	return NonUnique;
}
const flattenChildrenWithUniqueKeys = (parents, NonUniqueList, parentsId = false, parentsKey, acc = []) => {
	parents.forEach(({ id, name, children }) => {
		let key = getKey(name);
		const uniqueKey = parentsKey ? `${parentsKey}_${key}` : key
		let newId = parentsId === true ? id : parentsId ? `${parentsId}-${id}` : false; 
		id = parentsId ? newId : id;
		if(NonUniqueList.includes(key)) {
			key = uniqueKey;
		} 
		if(!acc.find(v => v.id == id) || !acc.find(v => v.key == key)) {
			acc = [ ...acc, { id, key } ];
		}
		acc = children ? flattenChildrenWithUniqueKeys(children, NonUniqueList, newId, uniqueKey, acc) : acc;
	})
	return acc
}
const sortById = list => list.sort((a,b) => a.id - b.id);
const sortByKey = list => list.sort((a,b) => {
	if(a.key < b.key) { return -1; }
    if(a.key > b.key) { return 1; }
    return 0;
})

const renderDropDown = (parents, NonUniqueList, parentsKey) => 
	parents.map(({ name, children }) => {
		let key = getKey(name);
		const uniqueKey = parentsKey ? `${parentsKey}_${key}` : key
		if(NonUniqueList.includes(key)) {
			key = uniqueKey;
		} 
		return children ? 
`<li><details>
<summary>${key}</summary>
<ul>
${renderDropDown(children, NonUniqueList, uniqueKey)}
</ul>
</details></li>` :
`<li>${key}</li><br>`
	}).join(`\n`)


const getGeos = async (cookie) => {	
	let { children } = await baseClient(geoListUrl, {}, { headers: { cookie } })
	children = [ { name: "All", id: "" }, ...children ];
	const NonUniqueGeos = listOfUnunique(children)
	const allGeos = sortByKey(flattenChildrenWithUniqueKeys(children, NonUniqueGeos, true))
	let objStr = 'const GEOS = {\n';
	allGeos.forEach(({ id, key }) => {
		objStr += `\t${key}: "${id}",\n`
	})
	objStr += `}\nmodule.exports = { GEOS };`
	let list = "# GEO Options:\n";
	list += `<ul>${renderDropDown(children, NonUniqueGeos)}</ul>`
	writeFile(objStr, list, 'geos')
}

const getCats = async (cookie) => {	
	let { children } = await baseClient(catListUrl, {}, { headers: { cookie } })
	children = [ { id: 0, name: "All" }, ...children ] 
	const NonUniqueCats = listOfUnunique(children)
	const allCats = sortById(flattenChildrenWithUniqueKeys(children, NonUniqueCats))
	let objStr = 'const CATEGORIES = {\n';
	allCats.forEach(({ id, key }) => {
		objStr += `\t${key}: ${id},\n`
	})
	objStr += `}\nmodule.exports = { CATEGORIES };`
	let list = "# Category Options:\n";
	list += `<ul>${renderDropDown(children, NonUniqueCats)}</ul>`
	writeFile(objStr, list, "categories")
}

const getTimes = async cookie => {
	const data = await baseClient(trendsExploreUrl, {}, { headers: { cookie } });
	const [ matchStr ] = data.match(/exploreTimePicker = \[.*?\]/)
	let exploreTimePicker = []
	eval(matchStr);
	let objStr = 
`const fmtDate = d => {
	if(typeof d == "string") d = new Date(d);
	if(isNaN(d)) throw \`Error! Please provide a parsable date value in place of \${d}\`
	return \`\${d.getFullYear()}-\${d.getMonth()+1}-\${d.getDate()}\`
}\n`
	objStr += `const TIME_RANGES = {\n`;
	let list = `# TIME_RANGE Options\n<ul>\n`;
	exploreTimePicker.forEach(({ id, name }) => {
		const key = getKey(name) 
		objStr += `\t${key}: "${id}",\n`
		list += `\t<li>${key}</li>\n`
	})
	list += `</ul>`
	objStr += `CUSTOM: (startDate, endDate) => \`\${fmtDate(startDate)} \${fmtDate(endDate)}\`,\n`
	objStr += `}\nmodule.exports = { TIME_RANGES }`
	writeFile(objStr,list,"time_ranges")
}
const makeMaps = async () => {
	const cookie = await getNIDCookie();
	getTimes(cookie);
	getGeos(cookie);
	getCats(cookie);
}
makeMaps();