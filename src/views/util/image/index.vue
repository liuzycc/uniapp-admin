<template>
  <div class="container">
    <p class="title">图片工具</p>
    <el-upload
      v-loading="loaded"
      class="upload-demo"
      accept="image/*"
      :show-file-list="false"
      drag
      multiple
      :http-request="handleUpload"
    >
      <!-- :action="`${baseUrl}/image/upload`" -->
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">可使用拖转或点击的方式上传</div>
      <template #tip>
        <div class="el-upload__tip">
          上传之前尽量使用压缩工具压缩一遍再上传(为了减少服务器压力)，可使用网址：
          <span @click="openWin">https://tinypng.com/</span>
          进行压缩
        </div>
      </template>
    </el-upload>
    <el-table :data="imageList" style="width: 100%">
      <el-table-column label="图片" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img class="img" :src="scope.row.url" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="路径" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { baseUrl } from "@/environment";
import { uploadImage } from "@/api";
const loaded = ref(false);
const imageList = ref([]);
const handleUpload = async ({ file }: any) => {
  console.log(file);
  try {
    loaded.value = true;
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData);
    if (!res.isValid) return;
    console.log(res);
    imageList.value.unshift({
      url: `${baseUrl}${res.data.url}`,
    });
    localStorage.setItem("imgList", JSON.stringify(imageList.value));
  } finally {
    loaded.value = false;
  }
};
onMounted(() => {
  const imageListStorg: any = localStorage.getItem("imgList");
  if (imageListStorg) {
    imageList.value = JSON.parse(imageListStorg);
  }
});
const openWin = () => {
  open("https://tinypng.com/", "_blank");
};
</script>
<style scss scoped>
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
  }
  .el-upload__tip {
    span {
      color: #be86f0;
      cursor: pointer;
    }
  }
  .el-table {
    margin-top: 40px;
    .img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
  }
}
</style>
