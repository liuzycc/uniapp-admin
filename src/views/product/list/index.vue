<template>
  <div class="container">
    <p class="title">产品管理</p>
    <div class="select-info">
      <el-form :model="findForm" label-width="auto">
        <el-form-item label="商品名称">
          <el-input v-model="findForm.title" clearable />
        </el-form-item>
        <el-form-item label="一级分类" prop="sort1">
          <el-select
            v-model="findForm.sort1"
            placeholder="请选择"
            @change="findForm.sort2 = ''"
            clearable
          >
            <el-option
              v-for="(item, index) in sortList"
              :key="index"
              :label="item.s1.title"
              :value="item.s1.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="sort2">
          <el-select v-model="findForm.sort2" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in sort2List"
              :key="index"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="find-btn" :style="{ textAlign: 'right' }">
      <el-button type="primary" @click="handleFindListReset">重置</el-button>
      <el-button type="primary" @click="handleFindList">查询</el-button>
    </div>
    <el-button v-if="!isAddSearch" type="primary" @click="handleAddProcuct"
      >添加产品</el-button
    >
    <el-table
      v-loading="loaded"
      :data="currentList"
      :border="false"
      style="width: 100%"
    >
      <!-- <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">商品名称: {{ props.row.title }}</p>
            <p m="t-0 b-2">详情页展示名称: {{ props.row.showTitle }}</p>
            <p m="t-0 b-2">副标题: {{ props.row.subTitle }}</p>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="商品名称" prop="title" />
      <el-table-column label="详情页展示名称" prop="showTitle" />
      <el-table-column label="缩略图" prop="thum">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img class="img" :src="scope.row.thum" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="一级分类" prop="sort1Name" />
      <el-table-column label="二级分类" prop="sort2Name" />

      <el-table-column label="库存" prop="count" />
      <el-table-column label="已售数量" prop="sellNum" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button
            v-if="!isAddSearch"
            type="primary"
            @click="handleDetail(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="!isAddSearch"
            type="primary"
            @click="handleRemove(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="isAddSearch"
            type="primary"
            @click="handleAdd(scope.row)"
            >添加</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="page.num"
        :total="productList.length"
        @current-change="handleChangeCurrent"
        v-model:current-page="pageinationPage"
      />
    </div>
  </div>
  <ProductForm
    :isShow="dialogVisibleForm.isShow"
    :formInfo="dialogVisibleForm.formInfo"
    :sortList="dialogVisibleForm.sortList"
    @close="handleProductClose"
    @submit="handleProductSubmit"
  />
