<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单包裹tabs -->
      <el-form
        ref="addFomrRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs标签页 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品参数" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTabelData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件,且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      activeIndex: "0",
      //   校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //   添加商品信息
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
      },
      //   商品分类列表
      cateList: [],
      //   动态参数数据列表
      manyTabelData: [],
      //静态数据列表
      onlyTableData: [],
      //设置请求头
      headerObj: {
        Autherization: window.sessionStorage.getItem("token"),
      },
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.cateList = res.data;
      //   console.log(this.cateList);
    },
    // 级联选择器选中触发
    handleChange() {
      console.log(this.addForm.goods_cat);
      //   如果不是选中的三级分类,则清空选择框
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = [];
    },
    // 切换标签页触发
    beforeTabLeave(activeName, odlActiveName) {
      // console.log(activeName,odlActiveName);
      if (odlActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选中商品分类");
        return false;
      }
    },
    async tabClick() {
      //   console.log(this.activeIndex);
      // 选中的时商品动态参数面板
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        res.data.forEach((i) => {
          i.attr_vals = i.attr_vals.length === 0 ? [] : i.attr_vals.split(",");
        });
        // console.log(res.data);
        this.manyTabelData = res.data; //manyTableData 时数组
      }
      // 选中的时商品属性面板
      else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理图片缩放
    handlePreview() {},
    // 处理图片删除
    handleRemove() {},
  },
  created() {
    this.getGoodsList();
  },
};
</script>

<style>
</style>