import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home/index.vue"),
      children: [
        {
          path: "films",
          component: () => import("./views/home/films.vue")
        },
        {
          path: "cinemas",
          component: () => import("./views/home/cinemas.vue")
        },
        {
          path: "center",
          component: () => import("./views/home/center.vue")
        },
        {
          path: "card",
          component: () => import("./views/user/card.vue"),
          meta: {
            // isLogined , 这个路由要进去，必须要登录完成
            isLogined: true
          }
        },
        {
          path: "",
          redirect: "/films"
        }
      ]
    },
    {
      path: "/film:filmId",
      name: "film",
      component: () => import("./views/film/index.vue")
    },
    {
      path: "/city",
      name: "city",
      component: () => import("./views/city/index.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/login/index.vue")
    },
    {
      path: "*",
      redirect: "/films"
    }
  ]
});

// 用路由前置守卫实现路由的拦截功能
router.beforeEach((to, from, next) => {
  // 判断要去的页面有没有限制,有没有meta元信息
  // 如果从个人中心到卖座卡页面
  console.log(from); // 从" /center "
  console.log(to); // 到 " /card "
  if (to.meta.isLogined) {
    // 如果有这玩意就要判断当前用户有没有登录
    console.log(router);
    if (!store.state.user.userInfo) {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next(); // 没有就不管,直接往下走
  }

  next();
});

export default router;
