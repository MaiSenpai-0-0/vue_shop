<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置参数!"
        type="warning"
        show-icon=""
        :closable="false"
      ></el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            class="cascader"
            v-model="seletedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border stripe>
            <!-- 索引列 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editForm(scope.row)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editForm(scope.row)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item :label="titleText" prop="atte_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="editFormRef" :model="editFormData" label-width="80px">
        <el-form-item :label="titleText" prop="atte_name">
          <el-input v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormDataPut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 按钮与文本框
      inputVisible: false,
      // 文本框输入内容
      inputValue: "",
      // 商品分类列表
      cateList: [],
      //   级联选择框双向绑定的数据
      seletedKeys: [],
      parentCateList: [],
      //   被激活的页签名称
      activeName: "only",
      //   获取到的数据
      manyData: [],
      onlyData: [],
      //   控制添加对话的隐藏
      addDialogVisible: false,
      //   修改对话框
      editDialogVisible: false,
      addForm: {},
      //   修改的值
      editFormData: {},
    };
  },
  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取商品失败");
      this.cateList = res.data;
    },
    // 级联选择框,选中触发
    handleChange() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.seletedKeys.length !== 3) {
        this.seletedKeys === 0;
        return;
      }
      //   获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.split(" ");
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName == "many") this.manyData = res.data;
      if (this.activeName == "only") this.onlyData = res.data;
    },
    // tab页签点击事件
    handleTabClick() {
      this.getParamsData();
    },
    // 添加分类表单网络请求
    async addFormData() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      console.log(res.data);
      if (res.meta.status !== 201) return this.$message.error("提交失败");
      this.getParamsData();
      this.addDialogVisible = false;
    },
    // 修改
    editForm(a) {
      this.editDialogVisible = true;
      console.log(a);
      this.editFormData = a;
    },
    async editFormDataPut() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editFormData.attr_id}`,
        {
          attr_name: this.editFormData.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
      //   console.log(res.meta.status);
      this.editDialogVisible = false;
      this.getParamsData();
    },
    // 文本框失去焦点
    async handleInputConfirm(row) {
      row.inputVisible = false;
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //   发送网络请求
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(""),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
    },
    // 点击按钮,展示输入文本框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.split(i, 1);
    },
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用,则返回true
    isBtnDisabled() {
      if (this.seletedKeys.length !== 3) return true;
      return false;
    },
    // 当前选择分类的id
    cateId() {
      if (this.seletedKeys.length === 3) return this.seletedKeys[2];
      return null;
    },
    titleText() {
      if (this.activeName == "many") return "动态参数";
      return "静态参数";
    },
  },
};
</script>

<style style="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader-panel {
  display: flex;
  border-radius: 4px;
  font-size: 14px;
  height: 100px;
}
.el-scrollbar__wrap {
  height: 200px;
}
.input-new-tag {
  width: 150px;
}
</style>