<template>
  <div class="home">
    <div class="map" id="map"></div>
    <div class="ctrl">
      <button class="ctrl-btn">找鐵馬</button>
      <button class="ctrl-btn">找車位</button>
      <button class="ctrl-btn">找車道</button>
      <button class="ctrl-btn">定位</button>
    </div>
    <div class="bike">
      <h3 class="bike-title"></h3>
      <p class="bike-status"></p>
      <div><span>可租借車數</span><span></span></div>
      <div><span>可歸還車位</span><span></span></div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { onMounted, ref } from "@vue/runtime-core";
import { getNearbyBikeInfo, getNearbyInfo } from "../modules.js";

export default {
  name: "Home",
  components: {},
  setup() {
    let map = null;
    const lat = ref(25.05);
    const lon = ref(121.49);
    const initMap = () => {
      const tile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      map = L.map("map").setView([lat.value, lon.value], 17);
      L.tileLayer(tile, { attribution: attribution }).addTo(map);
    };
    const loadData = () => {
      getNearbyBikeInfo("Availability", lat.value, lon.value).then((space) => {
        getNearbyBikeInfo("Station", lat.value, lon.value).then((res) => {
          res.forEach((item, idx) => {
            const pos = item.StationPosition;
            const status = space[idx].ServiceStatus === 1 ? true : false;
            const ico = L.divIcon({
              html: `<div class="pin ${status ? "" : "pin-error"}">
              ${space[idx].AvailableRentBikes}</div>`,
            });
            const card = `<div class="bike">
            <h3 class="bike-title">${item.StationName.Zh_tw.replace("_", " ")}
            </h3><p class="${status ? "bike-success" : "bike-error"}">
            ${status ? "正常營運" : "暫停營運"}</p>
            <div class="bike-available">
            <span>可租借車數<br/>${space[idx].AvailableRentBikes}</span>
            <span>可歸還車位<br/>${space[idx].AvailableReturnBikes}</span>
            </div></div>`;
            L.marker([pos.PositionLat, pos.PositionLon], { icon: ico })
              .addTo(map)
              .bindPopup(card)
              .openPopup();
          });
          // console.log(res);
        });
        // console.log(space);
      });
      getNearbyInfo("ScenicSpot", lat.value, lon.value).then((res) => {
        res.forEach((item) => {
          const pos = item.Position;
          const ico = L.divIcon({ html: `<div class="pin pin-spot"></div>` });
          const card = `<div class="bike"></div>`;
          L.marker([pos.PositionLat, pos.PositionLon], { icon: ico })
            .addTo(map)
            .bindPopup(card)
            .openPopup();
        });
        // console.log(res);
      });
      getNearbyInfo("Restaurant", lat.value, lon.value).then((res) => {
        res.forEach((item) => {
          const pos = item.Position;
          const ico = L.divIcon({
            html: `<div class="pin pin-restaurant"></div>`,
          });
          const card = `<div class="bike"></div>`;
          L.marker([pos.PositionLat, pos.PositionLon], { icon: ico })
            .addTo(map)
            .bindPopup(card)
            .openPopup();
        });
        // console.log(res);
      });
    };

    onMounted(() => {
      initMap();
      loadData();
    });
  },
};
</script>
