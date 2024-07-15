<template>
  <div class="container">
    <p class="title">分类管理</p>
    <el-button type="primary" @click="handleAddFirst">添加一级分类</el-button>
    <el-table
      :data="currentList"
      stripe
      style="width: 100%"
      :row-key="
        (row) => {
          return row.s1.id;
        }
      "
      :expand-row-keys="expandedRowKeys"
      @expand-change="expandOpen"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <div class="table-info">
            <div class="select-box">
              <el-select
                placeholder="请选择二级分类"
                style="width: 240px"
                v-model="scope.row.selectValud"
                @change="handleSelect(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.s2"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="tb" v-if="scope.row.productList?.length">
              <Draggable
                class="list-group"
                :component-data="{
                  tag: 'ul',
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null,
                }"
                v-model="scope.row.productList"
                v-bind="dragOptions"
                @start="drag = true"
                @end="handleMoveProductListEnd(scope.row)"
                item-key="id"
              >
                <template #item="{ element: row }">
                  <li class="list-group-item production-list">
                    <img :src="row.thum" alt="" />
                    <p>{{ row.title }}</p>
                  </li>
                </template>
              </Draggable>
            </div>
            <div class="empty" v-else>暂无数据</div>
          </div>
        </template>
      </el-table-column>
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
              <Draggable
                class="list-group"
                :component-data="{
                  tag: 'ul',
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null,
                }"
                v-model="scope.row.s2"
                v-bind="dragOptions"
                @start="drag = true"
                @end="handleMoveEnd(scope.row)"
                item-key="id"
              >
                <template #item="{ element: tag }">
                  <li class="list-group-item">
                    <el-tag
                      type="info"
                      closable
                      :disable-transitions="false"
                      @click="handleDetail(tag)"
                      @close="handleClose(tag)"
                    >
                      {{ tag.title }}
                    </el-tag>
                  </li>
                </template>
              </Draggable>
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
        :total="formatSortList.length"
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
import {
  getSortList,
  addSortList,
  updataSortList,
  removeSortList,
  getProductList,
  updateProductList,
} from "@/api";
import { ElLoading, ElMessageBox, ElMessage } from "element-plus";
import Draggable from "vuedraggable";
import { formatSort, paginate } from "@/utils";
let loading: any = null;
const sortList = ref<any>([]);
const formatSortList = ref([]);
const currentList = ref([]);
const loaded = ref(false);
const pageNum = 10;
const drag = ref(false);
const expandedRowKeys = ref([]);
const dragOptions = reactive({
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
});
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
const handleDetail = async (tag: any) => {
  console.log(tag);
  ElMessageBox.prompt("分类名称", "二级分类修改", {
    confirmButtonText: "修改",
    cancelButtonText: "取消",
    inputValue: tag.title,
    inputPattern: /\S/,
    inputErrorMessage: "不可为空",
    draggable: true,
  })
    .then(async ({ value }) => {
      const res = await updataSortList({ id: tag.id, title: value });
      if (!res.isValid) {
        ElMessage.error("保存失败请重试");
        return;
      }
      tag.title = value;
      ElMessage({
        type: "success",
        message: `保存成功`,
      });
    })
    .catch(() => {});
};
const handleAdd = (tag: any) => {
  dialogInfo.item = tag;
  dialogInfo.visible = true;
};
const handleAddFirst = () => {
  dialogInfo.visible = true;
};
const handleMoveEnd = (v) => {
  drag.value = false;
  if (v.s2?.length <= 1) return;
  v.s2.forEach(async (item, index) => {
    await updataSortList({ id: item.id, sort: index });
  });
};
const handleMoveProductListEnd = (v) => {
  drag.value = false;
  if (v.productList?.length <= 1) return;
  v.productList.forEach(async (item, index) => {
    await updateProductList({ id: item.id, psort: index });
  });
};
// 表格优化
const remove = (array: any[], val: any) => {
  const index = array.findIndex((item) => item === val);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
};
const expandOpen = async (row: any, expand: any) => {
  if (!remove(expandedRowKeys.value, row.s1.id)) {
    expandedRowKeys.value.push(row.s1.id);
  }
};
const handleSelect = async (row: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "请稍后",
    background: "rgba(0,0,0,.2)",
  });
  try {
    const res = await getProductList({
      sort1: row.s1.id,
      sort2: row.selectValud,
    });
    if (!res.isValid) return;
    row.productList = res.data.sort((a, b) => a.psort - b.psort);
  } finally {
    loading.close();
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
    p {
      display: block;
      width: 100%;
    }
    .list-group-item {
      display: inline-block;
    }
    .el-tag {
      margin: 10px 20px;
      font-size: 15px;
      font-weight: bold;
      padding: 15px 10px;
      cursor: pointer;
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
/* 拖拽 */
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: var(--header-bg-color);
  border-radius: 7px;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.table-info {
  padding: 20px;
  text-align: center;
  .select-box {
    display: flex;
    align-items: center;
  }
  .empty {
    width: 100%;
    text-align: center;
    padding: 30px;
    color: rgba(0, 0, 0, 0.2);
  }
  .list-group {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 20px 0;
  }
  .production-list {
    text-align: center;
    font-size: 12px;
    margin: 10px;
    width: 100px;
    padding: 5px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 7px;
    }
  }
}
</style>
