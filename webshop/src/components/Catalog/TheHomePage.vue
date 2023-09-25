<template>
    <div class="wrapper">
        <div class="main_page">
            <header class="main_header">
                <span class="catalog__navigation nav-link"
                      @click="toggleMenu">
                  &#9734; Каталог
                </span>
                <HeaderRight :cnt_bin="cnt_bin"></HeaderRight>
            </header>
            <hr class="hr__main-header">

            <div :class="[{ 'menu_modal-open': showMenu}, 'menu_modal']">
                <CategoryComponent
                    :parentCategoryId="null"
                    :level="0"
                    @product-ids="filterByCategory($event)"/>
            </div>

            <div>
              <ol class="breadcrumb">
                <li class="breadcrumb-item"
                    v-for="(item, index) in breadcrumb" :key="index">
                  {{item}}
                </li>
              </ol>
            </div>
            <div class="breadcrumb" v-if="selectedItem">
              {{ breadcrumb2 }} ({{breadcrumbCnt}})
            </div>

            <div class="filters_and_catalog">
              <CatalogFilter @update-filter="updateFilter($event)"
                             @filter-delete="onMouseClickFilterDelete()"
                             @cost-filter="costFilter"
                             @update-property-filter="propertyFilterUpdate($event)">
              </CatalogFilter>
              <div class="catalog_card_div">
                <div class="show-nothing"
                     v-if="showFingNothing">
                  По данному запросу ничего не найдено
                </div>
                <CatalogCard
                    v-for="(item) in filteredInfo"
                    :name="item.name"
                    :description="item.description"
                    :avail="item.avail"
                    :price="item.price"
                    :price_sale="item.price_sale"
                    :cnt="item.cnt"
                    :quantity="item.quantity"
                    :id="item.id"
                    :cart_check="item.cart_check"
                    :key="item.id"
                    @add-to-cart="addToCart(item.id)"
                ></CatalogCard>
              </div>
        </div>
        </div>
      <footer class="main_footer text-center text-muted">
        2023 © НИЦ СПб ЭТУ.
      </footer>
    </div>
</template>

<script>

