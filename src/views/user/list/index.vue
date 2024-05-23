<template>
  <div class="container">
    <p class="title">用户管理</p>
    <div class="select-info">
      <el-form :model="findForm" label-width="auto">
        <el-form-item label="姓名">
          <el-input v-model="findForm.name" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="findForm.phone" clearable />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="findForm.address" clearable />
        </el-form-item>
      </el-form>
    </div>
    <div class="find-btn" :style="{ textAlign: 'right' }">
      <el-button type="primary" @click="handleFindListReset">重置</el-button>
      <el-button type="primary" @click="handleFindList">查询</el-button>
    </div>
    <el-table
      v-loading="loaded"
      :data="userCurrentList"
      stripe
      style="width: 100%"
    >
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
        v-model:current-page="pageinationPage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onActivated, reactive } from "vue";
import { getUserList } from "@/api";
const findFormState = {
  name: "",
  phone: "",
  address: "",
};
const findForm = reactive({ ...findFormState });
const loaded = ref(false);
const userList = ref([]);
const userCurrentList = ref([]);
const page = {
  num: 10,
  index: 1,
};
const pageinationPage = ref(1);

const showList = ref([]);
onActivated(() => {
  console.log("我来了", userList.value);
});
onMounted(async () => {
  await init();
});
const init = async () => {
  const res = await getUserList();
  if (!res.isValid) return;
  userList.value = res.data;
  userCurrentList.value = paginate(res.data, page.num, page.index);
};
const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
const handleChangeCurrent = (num) => {
  userCurrentList.value = paginate(userList.value, page.num, num);
};
const handleFindListReset = async () => {
  Object.assign(findForm, { ...findFormState });
  await handleFindList();
};
const handleFindList = async () => {
  try {
    loaded.value = true;
    const res = await getUserList(findForm);
    if (!res.isValid) return;
    userList.value = res.data;
    userCurrentList.value = paginate(res.data, page.num, page.index);
    pageinationPage.value = 1;
  } finally {
    loaded.value = false;
  }
};
</script>

<style scss scoped>
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
  }
  .el-table {
    margin-top: 20px;
    border: 0.5px solid #ccc;
  }
  .pagination {
    padding: 40px 0 0;
    display: flex;
    justify-content: center;
  }
}
</style>
