<template>
  <div class="container">
    <p class="title">产品管理</p>
    <div class="select-info">
      <el-form :model="findForm" label-width="auto">
        <el-form-item label="订单姓名">
          <el-input v-model="findForm.sname" clearable />
        </el-form-item>
        <el-form-item label="订单电话">
          <el-input v-model="findForm.sphone" clearable />
        </el-form-item>
        <el-form-item label="订单地址">
          <el-input v-model="findForm.saddress" clearable />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="findForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in findForm.statusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="find-btn" :style="{ textAlign: 'right' }">
      <el-button type="primary" @click="handleFindListReset">重置</el-button>
      <el-button type="primary" @click="handleFindList">查询</el-button>
    </div>
    <el-table
      v-loading="loaded"
      :data="shopCurrentList"
      stripe
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="table-info">
            <div
              class="tb"
              v-if="props.row.products.list?.length"
              v-for="(item, index) in props.row.products.list"
            >
              <div class="tb-info">
                <img :src="item.productInfo.thum" alt="" />
                <div>
                  <p class="t">
                    <span>商品名称：</span>{{ item.productInfo.title }}
                  </p>
                  <p v-for="(itm, idx) in item.config" :key="'pt' + idx">
                    <span>{{ itm.name }}：</span>
                    {{ `${itm.selectList.join(",")}` }}
                  </p>
                  <p>数量：x{{ item.num }}</p>
                </div>
              </div>
            </div>
            <div class="empty" v-else>暂无数据</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="下单日期" width="150">
        <template #default="scope">
          <div>
            {{ scope.row.date ? formatDate(scope.row.date) : "未知" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sname" label="订单姓名" width="100">
        <template #default="scope">
          <div>{{ scope.row.sname || "未知" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sphone" label="订单手机号" width="120">
        <template #default="scope">
          <div>{{ scope.row.sphone || "未知" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="saddress" label="订单地址">
        <template #default="scope">
          <div>{{ scope.row.saddress || "未知" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template #default="scope">
          <div :class="['statusT' + scope.row.status]">
            {{ formatStatus(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注信息" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" @click="handleStatus(scope.row)"
            >编辑状态</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="page.num"
        :total="shopList.length"
        @current-change="handleChangeCurrent"
        v-model:current-page="pageinationPage"
      />
    </div>
  </div>
  <el-dialog v-model="dialogStatus" title="编辑状态" width="500">
    <el-select v-model="status" placeholder="请选择">
      <el-option label="待处理" :value="0" />
      <el-option label="处理中" :value="1" />
      <el-option label="已完成" :value="2" />
    </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleStatusDiaCancel">取消</el-button>
        <el-button type="primary" @click="handleStatusDiaConfirm">
          修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { paginate, formatStatus, formatDate } from "@/utils";
import { getShopList, updateShopList } from "@/api";
import { ElMessage } from "element-plus";

const findFormState = {
  sname: "",
  sphone: "",
  saddress: "",
  status: null,
  statusList: [
    {
      value: 0,
      name: "待处理",
    },
    {
      value: 1,
      name: "处理中",
    },
    {
      value: 2,
      name: "已完成",
    },
  ],
};
const pageinationPage = ref(1);
const findForm = reactive({
  ...findFormState,
});

const loaded = ref(false);
const shopList = ref([]);
const shopCurrentList = ref([]);
const page = {
  num: 10,
  index: 1,
};
const status = ref(null);
const rowId = ref("");
const dialogStatus = ref(false);
onMounted(async () => {
  await init();
});
const init = async () => {
  const res = await getShopList({});
  if (!res.isValid) return;
  shopList.value = res.data;
  shopCurrentList.value = paginate(res.data, page.num, page.index);
};
const handleChangeCurrent = (num) => {
  page.index = num;
  shopCurrentList.value = paginate(shopList.value, page.num, num);
};
const handleStatus = (row) => {
  console.log(row);
  status.value = row.status;
  rowId.value = row.id;
  dialogStatus.value = true;
};
const handleStatusDiaCancel = () => {
  status.value = null;
  rowId.value = "";
  dialogStatus.value = false;
};
const handleStatusDiaConfirm = async () => {
  if (!status.value || !rowId.value) return;
  try {
    const res = await updateShopList({ id: rowId.value, status: status.value });
    if (!res.isValid) return;
    handleStatusDiaCancel();
    ElMessage({
      message: "修改成功",
      type: "success",
    });
    await init();
  } finally {
  }
};
const handleFindListReset = async () => {
  Object.assign(findForm, { ...findFormState });
  page.index = 1;
  await handleFindList();
};
const handleFindList = async () => {
  try {
    loaded.value = true;
    const { statusList, ...arg } = findForm;
    const res = await getShopList(arg);
    if (!res.isValid) return;
    shopList.value = res.data;
    shopCurrentList.value = paginate(res.data, page.num, page.index);
    pageinationPage.value = 1;
  } finally {
    loaded.value = false;
  }
};
</script>
<style scss scoped>
el-button {
  display: inline-block;
}
.container {
  padding-top: 40px;
  .title {
    margin-bottom: 20px;
  }
  .el-table {
    margin-top: 20px;
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
    .el-button {
      display: block;
      margin: 10px;
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
}
.statusT0 {
  color: brown;
}
.statusT1 {
  color: blue;
}
.statusT2 {
  color: green;
}
.table-info {
  /* display: flex;
  align-items: center;
  justify-content: flex-start; */
  /* flex-wrap: wrap; */
  .tb:first-child {
    border-top: none;
  }
  .tb {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
    /* border-radius: 5px; */
    /* border: 1px solid rgba(0, 0, 0, 0.2); */
  }
  .tb-info {
    display: flex;
    align-items: center;
    img {
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 7px;
      margin-right: 10px;
    }
    & > div {
      min-height: 100px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      p {
        span {
          font-weight: bold;
        }
      }
    }
  }
  .empty {
    width: 100%;
    text-align: center;
    padding: 30px;
    color: rgba(0, 0, 0, 0.2);
  }
}
</style>
