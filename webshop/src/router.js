import { createWebHistory, createRouter } from "vue-router";
import HomePage from "./components/Catalog/TheHomePage.vue";
import LoginPage from "./components/Profile/TheLoginPage.vue";
import RegisterPage from "./components/Profile/TheRegisterPage.vue";
import CartPage from "./components/Cart/TheCartPage.vue";
import AdminPage from "./components/Admin/TheAdminPage.vue";
import ProductReviewPage from "@/components/Review/ProductReviewPage.vue";
// lazy-loaded
const Profile = () => import("./components/Profile/Profile.vue")
const BoardAdmin = () => import("./components/Roles/BoardAdmin.vue")
const BoardModerator = () => import("./components/Roles/BoardModerator.vue")
const BoardUser = () => import("./components/Roles/BoardUser.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/cart",
    component: CartPage,
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/adminpage",
    component: AdminPage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: BoardModerator,
  },
  {
    path: "/user",
    name: "user",
    // lazy-loaded
    component: BoardUser,
  },
  {
    path: "/product/:productId",
    name: 'ProductReviewPage',
    component: ProductReviewPage,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // const privatePages = ['/adminpage'];
  // const authRequired = privatePages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (loggedIn) {
    next('/home');
  } else {
    next();
  }
});

export default router;