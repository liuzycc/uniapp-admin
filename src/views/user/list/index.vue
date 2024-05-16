<template>
  <div class="container">
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="date" label="姓名" width="180" />
      <el-table-column prop="name" label="手机号" width="180" />
      <el-table-column prop="name" label="手机号" width="180" />
      <el-table-column prop="name" label="地址" width="180" />
      <el-table-column prop="name" label="头像" width="180" />
      <el-table-column prop="name" label="微信标识" width="180" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserList } from "@/api";
const userList = ref([]);
onMounted(async () => {
  await init();
});
const init = async () => {
  const res = await getUserList();
  if (!res.isValid) return;
  console.log(res);
  userList.value = res.data;
};
</script>

<style scss scoped>
.container {
}
</style>
