<template>
  <div class="container">
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
    <div class="control">
      <div><b>仪表盘</b></div>
      身份： <select v-model="choseResult">
      <option value="航海家">航海家</option>
      <option value="探险家">探险家</option>
      <option value="贡献人">贡献人</option>
    </select>
      <div>
        地址：
        <input v-model="userAddress" placeholder="User Address" type="text">
      </div>
      <div>
        <button @click="downloadAllImage">开始批量刻字</button>
        <button @click="downloadCanvasImage('自定义刻字')">自定义刻字</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import html2canvas from "html2canvas"

import data from './data/data.json'
import image1 from '@/assets/1.png'
import image2 from '@/assets/2.png'
import image3 from '@/assets/3.png'

const images = ref(null)
const choseResult = ref("航海家")
const userAddress = ref("0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7")

const imageList = {航海家: image1, 探险家: image2, 贡献人: image3}

const downloadAllImage = async () => {
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].tokenId)
    await lazyDownloadOnceImage(data, i)
  }
}

const lazyDownloadOnceImage = (data, index) => new Promise((resolve) => {
  setTimeout(() => {
    userAddress.value = data[index].attributes[1].value
    choseResult.value = data[index].attributes[0].value
    downloadCanvasImage(data[index].tokenId)
    resolve()
  }, 500)
})


const downloadCanvasImage = async (fileName) => {
  setTimeout(() => {
    html2canvas(images.value, {scale: 3}).then(function (canvas) {
      const aLabel = document.createElement("a");
      aLabel.href = canvas.toDataURL();
      aLabel.download = fileName; // 下载的文件名
      aLabel.click();
    });
  }, 0) // 延迟0ms，保证在下一个tick中执行
}
</script>

<style>
.container {
  display: flex;
}

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

.control {
  margin: 10px;
  padding: 10px;
  border: 5px solid #000;
  height: 140px;
  line-height: 2;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
}

.control input {
  width: 330px;
}

#app {
  background-image: linear-gradient(to top, #0250c5 0%, #d43f8d 100%);
}

.control button {
  margin-right: 20px;
}
</style>
