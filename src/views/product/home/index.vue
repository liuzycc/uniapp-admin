<template>
  <el-card>
    <p class="title">
      首页轮播： <el-button @click="cardType = 1">添加</el-button>
    </p>
    <div class="" v-if="list.swiperList.length">
      <Draggable
        class="list-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-model="list.swiperList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="handleMoveEnd(list.swiperList, 1)"
        item-key="id"
      >
        <template #item="{ element: row, index }">
          <div class="list-group-item production-list">
            <img :src="row.thum" alt="" />
            <p>{{ row.title }}</p>
            <CircleCloseFilled
              class="menu-icon"
              @click="handleRemove(row, index, 1)"
            />
          </div>
        </template>
      </Draggable>
    </div>
    <div class="empty" v-else>暂无数据</div>
  </el-card>
  <el-card>
    <p class="title">
      现货特价：<el-button @click="cardType = 2">添加</el-button>
    </p>
    <div class="" v-if="list.CheapPriceList.length">
      <Draggable
        class="list-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-model="list.CheapPriceList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="handleMoveEnd(list.CheapPriceList, 2)"
        item-key="id"
      >
        <template #item="{ element: row, index }">
          <div class="list-group-item production-list">
            <img :src="row.thum" alt="" />
            <p>{{ row.title }}</p>
            <CircleCloseFilled
              class="menu-icon"
              @click="handleRemove(row, index, 2)"
            />
          </div>
        </template>
      </Draggable>
    </div>
    <div class="empty" v-else>暂无数据</div>
  </el-card>
  <el-card>
    <p class="title">
      新品专区：<el-button @click="cardType = 3">添加</el-button>
    </p>
    <div class="" v-if="list.newProductList.length">
      <Draggable
        class="list-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        v-model="list.newProductList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="handleMoveEnd(list.newProductList, 3)"
        item-key="id"
      >
        <template #item="{ element: row, index }">
          <div class="list-group-item production-list">
            <img :src="row.thum" alt="" />
            <p>{{ row.title }}</p>
            <CircleCloseFilled
              class="menu-icon"
              @click="handleRemove(row, index, 3)"
            />
          </div>
        </template>
      </Draggable>
    </div>
    <div class="empty" v-else>暂无数据</div>
  </el-card>

  <el-dialog
    v-model="dialogTableVisible"
    title="请选择要添加的商品"
    width="900"
    :before-close="handleClose"
  >
    <ProductPage
      :isAddSearch="1"
      :addType="cardType"
      :addTypeProductList="currentList"
      @addSubmit="addSubmit"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed, onBeforeMount } from "vue";
