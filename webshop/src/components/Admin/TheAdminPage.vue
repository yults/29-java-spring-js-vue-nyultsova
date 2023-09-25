<template>
    <header class="main_header">
      <router-link to="/home" class="nav-link">
        <span class="catalog__navigation">
          &#9734; Каталог
        </span>
      </router-link>
      <HeaderRight :cnt_bin="cnt_bin"></HeaderRight>
    </header>
    <hr class="hr__main-header">
    <div class="admin-page" v-if="adminFlag">
      <div class="admin-page__list_card">
        <h4 class="admin-page__list_title">
          Категории и характеристики
        </h4>
        <div class="admin-page__list">
          <div class="all_products_list">
            <div class="products__list_title my-flex_row">
              Продукты и категории
              <AdminCategoryListAddMain></AdminCategoryListAddMain>
            </div>
            <AdminCategoryList :parentCategoryId="null"
                               :level="0"></AdminCategoryList>
          </div>

          <div class="all_properties_list">
            <div class="properties__list_title my-flex_row">
              Характеристики
              <AdminPropertyListAddMain></AdminPropertyListAddMain>
            </div>
            <AdminPropertyList></AdminPropertyList>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

/**
 * Страница администрирования
 * Вызов списков категорий и характеристик
 * Создание карточки товара
 * Валидация и вывод об ошибке при добавлении неправильно заполненной карточке
 */

import {mapGetters, mapState} from 'vuex';
import AdminCategoryList from "@/components/Admin/Category/AdminCategoryList.vue";
import AdminPropertyList from "@/components/Admin/Property/AdminPropertyList.vue";
import HeaderRight from "@/components/Buttons/HeaderRight.vue";
import AdminCategoryListAddMain from "@/components/Admin/Category/AdminCategoryListAddMain.vue";
import AdminPropertyListAddMain from "@/components/Admin/Property/AdminPropertyListAddMain.vue";
export default {
  components: {
    AdminPropertyListAddMain,
    AdminCategoryListAddMain,
    AdminCategoryList,
    AdminPropertyList,
    HeaderRight
  },
  computed: {
    ...mapGetters(['getCartInfo']),
    ...mapState(['curUserRole']),
    cartinfo() {
      return this.getCartInfo;
    },
    cnt_bin() {
      let totalCnt = 0;
      for (let item of this.cartinfo)
        if (item.cart_check) totalCnt += item.cnt;
      return totalCnt;
    },
    adminFlag() {
      return this.curUserRole
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleLogin(user) {
      this.loading = true;
      this.$store.dispatch("auth/login", user).then(
          () => {
            this.$router.push("/profile");
          },
          (error) => {
            this.loading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
  },
  name: "AdminPage",
}
</script>


