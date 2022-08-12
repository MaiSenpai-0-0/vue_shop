<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 渲染订单数据 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column prop="" label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showDialog"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-success"
              @click="showProgessBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改信息对话框 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%">
      <el-form :model="addressForm" label-width="100px">
        <el-form-item label="省市区/县:"
          ><el-cascader
            :options="cityData"
            v-model="addressForm.address"
          ></el-cascader
        ></el-form-item>
        <el-form-item label="详细地址:">
          <el-input v-model="addressForm.addressDetial"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
        <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in kuaidiList"
          :key="index"
          :timestamp="kuaidiList.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      //   控制对话框隐藏
      dialogVisible: false,
      progressVisible: false,
      //   所修改的内容
      addressForm: {
        address: "",
        addressDetial: "",
      },
      cityData: cityData,
      //   快递信息
      kuaidiList: [],
    };
  },

  methods: {
    // 获取订单列表
    // 原生axios写法
    getOrderList() {
      axios("https://lianghj.top:8888/api/private/v1/orders", {
        method: "get",
        timeout: 3000,
        headers: {
          Authorization: window.sessionStorage.getItem("token"),
        },
        params: {
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize,
        },
      }).then(
        (res) => {
          this.total = res.data.data.total;
          this.orderList = res.data.data.goods;
          console.log(this.orderList);
        },
        (err) => {
          console.log(err);
        }
      );
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    // 修改信息对话框
    showDialog() {
      this.dialogVisible = true;
    },
    // 物流信息对话框
    async showProgessBox() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败");
      this.kuaidiList = res.data;
      console.log(this.kuaidiList);
      this.progressVisible = true;
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>