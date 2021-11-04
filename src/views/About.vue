<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import { getBikeInfo } from "@/modules.js";

export default {
  name: "About",
  setup() {
    getBikeInfo("Station", "Taipei").then((res) => console.log(res));
    // getBikeInfo("Availability", "Taipei").then((res) => console.log(res));
  },
};
</script>
