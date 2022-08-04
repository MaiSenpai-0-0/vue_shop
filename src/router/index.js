import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/user/User.vue"

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      // 路由重定向
      path: "/",
      redirect: "/login",
    },

    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/users",
          component: User,
        },
      ],
    },
  ],
});

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  if (!window.sessionStorage.getItem("token")) return next("login");
  next();
});

export default router;
