<template>
  <div class="container">
    <p class="title">产品管理</p>
    <div class="select-info">我是筛选区域</div>
    <el-button type="primary" @click="handleAddProcuct">添加产品</el-button>
    <el-table :data="currentList" :border="false" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">商品名称: {{ props.row.title }}</p>
            <p m="t-0 b-2">详情页展示名称: {{ props.row.showTitle }}</p>
            <p m="t-0 b-2">副标题: {{ props.row.subTitle }}</p>
          </div>
        </template>
      </el-table-column>
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
          <el-button type="primary" @click="handleRemove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑器 -->
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="{}"
        :mode="'default'"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="'default'"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive, onBeforeUnmount, shallowRef } from "vue";
import { getProductList } from "@/api";
import { formatSort, paginate } from "@/utils";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

const productList = ref([]);
const currentList = ref([]);
const loaded = ref(false);
const pageNum = 10;

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("<p>hello</p>");
const editorConfig = reactive({
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      onBeforeUpload: () => {
        console.log("我来了");
      },
      customInsert: (res: any, insertFn) => {
        console.log("此功能无效");
        insertFn("");
      },
    },
  },
});

onMounted(async () => {
  await init();
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const init = async () => {
  try {
    loaded.value = true;
    const res = await getProductList();
    if (!res.isValid) return;
    productList.value = res.data;
    // 这里处理一级二级分类结构
    currentList.value = paginate(productList.value, pageNum, 1);
  } finally {
    loaded.value = false;
  }
};
const handleAddProcuct = () => {};
</script>
<style scss scoped>
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
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
