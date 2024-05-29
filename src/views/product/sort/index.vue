<template>
  <div class="container">
    <p class="title">分类管理</p>
    <el-button type="primary" @click="handleAddFirst">添加一级分类</el-button>
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
    <el-form>
      <el-form-item label="分类名称" label-width="140px">
        <el-input v-model="dialogInfo.sortName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogInfo.visible = false">取消</el-button>
        <el-button type="primary" @click="handelConfirmDislog">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { getSortList, addSortList, removeSortList } from "@/api";
import { ElLoading, ElMessageBox, ElMessage } from "element-plus";
import { formatSort, paginate } from "@/utils";
let loading: any = null;
const sortList = ref<any>([]);
const formatSortList = ref([]);
const currentList = ref([]);
const loaded = ref(false);
const pageNum = 10;
const dialogInfo = reactive<any>({
  visible: false,
  title: "添加分类",
  sortName: "",
  item: "",
});
const handelConfirmDislog = async () => {
  if (!dialogInfo.sortName) return;
  try {
    loading = ElLoading.service({
      lock: true,
      text: "请稍后",
      background: "rgba(0,0,0,.2)",
    });
    const params = {
      title: dialogInfo.sortName,
      level1: dialogInfo.item
        ? 0
        : sortList.value.filter((item) => item.level1 != 0).length + 1,
      level2: dialogInfo.item ? dialogInfo.item.s1.id : 0,
      isDelete: 0,
    };
    const res = await addSortList(params);
    if (!res.isValid) return;
    dialogInfo.visible = false;
    dialogInfo.sortName = "";
    dialogInfo.item = "";
    init();
  } finally {
    loading.close();
  }
};
onMounted(async () => {
  await init();
});

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
const handleRemove = async (info: any) => {
  try {
    console.log(info);
    await ElMessageBox.confirm(`确定删除一级分类【${info.s1.title}】吗？`);
    loading = ElLoading.service({
      lock: true,
      text: "请稍后",
      background: "rgba(0,0,0,.2)",
    });
    const idList = [info.s1.id];
    info.s2.forEach((item) => {
      idList.push(item.id);
    });
    const res = await removeSortList({ idList });
    if (!res.isValid) return;
    ElMessage({
      message: "移除成功",
      type: "success",
    });
    init();
  } catch {
    // 弹窗取消
    console.log("弹窗取消");
  } finally {
    loading.close();
  }
};
const handleClose = async (tag: any) => {
  try {
    await ElMessageBox.confirm(`确定删除二级分类【${tag.title}】吗？`);
    loading = ElLoading.service({
      lock: true,
      text: "请稍后",
      background: "rgba(0,0,0,.2)",
    });
    console.log(tag.id);
    const res = await removeSortList({ idList: [tag.id] });
    if (!res.isValid) return;
    ElMessage({
      message: "移除成功",
      type: "success",
    });
    init();
  } catch {
    // 弹窗取消
    console.log("弹窗取消");
  } finally {
    loading.close();
  }
};
const handleAdd = (tag: any) => {
  dialogInfo.item = tag;
  dialogInfo.visible = true;
};
const handleAddFirst = () => {
  dialogInfo.visible = true;
};
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
