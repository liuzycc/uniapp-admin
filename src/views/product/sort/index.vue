<template>
  <div class="container">
    <p class="title">分类管理</p>
    <el-table :data="currentList" stripe style="width: 100%">
      <el-table-column label="分类">
        <template #default="scope">
          <div>
            <p>分类1级</p>
            <div class="">
              <el-tag type="warning">
                {{ scope.row.s1.title }}
              </el-tag>
            </div>
          </div>
          <div style="">
            <p>分类2级</p>
            <div class="">
              <el-tag
                v-for="tag in scope.row.s2"
                :key="tag.id"
                type="info"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag.title }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" @click="handleAdd(scope.row)"
            >添加二级分类</el-button
          >
          <el-button type="primary" @click="handleRemove(scope.row)"
            >移除一级分类</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageNum"
        :total="currentList.length"
        @current-change="handleChangeCurrent"
      />
    </div>
  </div>
  <el-dialog v-model="dialogInfo.visible" :title="dialogInfo.title" width="500">
    <el-form :model="form">
      <el-form-item label="分类名称" label-width="140px">
        <el-input v-model="dialogInfo.sortName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, dialogInfo } from "vue";
import { getSortList } from "@/api";
const sortList = ref([]);
const formatSortList = ref([]);
const currentList = ref([]);
const loaded = ref(false);
const pageNum = 10;
const dialogInfo = reactive({
  visible: true,
  title: "",
  sortName: "",
});
onMounted(async () => {
  await init();
});
const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
const init = async () => {
  try {
    loaded.value = true;
    const res = await getSortList();
    if (!res.isValid) return;
    sortList.value = res.data;
    // 这里处理一级二级分类结构
    const fList = formatSort(res.data);
    formatSortList.value = fList;
    currentList.value = paginate(formatSortList.value, pageNum, 1);
  } finally {
    loaded.value = false;
  }
};
const handleChangeCurrent = (num) => {
  currentList.value = paginate(formatSortList.value, pageNum, num);
};
const formatSort = (list) => {
  const sort1 = [];
  const sort2 = [];
  const res = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (t.isDelete === 1) continue;
    if (t.level1 === 0) {
      // 二级分类
      sort2.push(t);
    } else if (t.level2 === 0) {
      // 一级分类
      sort1.push(t);
    }
  }
  for (let i = 0; i < sort1.length; i++) {
    const t = sort1[i];
    const tl = sort2.filter((item) => item.level2 === t.id);
    res.push({
      s1: t,
      s2: tl,
    });
  }
  return res;
};
const handleRemove = (info: any) => {
  console.log(info);
};
const handleClose = (tag: any) => {
  console.log(tag.id);
};
const handleAdd = (tag: any) => {};
</script>
<style scss scoped>
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
  }
  .el-table {
    p {
      display: block;
      width: 100%;
    }
    .el-tag {
      margin: 20px;
      font-size: 15px;
      font-weight: bold;
      padding: 15px 10px;
    }
  }
  .el-table {
    border: 0.5px solid #ccc;
  }
  .pagination {
    padding: 40px 0 0;
    display: flex;
    justify-content: center;
  }
  .el-button {
    display: block;
    margin: 10px;
  }
}
</style>
