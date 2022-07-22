<template>
  <div ref="images" class="images">
    <img :src="imageList[choseResult]" alt="Vue logo" width="888">
    <div class="content">
      <p>
        {{ userAddress.slice(0, 21) }}
        <br/>
        {{ userAddress.slice(-21) }}
      </p>
    </div>
  </div>
  <select v-model="choseResult">
    <option value="航海家">航海家</option>
    <option value="探险家">探险家</option>
    <option value="贡献人">贡献人</option>
  </select>
  <br/>
  <input v-model="userAddress" placeholder="User Address" type="text">
  <br/>
  <button @click="downloadAll">开始批量刻字</button>
</template>

<script setup>
import {ref} from 'vue'
import html2canvas from "html2canvas"

import data from './data/data.json'
import image1 from '@/assets/1.png'
import image2 from '@/assets/2.png'
import image3 from '@/assets/3.png'

const images = ref(null)
let choseResult = ref("航海家")
let userAddress = ref("0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7")

const imageList = {
  航海家: image1, 探险家: image2, 贡献人: image3
}

const lazyLoadImage = (i) => new Promise((resolve) => {
  setTimeout(() => {
    console.log(data[i])
    userAddress.value = data[i].attributes[1].value
    choseResult.value = data[i].attributes[0].value
    downloadImage(data[i].tokenId)
    resolve()
  }, 3000)
})

const downloadAll = async () => {
  for (let i = 0; i < data.length; i++) {
    await lazyLoadImage(data, i)
  }
}

const downloadImage = (data, tokenId) => {
  html2canvas(images.value, {scale: 3}).then(function (canvas) {
    const aLabel = document.createElement("a");
    aLabel.href = canvas.toDataURL();
    aLabel.download = tokenId; // 下载的文件名
    aLabel.click();
  });
}
</script>

<style>
.images {
  width: 888px;
  height: 888px;
  position: relative;
}

.content {
  position: absolute;
  bottom: 35px;
  font-size: 0.9rem;
  color: #623924;
  right: 60px;
  font-weight: 800;
  line-height: 1;
  font-family: "Ubuntu Mono";
}
</style>
