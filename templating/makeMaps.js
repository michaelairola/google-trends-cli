const fs = require('fs');
const axios = require('axios');
const { baseClient } = require('../lib/base_client.js');
const { geoListUrl, catListUrl } = require('../lib/constants/urls.js');

// cant reference utils cause then its a loop
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
	name = name.replace(/_$/g, "")
	return name
}

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
	const geoListFileName = `./out/geos.txt`
	fs.writeFile(geoListFileName, nameList, () => {
		console.log(`${geoListFileName} updated!`)
	})
	const geoMapFileName = `../lib/constants/geos.js`
	fs.writeFile(geoMapFileName, objStr, () => {
		console.log(`${geoMapFileName} updated!`)
	})	
}
const getCats = async (cookie) => {	
	const { children } = await baseClient(catListUrl, {}, { headers: { cookie } })
	let objStr = 'const CATEGORIES = {\n';
	objStr += `\tAll: 0,\n`
	let nameList = "Category Options:\n";
	children.forEach(({ id, name, children }) => {
		let key = getKey(name);
		objStr += `\t${key}: ${id},\n`
		nameList += `\t${key}\n`
	})
	objStr += `}\nmodule.exports = { CATEGORIES };`
	const geoListFileName = `./out/categories.txt`
	fs.writeFile(geoListFileName, nameList, () => {
		console.log(`${geoListFileName} updated!`)
	})
	const geoMapFileName = `../lib/constants/categories.js`
	fs.writeFile(geoMapFileName, objStr, () => {
		console.log(`${geoMapFileName} updated!`)
	})	
}

const makeMaps = async () => {
	const cookie = await getNIDCookie();
	getGeos(cookie);
	getCats(cookie);
}
makeMaps();