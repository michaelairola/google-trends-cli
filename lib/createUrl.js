
const encodeJson = json => encodeURI(JSON.stringify(json))

const jsonToQueryStr = (json = {}) => Object.keys(json).map(key => 
  typeof json[key] == "object" ? 
    `${key}=${encodeJson(json[key])}` :
    `${key}=${json[key]}`
).join("&")

const createUrl = (base, queryObj) => `${base}?${jsonToQueryStr(queryObj)}`

module.exports = createUrl;