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
                <div id="app">
                  <CatalogCard
                      v-for="(item) in filteredInfo"
                      :name="item.name"
                      :description="item.description"
                      :avail="item.avail"
                      :price="parseInt(item.price)"
                      :price_sale="get_price_sale(item.id)"
                      :cnt="item.cnt"
                      :quantity="item.quantity"
                      :id="item.id"
                      :cart_check="item.cart_check"
                      :key="item.id"
                      @add-to-cart="addToCart(item.id)"
                  ></CatalogCard>
                  <div v-if="isLoading" class="loading">Loading...</div>
                </div>
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
    CategoryComponent,
  },
  computed: {
    ...mapGetters([
      'getInfo', 'getCartInfo'
    ]),
    ...mapState(["categoryS", "curUserRole", "product_categoryS", "reviewS", "propertyS", "product_propertyS", "priceS_sale"]),
    adminFlag() {
      return this.curUserRole
    },
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
          /** Сортировка пузырьком фильтрующая цены в зависимости от
           * того имеется ли цена по скидке */
          for (let j = filtered.length - 1; j > 0; j--) {
            for (let i = 0; i < j; i++) {
              let ps_1 = this.get_price_sale(filtered[i].id)
              let ps_2 = this.get_price_sale(filtered[i + 1].id)
              let a = ps_1 > 0 ? ps_1 : filtered[i].price
              let b = ps_2 > 0 ? ps_2 : filtered[i + 1].price
              if (a > b) {
                let temp = filtered[i];
                filtered[i] = filtered[i + 1];
                filtered[i + 1] = temp;
              }
            }
          }
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
      let filtered = this.products_infinite;
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
      products_infinite: [], // Массив для хранения товаров
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
      isLoading: false,
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
    get_price_sale(id) {
      let price_prod = this.priceS_sale.find((i) => i.product_id === id)
      if (typeof(price_prod) === "undefined" || ! this.adminFlag) return -1;
      return price_prod.price_sale;
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
      this.filteredInfo = this.products_infinite;
    },
    propertyFilterUpdate(data) {
      this.property_filter = data.property_filter;
    },
    property_child(prop_names) {
      return this.property.filter((prop) => {
        return prop.parentId === prop_names.id
      });
    },
    async loadMoreProducts() {
      try {
        this.isLoading = true;

        // Отправка запроса на сервер
        const response = await fetch('/api/db.json');

        if (!response.ok) {
          throw new Error('Ошибка запроса на сервер');
        }

        const data = await response.json();
        console.log(data)
        let new_prod = data.info.map(product => ({
          ...product,
          cart_check: false,
          cnt: 0,
          avail: product.quantity === 0 ? "Нет в наличии" : product.quantity < 6 ? "Мало" : "В наличии"
        }));
        console.log(new_prod)
        // Добавление полученных товаров в массив
        this.products_infinite.push(...new_prod);

        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
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
  created() {
    this.loadMoreProducts();
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
    // Слушатель скролла страницы
    window.addEventListener('scroll', () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      // Проверка достижения конца страницы
      if (scrollTop + clientHeight >= scrollHeight) {
        this.loadMoreProducts();
      }
    });
  },
  name: "HomePage",
};
</script>
