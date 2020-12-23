const axios = require("axios");
const env = process.env;

const getHostLang = () => 
	env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES || "en-US";

const getTzOffset = () =>
	new Date().getTimezoneOffset();

const getNIDCookie = async () => {
  const res = await axios("https://google.com")
  const cookies = res.headers['set-cookie']
  return cookies.find(cookie => cookie.startsWith("NID"))
}


module.exports = { getHostLang, getTzOffset }