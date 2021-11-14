// API 驗證
import jsSHA from "jssha/dist/sha1";
const getAuthHeader = () => {
  const AppID = process.env.VUE_APP_PTX_ID;
  const AppKey = process.env.VUE_APP_PTX_KEY;
  const GMTString = new Date().toGMTString();
  const ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  const HMAC = ShaObj.getHMAC("B64");
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return { Authorization: Authorization, "X-Date": GMTString };
};

const perPage = 30; // 每頁顯示筆數
// $count=true 查看 API 剩餘次數

// 抓取 自行車租借站/及時車位 鄰近相關資料
// mode => Station/Availability
const getNearbyBikeInfo = (mode, lat, lon) => {
  let url = `https://ptx.transportdata.tw/MOTC/v2/Bike/${mode}/NearBy?`;
  url += `$spatialFilter=nearby(${lat},${lon},1000)&$format=JSON`;
  return fetch(url, { headers: getAuthHeader() }).then((res) => res.json());
};

// 抓取 景點/餐飲 鄰近相關資料
// mode => ScenicSpot/Restaurant
const getNearbyInfo = (mode, lat, lon) => {
  let url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/${mode}?`;
  url += `&$format=JSON&$select=ID,Name,Picture,Position`;
  url += `&$spatialFilter=nearby(${lat},${lon},1500)`;
  url += `&$filter=Picture/PictureUrl1 ne null`;
  return fetch(url, { headers: getAuthHeader() }).then((res) => res.json());
};

// 抓取 自行車道圖資
const getBikeShape = (city, page = 1) => {
  let url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${city}?`;
  url += `$top=${perPage}&$skip=${(page - 1) * perPage}&$format=JSON`;
  return fetch(url, { headers: getAuthHeader() }).then((res) => res.json());
};

export { getNearbyBikeInfo, getNearbyInfo, getBikeShape };
