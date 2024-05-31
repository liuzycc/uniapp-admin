<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg1">
            <User />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color1" :end="info.userList.length" />
            <div>用户数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg2">
            <ChatDotRound />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color2" :end="shopT0.length" />
            <div>待处理订单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg3">
            <Goods />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color3" :end="info.productList.length" />
            <div>商品数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" body-class="card-body">
          <el-icon class="card-icon bg4">
            <ShoppingCartFull />
          </el-icon>
          <div class="card-content">
            <countup class="card-num color4" :end="info.shopList.length" />
            <div>订单总量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mgb20">
      <el-col :span="18">
        <el-card shadow="hover">
          <div class="card-header">
            <p class="card-header-title">订单动态</p>
            <p class="card-header-desc">
              最近一周下单量（日期区间选择过长可能会影响性能，尽可能控制在一个星期以内）
            </p>
            <el-date-picker
              v-model="pickerData"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="shortcuts"
              format="YYYY/MM/DD"
              :size="'default'"
            />
          </div>
          <v-chart
            v-if="chartOpt.xAxis.data.length"
            class="chart"
            :option="chartOpt"
          />
          <div class="empty" v-else>暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-header pid">
            <p class="card-header-title">品类分布</p>
            <p class="card-header-desc">所有一级分类下对应商品数量分布</p>
          </div>
          <v-chart class="chart" :option="pidOptions" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="home-box">
            <p>首页配置</p>
            <el-form :model="form" ref="ruleFormRef">
              <el-form-item label="首页顶部图片">
                <el-upload
                  v-loading="loaded"
                  :file-list="imgInfo.fileList"
                  :http-request="handleUpload"
                  list-type="picture-card"
                  :accept="'image/*'"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>

                <el-dialog v-model="imgInfo.dialogVisible">
                  <img
                    w-full
                    :src="imgInfo.dialogImageUrl"
                    alt="Preview Image"
                  />
                </el-dialog>
              </el-form-item>
              <el-form-item label="首页内容">
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
                    v-model="form.info"
                    style="height: 400px; overflow-y: hidden"
                    @onCreated="handleCreated"
                  />
                </div>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import {
  getProductList,
  getSortList,
  getUserList,
  getShopList,
  uploadImage,
  getHomeList,
  createHomeList,
  updateHomeList,
} from "@/api";
import {
  reactive,
  onMounted,
  onActivated,
  computed,
  ref,
  onBeforeUnmount,
  shallowRef,
} from "vue";
import { ElLoading, ElMessage } from "element-plus";
import type { UploadProps, UploadUserFile, ElInput } from "element-plus";

import { colorRandom, getShopChatOptions } from "@/utils";
import { baseUrl } from "@/environment";

import countup from "@/components/countup.vue";
import { use, registerMap } from "echarts/core";
import { BarChart, LineChart, PieChart, MapChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { dashOpt1, dashOpt2, mapOptions } from "./chart/options";
import chinaMap from "@/utils/china";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  LineChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  MapChart,
]);
registerMap("china", chinaMap);
const formState = {
  imgs: [],
  info: "",
};
const imgInfoState = {
  dialogVisible: false,
  dialogImageUrl: "",
  fileList: [],
};
const form = reactive({ ...formState });
// 图片
const imgInfo = reactive({ ...imgInfoState });
// 内容 HTML
const editorConfig = reactive({
  placeholder: "请输入内容...",
});
const loaded = ref(false);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const info = reactive<any>({
  userList: [],
  productList: [],
  shopList: [],
  sortList: [],
  homeInfo: {},
});
const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  //   {
  //     text: "最近三个月",
  //     value: () => {
  //       const end = new Date();
  //       const start = new Date();
  //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
  //       return [start, end];
  //     },
  //   },
];
const chartOpt = computed(() => {
  return getShopChatOptions(info.shopList, pickerData.value);
});
const pickerData = ref([]);
const shopT0 = computed(() => info.shopList.filter((itm) => itm.status === 0));
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
onActivated(async () => {
  const t = shortcuts[0].value();
  pickerData.value = [t[0], t[1]];
  await init();
});
const pidOptions = computed(() => {
  const dashOptions = {
    legend: {
      bottom: "1%",
      left: "center",
    },
    color: [],
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        data: [],
      },
    ],
    tooltip: {
      show: true,
    },
  };
  const c = [];
  const t = [];
  info.sortList.forEach((itm) => {
    if (itm.level2 === 0) {
      c.push(colorRandom());
      t.push({
        id: itm.id,
        name: itm.title,
        level1: itm.level1,
        value: 0,
      });
    }
  });
  for (let i = 0; i < info.productList.length; i++) {
    const tp = info.productList[i];
    const idx = t.findIndex((it) => it.id === tp.sort1);
    if (idx != -1) {
      t[idx].value += 1;
    }
  }
  dashOptions.color = c;
  dashOptions.series[0].data = t;
  return dashOptions;
});
const init = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.2)",
  });
  try {
    const apiList = [
      getUserList(),
      getProductList({}),
      getShopList({}),
      getSortList(),
      getHomeList({}),
    ];
    const res = await Promise.all(apiList);
    if (res[0].isValid) {
      info.userList = res[0].data;
    }
    if (res[1].isValid) {
      info.productList = res[1].data;
    }
    if (res[2].isValid) {
      info.shopList = res[2].data;
    }
    if (res[3].isValid) {
      info.sortList = res[3].data;
    }
    if (res[4].isValid) {
      if (res[4].data.length) {
        res[4].data[0].imgs = JSON.parse(res[4].data[0].imgs);
        info.homeInfo = res[4].data[0];
        form.imgs = info.homeInfo.imgs;
        imgInfo.fileList = info.homeInfo.imgs;
        form.info = info.homeInfo.html;
      }
    }
  } finally {
    loading.close();
  }
};