</template>
<script lang="ts" setup>
import {
  ref,
  onMounted,
  reactive,
  onBeforeUnmount,
  shallowRef,
  watch,
  computed,
} from "vue";
import {
  getProductList,
  getSortList,
  updateProductList,
  addProductList,
  removeProductList,
} from "@/api";
import { formatSort, paginate } from "@/utils";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import ProductForm from "./components/form.vue";
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
  isAddSearch: {
    type: Number,
    default: 0,
    required: false,
  },
  addType: {
    type: Number,
    default: 0,
    required: false,
  },
  addTypeProductList: {
    type: Object,
    default: [],
    required: false,
  },
});
const emits = defineEmits(["addSubmit"]);
const findFormState = {
  title: "",
  sort1: "",
  sort2: "",
};
const pageinationPage = ref(1);
const findForm = reactive({
  ...findFormState,
});
const sortList = ref([]);
const sort2List = computed(() => {
  if (!findForm.sort1) return [];
  return sortList.value.find((item) => item.s1.id === findForm.sort1).s2;
});
const productList = ref([]);
const currentList = ref([]);
const loaded = ref(false);
const page = {
  num: 10,
  index: 1,
};
// 表单弹窗
const dialogVisibleForm = reactive({
  isShow: false,
  formInfo: {},
  sortList: [],
});
watch(
  () => dialogVisibleForm.isShow,
  (v) => {
    if (v) return;
    dialogVisibleForm.formInfo = {};
  }
);
onMounted(async () => {
  await init();
});
const init = async () => {
  try {
    loaded.value = true;
    const r = await getSortList();
    if (!r.isValid) return;
    dialogVisibleForm.sortList = formatSort(r.data);
    sortList.value = formatSort(r.data);
    const res = await getProductList({});
    if (!res.isValid) return;
    productList.value = res.data;
    // 这里处理一级二级分类结构
    currentList.value = paginate(productList.value, page.num, page.index);
  } finally {
    loaded.value = false;
  }
};
const handleChangeCurrent = (num) => {
  page.index = num;

  currentList.value = paginate(productList.value, page.num, num);
};
const handleFindListReset = async () => {
  Object.assign(findForm, { ...findFormState });
  await handleFindList();
};
const handleFindList = async () => {
  try {
    loaded.value = true;
    page.index = 1;
    const res = await getProductList(findForm);
    if (!res.isValid) return;
    productList.value = res.data;
    pageinationPage.value = 1;
    currentList.value = paginate(productList.value, page.num, page.index);
  } finally {
    loaded.value = false;
  }
};
const handleAddProcuct = () => {
  dialogVisibleForm.formInfo = {};
  dialogVisibleForm.isShow = true;
};
const handleDetail = (t: any) => {
  const item = JSON.parse(JSON.stringify(t));
  item.tags = JSON.parse(item.tags);
  item.imgs = JSON.parse(item.imgs);
  item.config = JSON.parse(item.config);
  dialogVisibleForm.formInfo = item;
  dialogVisibleForm.isShow = true;
};
const handleRemove = async (item: any) => {
  try {
    await ElMessageBox.confirm(`确定删除商品【${item.title}】吗？`);
    const res = await removeProductList({ id: item.id });
    if (!res.isValid) return;
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    init();
  } catch {}
};
const handleAdd = async (row: any) => {
  const item = JSON.parse(JSON.stringify(row));
  // 判断不可重复添加
  const td = props.addTypeProductList.find((itm) => itm.id === item.id);
  if (td) {
    ElMessageBox.alert(`不可重复添加`);
    return;
  }
  let title = "";
  switch (props.addType) {
    case 1:
      title = "首页轮播";
      break;
    case 2:
      title = "现货特价";
      break;
    case 3:
      title = "新品专区";
      break;
  }
  try {
    await ElMessageBox.confirm(
      `确定添加商品【${item.title}】到【${title}】吗？`
    );
    switch (props.addType) {
      case 1:
        item.isHomeSwiper = 1;
        item.homeSwiperNum = props.addTypeProductList.length + 1;
        break;
      case 2:
        item.isHomeCheap = 1;
        item.homeCheapNum = props.addTypeProductList.length + 1;
        break;
      case 3:
        item.isHomeNewProduct = 1;
        item.homeNewProductNum = props.addTypeProductList.length + 1;
        break;
    }
    delete item.sort1Name;
    delete item.sort2Name;
    delete item.sort2sort;
    const res = await updateProductList(item);
    if (!res.isValid) return;
    emits("addSubmit", item);
  } catch {}
};
const handleProductClose = () => {
  dialogVisibleForm.isShow = false;
};
const handleProductSubmit = async (item: any) => {
  try {
    if (Object.keys(dialogVisibleForm.formInfo).length) {
      // 修改
      delete item.sort1Name;
      delete item.sort2Name;
      delete item.sort2sort;
      item.tags = JSON.stringify(item.tags);
      item.imgs = JSON.stringify(item.imgs);
      item.config = JSON.stringify(item.config);
      const res = await updateProductList(item);
      if (!res.isValid) return;
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    } else {
      // 新增
      item.tags = JSON.stringify(item.tags);
      item.imgs = JSON.stringify(item.imgs);
      item.config = JSON.stringify(item.config);
      delete item.id;
      const res = await addProductList({ ...item, isDelete: 0 });
      if (!res.isValid) return;
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    }
    dialogVisibleForm.isShow = false;
    init();
  } finally {
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
    .img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
    .el-button {
      display: block;
      margin: 10px;
    }
  }
}
.pagination {
  padding: 40px 0 0;
  display: flex;
  justify-content: center;
}
</style>
