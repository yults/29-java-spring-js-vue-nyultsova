import { auth } from "./auth.module";
import adminCategoryMutations from "./mutations/adminCategoryMutations";
import cartMutations from "./mutations/cartMutations";
import propertyMutations from "./mutations/propertyMutations";
import reviewMutations from "./mutations/reviewMutations";
import loginMutations from "@/store/mutations/loginMutations";
import { createStore } from 'vuex'
import { mapState } from "vuex";

const store = createStore({
  computed: {
    ...mapState(["categoryS",
      "product_categoryS",
      "reviewS",
      "propertyS",
      "product_propertyS",
      "product_image",
      "product_imageS",
      "review_image",
      "review_imageS",
      "userS",
      "users_reviewS",
      "curUserId",
      "curUserRole",
        "priceS_sale"
    ]),
  },
  /**
   * info: Содержит полную информацию о товаре и отображается в каталоге;
   * cartinfo: Содержит товары, лежащие в корзине, и необходимую информацию по ним, хранит состояние чекбокса;
   * categoryS: Содержит список категорий: имя, id, id родительской категории;
   * product_categoryS: Содержит список связок между id товаров и соответсвующих им id категорий в которых они лежат;
   * reviewS: Содержит полную информацию по одному отзыву, в том числе к какому товару он принадлежит;
   * propertyS: Содержит все характеристики и их значения, связываются через parentId
   * у характеристик нет родителя, а у значений родитель это характеристика;
   * product_propertyS: Содержит список связок между id товаров и id значения характеристики, которую имеет товар;
   * product_image: Содержит картинки товаров с их id;
   * product_imageS: Содержит связки id товара id картинки;
   * review_image: Содержит картинки отзывов с их id;
   * review_imageS: Содержит  связки id отзыва id картинки;
   * userS: Содержит список зарегестрированных пользователей
   * users_reviewS: Содержит связки id отзыва и id пользователя который его написал
   * curUserId: Содержит информацию об id залогиненного пользователя
   * curUserRole: false - обычный true - админ
   */

  state: {
    info: [],
    cartinfo: [],
    categoryS: [],
    product_categoryS: [],
    reviewS: [],
    propertyS: [],
    priceS_sale: [],
    product_propertyS: [],
    product_image: [],
    product_imageS: [],
    review_image : [],
    review_imageS : [],
    userS: [],
    users_reviewS: [],
    curUserId: -1,
    curUserRole: false,
  },
  mutations: {
    ...adminCategoryMutations,
    ...cartMutations,
    ...propertyMutations,
    ...reviewMutations,
    ...loginMutations,
    setInfo(state, data) {
      state.info = data.info.map(product => ({
        ...product,
        cart_check: false,
        cnt: 0,
        avail: product.quantity === 0 ? "Нет в наличии" : product.quantity < 6 ? "Мало" : "В наличии"
      }));
    },
    setPriceSale(state, data) {
      state.priceS_sale = data.price_sale.map(product => ({
        ...product
      }));
    },
    setCategory(state, data) {
      state.categoryS = data.category.map(product => ({
        ...product
      }));
    },
    setProductImage(state, data) {
      state.product_image = data.product_image.map(product => ({
        ...product
      }));
    },
    setProductImages(state, data) {
      state.product_imageS = data.product_images.map(product => ({
        ...product
      }));
    },
    setReviewImage(state, data) {
      state.review_image = data.review_image.map(product => ({
        ...product
      }));
    },
    setReviewImages(state, data) {
      state.review_imageS = data.review_images.map(product => ({
        ...product
      }));
    },
    setProperty(state, data) {
      state.propertyS = data.property.map(product => ({
        ...product
      }));
    },
    setReview(state, data) {
      state.reviewS = data.reviews.map(product => ({
        ...product
      }));
    },
    setUsersReviews(state, data) {
      state.users_reviewS = data.users_reviews.map(product => ({
        ...product
      }));

    },
    setUsers(state, data) {
      state.userS = data.users.map(product => ({
        ...product
      }));
    },
    setProductCategoryS(state, data) {
      state.product_categoryS = data.product_category.map(product => ({
        ...product
      }));
    },
    setProductPropertyS(state, data) {
      state.product_propertyS = data.product_property.map(product => ({
        ...product
      }));
    }
  },
  getters: {
    getInfo(state) {
      return state.info;
    },
    getCartInfo: state => {
      return state.cartinfo.map(item => {
        return { ...item };
      });
    },
  },
    actions: {
    fetchInfo({ commit }) {
      fetch("/api/info.json")
        .then(response => response.json())
        .then(data => {
          commit("setInfo", data);
        })
        .catch(error => {
          console.log(error);
        });
      fetch("/api/product_image.json")
          .then(response => response.json())
          .then(data => {
            commit("setProductImage", data);
          })
          .catch(error => {
            console.log(error);
          });
      fetch("/api/product_images.json")
          .then(response => response.json())
          .then(data => {
            commit("setProductImages", data);
          })
          .catch(error => {
            console.log(error);
          });
      fetch("/api/price_sale.json")
          .then(response => response.json())
          .then(data => {
            commit("setPriceSale", data);
          })
          .catch(error => {
            console.log(error);
          });
    },
      fetchCategory({ commit }) {
        fetch("/api/category.json")
            .then(response => response.json())
            .then(data => {
              commit("setCategory", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchProperty({ commit }) {
        fetch("/api/property.json")
            .then(response => response.json())
            .then(data => {
              commit("setProperty", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchReview({ commit }) {
        fetch("/api/reviews.json")
            .then(response => response.json())
            .then(data => {
              commit("setReview", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchProductCategoryS({ commit }) {
        fetch("/api/product_category.json")
            .then(response => response.json())
            .then(data => {
              commit("setProductCategoryS", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchProductPropertyS({ commit }) {
        fetch("/api/product_property.json")
            .then(response => response.json())
            .then(data => {
              commit("setProductPropertyS", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchReviewImage({ commit }) {
        fetch("/api/review_image.json")
            .then(response => response.json())
            .then(data => {
              commit("setReviewImage", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchReviewImages({ commit }) {
        fetch("/api/review_images.json")
            .then(response => response.json())
            .then(data => {
              commit("setReviewImages", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchUsers({ commit }) {
        fetch("/api/users.json")
            .then(response => response.json())
            .then(data => {
              commit("setUsers", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
      fetchUsersReviews({ commit }) {
        fetch("/api/users_reviews.json")
            .then(response => response.json())
            .then(data => {
              commit("setUsersReviews", data);
            })
            .catch(error => {
              console.log(error);
            });
      },
  },
  modules: {
    auth,
  },
});



export default store;