// imgs cbfn start
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  imgInfo.fileList = uploadFiles;
  form.imgs = imgInfo.fileList;
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  imgInfo.dialogImageUrl = uploadFile.url!;
  imgInfo.dialogVisible = true;
};
const handleUpload = async ({ file }: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "请稍后",
    background: "rgba(0,0,0,.2)",
  });
  try {
    loaded.value = true;
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData);
    if (!res.isValid) return;
    imgInfo.fileList.push({
      url: `${baseUrl}${res.data.url}`,
    });
    form.imgs = imgInfo.fileList;
  } finally {
    loaded.value = false;
    loading.close();
  }
};
// imgs cbfn end
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleSubmit = async () => {
  if (!form.imgs.length) {
    ElMessage({
      message: "请配置首页顶部图片",
      type: "error",
    });
    return;
  }
  if (!form.info) {
    ElMessage({
      message: "请配置首页内容",
      type: "error",
    });
    return;
  }
  console.log("submit", JSON.parse(JSON.stringify(form)));
  if (!info.homeInfo.id) {
    // 不存在需要创建
    const r = await createHomeList({
      imgs: JSON.stringify(form.imgs),
      html: form.info,
    });
    if (!r.isValid) return;
    info.homeInfo = r.data;
  }
  // 修改
  const r = await updateHomeList({
    id: info.homeInfo.id,
    imgs: JSON.stringify(form.imgs),
    html: form.info,
  });
  if (!r.isValid) return;
  ElMessage({
    message: "保存成功",
    type: "success",
  });
};
</script>

<style>
.card-body {
  display: flex;
  align-items: center;
  height: 100px;
  padding: 0;
}
</style>
<style scoped>
.card-content {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
  padding: 0 20px;
}

.card-num {
  font-size: 30px;
}

.card-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.bg1 {
  background: #2d8cf0;
}

.bg2 {
  background: #64d572;
}

.bg3 {
  background: #f25e43;
}

.bg4 {
  background: #e9a745;
}

.color1 {
  color: #2d8cf0;
}

.color2 {
  color: #64d572;
}

.color3 {
  color: #f25e43;
}

.color4 {
  color: #e9a745;
}

.chart {
  width: 100%;
  height: 400px;
}

.card-header {
  padding-left: 10px;
  margin-bottom: 20px;
}
.card-header.pid {
  padding-bottom: 52px;
}
.card-header-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-header-desc {
  font-size: 14px;
  color: #999;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #000;
}

.timeline-time,
.timeline-desc {
  font-size: 12px;
  color: #787878;
}

.rank-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rank-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f2f2f2;
  text-align: center;
  line-height: 40px;
  margin-right: 10px;
}

.rank-item-content {
  flex: 1;
}

.rank-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #343434;
  margin-bottom: 10px;
}

.rank-item-desc {
  font-size: 14px;
  color: #999;
}
.map-chart {
  width: 100%;
  height: 350px;
}
.empty {
  color: rgba(0, 0, 0, 0.2);
  text-align: center;
  margin: 182px 0;
}
.home-box {
  & > p {
    margin-bottom: 20px;
  }
  & > div {
    text-align: right;
    el-button {
      display: inline-block;
    }
  }
}
</style>
<style>
.el-range-editor {
  margin-top: 20px;
}
</style>
