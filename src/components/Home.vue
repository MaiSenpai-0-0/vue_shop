<template>
  <el-container>
    <!-- 头部导航栏 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut"> 退出 </el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="zhedie-button" @click="changCollapse">||||</div>
        <!-- 侧边栏导航 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          router
        >
          <!-- 一级侧边栏 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in viewList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="item1 in item.children"
              :key="item1.id"
              :index="'/' + item1.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item1.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      viewList: [],
      isCollapse: false,
    };
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //发送网络请求,获取左侧列表
    async getList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) console.log("请求失败");
      this.viewList = res.data;
      console.log(this.viewList);
    },
    // 改变折叠状态
    changCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style scope lang='less'>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.zhedie-button {
  font-size: 12px;
  background-color: #4a5064;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>