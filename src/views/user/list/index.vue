<template>
  <div class="container">
    <p class="title">用户管理</p>
    <el-table :data="userCurrentList" stripe style="width: 100%">
      <el-table-column prop="id" label="id" width="50" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="avatar" label="头像" width="100" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="remake" label="备注信息" />
      <el-table-column prop="openid" label="微信标识" />
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="page.num"
        :total="userList.length"
        @current-change="handleChangeCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserList } from "@/api";
const userList = ref([]);
const userCurrentList = ref([]);
const page = {
  num: 10,
  index: 1,
};
const showList = ref([]);
onMounted(async () => {
  await init();
});
const init = async () => {
  const res = await getUserList();
  if (!res.isValid) return;
  console.log(res);
  userList.value = res.data;
  userCurrentList.value = paginate(res.data, page.num, page.index);
};
const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
const handleChangeCurrent = (num) => {
  console.log(num);
  userCurrentList.value = paginate(userList.value, page.num, num);
};
</script>

<style scss scoped>
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
  }
  .el-table {
    border: 0.5px solid #ccc;
  }
  .pagination {
    padding: 40px 0 0;
    display: flex;
    justify-content: center;
  }
}
</style>
