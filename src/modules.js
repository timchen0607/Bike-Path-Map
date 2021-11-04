const jsSHA = require("jssha");
const getAuthHeader = () => {
  const AppID = "2dfbcb68d0e04fb5bc9d1f59f2e3df35";
  const AppKey = "HmEvi7uEhV77UNGt-MYo6ETs43E";
  const GMTString = new Date().toGMTString();
  const ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  const HMAC = ShaObj.getHMAC("B64");
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return { Authorization: Authorization, "X-Date": GMTString };
};

// 抓取 自行車租借站/及時車位 相關資料
// mode => Station/Availability
const getBikeInfo = (mode, city, top, skip) => {
  let url = "https://ptx.transportdata.tw/MOTC/v2/Bike/";
  url += `${mode}/${city}?$top=${top}&$skip=${skip}&$format=JSON`;
  return fetch(url, { headers: getAuthHeader }).then((res) => res.json());
};

// 抓取 自行車道圖資
const getBikeShape = (mode, city, top, skip) => {
  let url = "https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/";
  url += `${city}?$top=${top}&$skip=${skip}&$format=JSON`;
  return fetch(url, { headers: getAuthHeader }).then((res) => res.json());
};

// 抓取 自行車租借站/及時車位 鄰近相關資料
// mode => Station/Availability
const getNearbyBikeInfo = (mode, city, top, skip, lat, lon, meters) => {
  let url = "https://ptx.transportdata.tw/MOTC/v2/Bike/";
  url += `${mode}/${city}?$top=${top}&$skip=${skip}&$spatialFilter=nearby(${lat}%2C${lon}%2C${meters})&$format=JSON`;
  return fetch(url, { headers: getAuthHeader }).then((res) => res.json());
};

export { getBikeInfo, getBikeShape, getNearbyBikeInfo };
