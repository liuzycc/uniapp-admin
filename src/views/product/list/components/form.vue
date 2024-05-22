<template>
  <el-dialog
    v-model="model"
    title="商品详情"
    width="900"
    class="form-dialog-container"
    :overflow="true"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleFormRef">
      <el-form-item label="商品名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="展示标题"
        prop="showTitle"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.showTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="商品描述"
        prop="subTitle"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.subTitle" autocomplete="off" />
      </el-form-item>
      <!-- 分类 -->

      <el-form-item label="缩略图" prop="thum" :label-width="formLabelWidth">
        <el-input v-model="form.thum" autocomplete="off" />
      </el-form-item>

      <el-form-item label="一级分类" prop="sort1" :label-width="formLabelWidth">
        <el-select
          v-model="form.sort1"
          placeholder="请选择"
          @change="form.sort2 = ''"
        >
          <el-option
            v-for="(item, index) in sortList"
            :key="index"
            :label="item.s1.title"
            :value="item.s1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="sort2" :label-width="formLabelWidth">
        <el-select v-model="form.sort2" placeholder="请选择">
          <el-option
            v-for="(item, index) in sort2List"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签" :label-width="formLabelWidth">
        <div class="flex">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            ref="InputRef"
            v-if="inputVisible"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + 新标签
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="库存" :label-width="formLabelWidth">
        <el-input-number v-model="form.count" :min="0" />
      </el-form-item>
      <el-form-item label="已售数量" :label-width="formLabelWidth">
        <el-input-number v-model="form.sellNum" :min="0" />
      </el-form-item>
    </el-form>
    <!-- 编辑器 -->
    <el-form-item label="产品说明" :label-width="formLabelWidth">
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
    <!-- 配置图片 -->
    <el-form-item label="配置图片" :label-width="formLabelWidth">
      <el-upload
        v-loading="loaded"
        :file-list="imgInfo.fileList"
        :http-request="handleUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="imgInfo.dialogVisible">
        <img w-full :src="imgInfo.dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <!-- 配置选项 config -->
    <el-form-item label="配置选项" :label-width="formLabelWidth">
      <el-button type="primary" @click="handleTableAdd">
        + 新增配置项
      </el-button>
      <el-table :data="form.config" border style="width: 100%">
        <el-table-column prop="name" label="配置项名称" width="100" />
        <el-table-column prop="isMultiple" label="配置类型" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <p>{{ scope.row.isMultiple ? "多选" : "单选" }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="list" label="配置项(每一项用,分割)" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              type="primary"
              @click="handleTableDetail(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              @click="handleTableRemove(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 配置项弹窗 -->
  <el-dialog v-model="dialogFormConfig.visible" title="配置项" width="500">
    <el-form :model="dialogFormConfig.form">
      <el-form-item label="配置项名称" :label-width="formLabelWidth">
        <el-input v-model="dialogFormConfig.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="单选/多选" :label-width="formLabelWidth">
        <el-radio-group v-model="dialogFormConfig.form.isMultiple" class="ml-4">
          <el-radio :value="false" size="large">单选</el-radio>
          <el-radio :value="true" size="large">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配置项名称" :label-width="formLabelWidth">
        <el-input v-model="dialogFormConfig.form.list" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handledDialogFormConfigCale">取消</el-button>
        <el-button type="primary" @click="handledDialogFormConfig">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  reactive,
  ref,
  watch,
  computed,
  shallowRef,
  onBeforeUnmount,
  nextTick,
} from "vue";
import type { UploadProps, UploadUserFile, ElInput } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { baseUrl } from "@/environment";
import { uploadImage } from "@/api";
const formState = {
  title: "",
  showTitle: "",
  subTitle: "",
  tags: [],
  imgs: [],
  thum: "",
  sort1: "",
  sort2: "",
  count: 0,
  sellNum: 0,
  info: "",
  config: [],
};
const imgInfoState = {
  dialogVisible: false,
  dialogImageUrl: "",
  fileList: [],
};
const dialogFormConfigState = {
  visible: false,
  rowIndex: null,
  form: {
    name: "",
    isMultiple: false,
    list: [],
  },
};
const emit = defineEmits(["close", "submit"]);
const props = defineProps(["isShow", "formInfo", "sortList"]);
const dialogFormVisible = ref(false);
const formLabelWidth = "100px";
const loaded = ref(false);
const sortList = computed(() => props.sortList);
const sort2List = computed(() => {
  if (!form.sort1) return [];
  return sortList.value.find((item) => item.s1.id === form.sort1).s2;
});
const form = reactive({ ...formState });
const ruleFormRef = ref();
const rules = reactive({
  title: [
    {
      required: true,
      message: "请填写产品名称",
      trigger: "blur",
    },
  ],
  showTitle: [
    {
      required: true,
      message: "请填写详情展示名称",
      trigger: "blur",
    },
  ],
  subTitle: [
    {
      required: true,
      message: "请填写商品描述",
      trigger: "blur",
    },
  ],
  thum: [
    {
      required: true,
      message: "请填写缩略图",
      trigger: "blur",
    },
  ],
  sort1: [
    {
      required: true,
      message: "请选择一级分类",
      trigger: "blur",
    },
  ],
  sort2: [
    {
      required: true,
      message: "请选择二级分类",
      trigger: "blur",
    },
  ],
});
const model = ref(false);
// config 弹窗
const dialogFormConfig = reactive({
  ...dialogFormConfigState,
});
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const editorConfig = reactive({
  placeholder: "请输入内容...",
});

// tags
const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
// 图片
const imgInfo = reactive({ ...imgInfoState });
watch(
  () => props.isShow,
  (v: boolean) => {
    model.value = v;
  },
  {
    immediate: true,
  }
);
watch(
  () => props.formInfo,
  (v: any) => {
    if (!Object.keys(v).length) {
      Object.assign(form, { ...formState });
      Object.assign(imgInfo, { ...imgInfoState });
      return;
    }
    imgInfo.fileList = v.imgs;
    Object.assign(form, v);
  },
  {
    immediate: true,
  }
);
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// tags cbfn start
const handleTagClose = (tag: string) => {
  const t = form.tags;
  t.splice(t.indexOf(tag), 1);
  form.tags = t;
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  const t = form.tags;
  if (inputValue.value) {
    t.push(inputValue.value);
    form.tags = t;
  }
  inputVisible.value = false;
  inputValue.value = "";
};
// tags cbfn end
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
  }
};
// imgs cbfn end
// table cbfn start
const handleTableAdd = () => {
  dialogFormConfig.visible = true;
};
const handleTableDetail = (item, index) => {
  dialogFormConfig.visible = true;
  dialogFormConfig.form = JSON.parse(JSON.stringify(item));
  dialogFormConfig.rowIndex = index;
};
const handleTableRemove = (item, index) => {
  form.config.splice(index, 1);
};
// table cbfn end
// config cbfn start
const handledDialogFormConfigCale = () => {
  // 重置
  Object.assign(dialogFormConfig, { ...dialogFormConfigState });
};
const handledDialogFormConfig = () => {
  const temp = {
    ...dialogFormConfig.form,
    list: dialogFormConfig.form.list.split(","),
  };
  if (dialogFormConfig.rowIndex != null) {
    // 修改
    form.config[dialogFormConfig.rowIndex] = temp;
  } else {
    // 新增
    form.config.push(temp);
  }
  dialogFormConfig.visible = false;
  dialogFormConfig.form = {
    name: "",
    isMultiple: false,
    list: [],
  };
  dialogFormConfig.rowIndex = null;
};
// config cbfn end
const handleClose = () => {
  emit("close", false);
};
const handleSubmit = async (ruleFormRef) => {
  if (!ruleFormRef) return;
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      emit("submit", JSON.parse(JSON.stringify(form)));
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scss>
.form-dialog-container {
  height: 600px;
  overflow-y: scroll;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .el-tag {
    margin-right: 10px;
  }
}
.el-table {
  margin-top: 40px;
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
</style>