import {mapGetters, mapState} from 'vuex'
import UserService from "../../services/user.service";
import CatalogCard from "./CatalogCard.vue";
import CategoryComponent from '@/components/Category/CategoryNode.vue'
import HeaderRight from "@/components/Buttons/HeaderRight.vue";
import CatalogFilter from "@/components/Catalog/CatalogFilter.vue";
export default {
  components: {
    HeaderRight,
    CatalogCard,
    CatalogFilter,
    CategoryComponent
  },
  computed: {
    ...mapGetters([
      'getInfo', 'getCartInfo'
    ]),
    ...mapState(["categoryS", "product_categoryS", "reviewS", "propertyS", "product_propertyS"]),
    cartinfo() {
      return this.getCartInfo;
    },
    categoryInfo() {
      return this.categoryS;
    },
    cnt_bin() {
      let totalCnt = 0;
      for (let item of this.cartinfo)
        totalCnt += item.cnt;
      return totalCnt;
    },
    filterLabel() {
      switch (this.filter) {
        case 'price_asc':
          return 'По возрастанию цены';
        case 'price_desc':
          return 'По убыванию цены';
        case  'rating':
          return 'По рейтингу';
      }
      return 'Выберите фильтр';
    },
    filteredInfo() {
      let filtered = this.filteredWithRate; /** добавление рейтинга */
      switch (this.filter) { /** Сортировка по основному фильтру */
        case "price_asc":
          filtered.sort(function (a, b) {
            return parseInt(a.price) - parseInt(b.price);
          });
          break;
        case "price_desc":
          filtered.sort(function (a, b) {
            return parseInt(b.price) - parseInt(a.price);
          });
          break;
        case "rating":
          filtered.sort(function (a, b) {
            return parseInt(b.rate) - parseInt(a.rate);
          });
      }
      /** Фильтр по цене */
      if (this.from_filter !== "" && this.to_filter !== "") {
        filtered = filtered
            .filter(item => item.price >= this.from_filter
                && item.price <= this.to_filter)
      }
      /**
       * Фильтрация по характеристикам
       * @param property_filter - id характеристик включенных в фильтр
       *
       * Сначала идет поиск в связках товар-характеристики все записи где есть данны характеристики
       * Далее отбираются из уже частично отфильтрованных товаров товары, id которых есть в
       * отфильтрованных связках
       */
      if (this.property_filter.length !== 0) {
        const filtered_product_ids = this.productProperty
            .filter(item => this.property_filter.includes(item.property_id))
            .map(item => item.product_id);
        filtered = filtered.filter(obj => {
          for (let pids of filtered_product_ids)
            if (obj.id === parseInt(pids)) return true;
        });
      }
      /** Фильтр по категориям
       * Заранее фильтруются необходимые id товаров и выдаются только товары с подходящим id
       * */
      if (this.productIdsCategory.length > 0)
        filtered = filtered.filter(item => this.productIdsCategory.includes(item.id))
      /** Сообщение об ошибке в случае если поиск завершился отсутствием результатов */
      if (filtered.length !== 0) {
        this.showFingNothingfun(false);
      } else {
        this.showFingNothingfun(true);
      }
      return filtered
    },
    filteredWithRate() {
      let filtered = this.info;
      return filtered.map(product => ({
        ...product,
        rate: this.mean_rate(product.id),
      }));
    },
    fullName() {
      return this.firstName + " " + this.lastName;
    },
    info() {
      return this.getInfo;
    },
    productCategory() {
      return this.product_categoryS;
    },
    productProperty() {
      return this.product_propertyS;
    },
    property() {
      return this.propertyS;
    },
    property_top() {
      return this.property.filter((prop) => {
        return prop.parentId === null
      });
    },
  },
  data() {
    return {
      breadcrumb: ["Главная"],
      breadcrumb2: "",
      breadcrumbCnt: 0,
      changeFlag: false,
      clear_filter: false,
      email: "",
      filter: 'price_asc',
      firstName: "",
      formShown: true,
      from_filter: "",
      lastName: "",
      phone: "",
      productIdsCategory: [],
      property_filter: [],
      selectedCategory: null,
      selectedItem: null,
      showFingNothing: false,
      showMenu: false,
      to_filter: "",
    };
  },
  methods: {
    addToCart(id) {
      this.$store.commit('addToCart', id);
    },
    costFilter(data) {
      this.from_filter = data.from_filter;
      this.to_filter = data.to_filter
    },
    filterByCategory(newData) {
      let catid = newData.shift()
      this.productIdsCategory = newData;
      this.breadcrumb = ["Главная"];
      this.breadcrumb2 = "";
      this.breadcrumbCnt = newData.length;
      this.selectedItem = true;
      let category = this.categoryInfo.find((c) => c.id === catid);
      this.breadcrumb2 = category.name;
      this.breadcrumb.push(category.name);
      while (this.categoryInfo.find((c) => c.id === category.parentId)) {
        category = this.categoryInfo.find((c) => c.id === category.parentId);
        this.breadcrumb.push(category.name);
      }
    },
    mean_rate(item) {
      let cnt_rate = 0;
      this.reviewS.forEach((i) => {
        if (i.product_id === item) cnt_rate++;
      })
      let rate = 0;
      this.reviewS.forEach((i) => {
        if (i.product_id === item) {
          rate = parseInt(rate) + parseInt(i.mark)
        }
      });
      if (cnt_rate) return Math.ceil(rate / cnt_rate * 10) / 10;
      return 0
    },
    /** Очистить фильтры */
    onMouseClickFilterDelete() {
      this.from_filter = "";
      this.to_filter = "";
      this.property_filter = [];
      this.filter = 'price_asc';
      this.clear_filter = true;
      this.filteredInfo = this.info;
    },
    propertyFilterUpdate(data) {
      this.property_filter = data.property_filter;
    },
    property_child(prop_names) {
      return this.property.filter((prop) => {
        return prop.parentId === prop_names.id
      });
    },
    showFingNothingfun(bol) {
      this.showFingNothing = bol;
    },
    sortProducts(filter) {
      this.filter = filter;
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    updateFilter(data) {
      this.filter = data.filter;
    },
  },
  mounted() {
    UserService.getPublicContent().then((response) => {
      this.content = response.data;
    }, (error) => {
      this.content =
          (error.response &&
              error.response.data &&
              error.response.data.message) ||
          error.message ||
          error.toString();
    });
  },
  name: "HomePage",
};
</script>
