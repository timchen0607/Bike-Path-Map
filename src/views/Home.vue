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
import { onMounted } from "@vue/runtime-core";
import { getNearbyBikeInfo } from "../modules.js";

export default {
  name: "Home",
  components: {},
  setup() {
    let map = null;
    const initMap = () => {
      const tile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      map = L.map("map").setView([25.05, 121.49], 17);
      L.tileLayer(tile, { attribution: attribution }).addTo(map);
    };
    const loadData = () => {
      getNearbyBikeInfo("Availability", "25.05", "121.49").then((space) => {
        getNearbyBikeInfo("Station", "25.05", "121.49").then((res) => {
          res.forEach((item, idx) => {
            console.log(space[idx].AvailableRentBikes);
            const pos = item.StationPosition;
            const ico = L.divIcon({
              html: `<div class="pin">${space[idx].AvailableRentBikes}</div>`,
            });
            const status =
              space[idx].ServiceStatus === 1 ? "正常營運" : "暫停營運";
            const card = `<div class="bike">
            <h3 class="bike-title">${item.StationName.Zh_tw.replace("_", " ")}
            </h3><p class="bike-status">${status}</p>
            <div>
            <span>可租借車數<br/>${space[idx].AvailableRentBikes}</span>
            <span>可歸還車位<br/>${space[idx].AvailableReturnBikes}</span>
            </div></div>`;
            L.marker([pos.PositionLat, pos.PositionLon], { icon: ico })
              .addTo(map)
              .bindPopup(card)
              .openPopup();
          });
          console.log(res);
        });
      });
    };

    onMounted(() => {
      initMap();
      loadData();
    });
  },
};
</script>