import ProductPage from "@/views/product/list/index.vue";
import { getProductList, updateProductList } from "@/api/index";
import Draggable from "vuedraggable";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
const dialogTableVisible = ref(false);
const list = reactive<any>({
  swiperList: [],
  CheapPriceList: [],
  newProductList: [],
});
const currentList = computed(() => {
  let t = [];
  switch (cardType.value) {
    case 1:
      t = list.swiperList;
      break;
    case 2:
      t = list.CheapPriceList;
      break;
    case 3:
      t = list.newProductList;
      break;
  }
  return t;
});
const cardType = ref(0);
const drag = ref(false);
const dragOptions = reactive({
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
});
watch(cardType, (v) => {
  if (!v) {
    dialogTableVisible.value = false;
    return;
  }
  dialogTableVisible.value = true;
});
onBeforeMount(async () => {
  await init();
});
const init = async () => {
  const resList = await Promise.all([
    await getProductList({ isHomeSwiper: 1 }),
    await getProductList({ isHomeCheap: 1 }),
    await getProductList({ isHomeNewProduct: 1 }),
  ]);
  console.log(resList);
  if (resList[0].isValid) {
    list.swiperList = [
      ...resList[0].data.sort((a, b) => a.homeSwiperNum - b.homeSwiperNum),
    ];
  }
  if (resList[1].isValid) {
    list.CheapPriceList = resList[1].data.sort(
      (a, b) => a.homeCheapNum - b.homeCheapNum
    );
  }
  if (resList[2].isValid) {
    list.newProductList = resList[2].data.sort(
      (a, b) => a.homeNewProductNum - b.homeNewProductNum
    );
  }
};
const handleMoveEnd = (list, type: number) => {
  updateSortList(list, type);
};
const handleDetail = () => {};
const handleClose = () => {
  cardType.value = 0;
  dialogTableVisible.value = false;
};
// 添加成功回调
const addSubmit = (item: any) => {
  switch (cardType.value) {
    case 1:
      list.swiperList.push(item);
      break;
    case 2:
      list.CheapPriceList.push(item);
      break;
    case 3:
      list.newProductList.push(item);
      break;
  }
  ElMessage.success("添加成功");
};
// 删除成功回调
const removeSubmit = (item: any, type: number, index: number) => {
  switch (type) {
    case 1:
      list.swiperList.splice(index, 1);
      break;
    case 2:
      list.CheapPriceList.splice(index, 1);
      break;
    case 3:
      list.newProductList.splice(index, 1);
      break;
  }
  ElMessage.success("添加成功");
};
// type 1 轮播 2 现货特检 3 新品专区
const handleRemove = async (item: any, idx: number, type: 1 | 2 | 3) => {
  await ElMessageBox.confirm(`确定删除吗？`, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  });
  try {
    switch (type) {
      case 1:
        item.isHomeSwiper = 0;
        item.homeSwiperNum = null;
        break;
      case 2:
        item.isHomeCheap = 0;
        item.homeCheapNum = null;
        break;
      case 3:
        item.isHomeNewProduct = 0;
        item.homeNewProductNum = null;
        break;
    }
    delete item.sort1Name;
    delete item.sort2Name;
    delete item.sort2sort;
    const res = await updateProductList(item);
    if (!res.isValid) return;
    removeSubmit(item, type, idx);
    ElMessage.success("删除成功");
  } catch {}
};
// 更新数组排序索引
const updateSortList = async (list: any[], type: number) => {
  const loading = ElLoading.service({
    lock: true,
    text: "请稍后",
    background: "rgba(0,0,0,.2)",
  });
  switch (type) {
    case 1:
      try {
        const apiList = list.map(async (itm, index) => {
          const item = JSON.parse(JSON.stringify(itm));
          item.homeSwiperNum = index;
          delete item.sort1Name;
          delete item.sort2Name;
          delete item.sort2sort;
          return await updateProductList(item);
        });
        const res: any = Promise.all(apiList);
        const errorInfo = res.find((item) => !item.isValid);
        if (!errorInfo) {
          ElMessage.error("更新排序失败，请刷新页面重试");
          return;
        }
        ElMessage.success("更新排序成功");
      } finally {
        loading.close();
      }
      break;
    case 2:
      try {
        const apiList = list.map(async (itm, index) => {
          const item = JSON.parse(JSON.stringify(itm));
          item.homeCheapNum = index;
          delete item.sort1Name;
          delete item.sort2Name;
          delete item.sort2sort;
          return await updateProductList(item);
        });
        const res: any = Promise.all(apiList);
        const errorInfo = res.find((item) => !item.isValid);
        if (!errorInfo) {
          ElMessage.error("更新排序失败，请刷新页面重试");
          return;
        }
        ElMessage.success("更新排序成功");
      } finally {
        loading.close();
      }
      break;
    case 3:
      try {
        const apiList = list.map(async (itm, index) => {
          const item = JSON.parse(JSON.stringify(itm));
          item.homeNewProductNum = index;
          delete item.sort1Name;
          delete item.sort2Name;
          delete item.sort2sort;
          return await updateProductList(item);
        });
        const res: any = Promise.all(apiList);
        const errorInfo = res.find((item) => !item.isValid);
        if (!errorInfo) {
          ElMessage.error("更新排序失败，请刷新页面重试");
          return;
        }
        ElMessage.success("更新排序成功");
      } finally {
        loading.close();
      }
      break;
  }
};
</script>
<style scss scoped>
.menu-icon {
  width: 1.5em;
  height: 1.5em;
  position: absolute;
  right: 10px;
  top: 10px;
}
.el-card {
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.empty {
  width: 100%;
  text-align: center;
  padding: 30px;
  color: rgba(0, 0, 0, 0.2);
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
.list-group-item {
  cursor: move;
  position: relative;
}

.list-group-item i {
  cursor: pointer;
}
.list-group {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 20px 0;
  min-height: 20px;
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
</style>
