<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="RoleList" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              :class="['boderBottom', 'vcenter']"
            >
              <!-- 一级权限列表 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <li class="el-icon-caret-right"></li>
              </el-col>
              <!-- 二三级权限列表 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :class="['boderBottom', 'vcenter']"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <li class="el-icon-caret-right"></li>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="setDefault"
    >
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        ref="reference"
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defKeys: [],
      setRightVisable: false,
      RoleList: [],
      dialogVisible: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      roleId: "",
      idStr: [],
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.RoleList = res.data;
    },
    async removeRight(role, right) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.error("取消删除了!");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${right}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      //   this.getRolesList()
      role.children = res.data;
    },
    //分配权限对话框
    async showDialog(role) {
      this.roleId = role.id;
      this.dialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightList = res.data;
      this.getLeafKey(role, this.defKeys);
      console.log(this.defKeys);
      this.dialogVisible = true;
    },
    // 通过递归,获取角色下三级权限id
    getLeafKey(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => {
        this.getLeafKey(item, arr);
      });
    },
    //关闭权限分配对话框时,初始化数组
    setDefault() {
      this.defKeys = [];
    },
    // 添加用户
    addRole() {},
    //分配权限,网咯请求
    async addRoleRight() {
      const keys = [
        ...this.$refs.reference.getCheckedKeys(),
        ...this.$refs.reference.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("更新成功"), this.getRolesList();
      this.dialogVisible = false;
    },
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.boderBottom {
  border: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>