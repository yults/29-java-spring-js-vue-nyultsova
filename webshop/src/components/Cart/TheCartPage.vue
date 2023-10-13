<template>
    <div>
        <header class="main_header">
            <router-link to="/home" class="nav-link">
                <span class="catalog__navigation">
                  &#9734; Каталог
                </span>
            </router-link>
            <HeaderRight :cnt_bin="cnt_bin"></HeaderRight>
        </header>
        <hr class="hr__main-header">

        <div class="cart-page">
            <h2 class="cart__header">
              Корзина
              <span class="button_bin_cart">
                {{ cnt_bin }}
              </span>
            </h2>
            <div class="cart__body">
                <div class="cart__card">
                    <CartCard v-for="(item, index) in cartinfo" :key="index"
                              :name="item.name"
                              :price="item.price"
                              :price_sale="get_price_sale(item.id)"
                              :cnt="item.cnt"
                              :id="item.id"
                              :cart_check="item.cart_check"
                              @update-cart="updateCart(item.id, $event)">
                    </CartCard>
                </div>
                <div class="cart__total">
                    <div class="cart_total_h_info">
                        <h3 class="cart__total_header">
                          Ваш заказ
                        </h3>
                        <table class="cart__info">
                            <tr>
                              <td class="cart__info_label">
                                Количество товаров:
                              </td>
                              <td class="cart__info_label">
                                {{ cnt_bin }}
                              </td>
                            </tr>
                            <tr>
                              <td class="cart__info_label">
                                Итого:
                              </td>
                              <td class="cart__info_label">
                                <div class="cart__product-sum">
                                  <span :class="{'catalog__price_sale_not' : adminFlag, 'catalog__price_sale': !adminFlag}">
                                    {{ totalCost }} руб
                                  </span>
                                  <div v-if="adminFlag" class="catalog_money_sale">
                                    {{ totalCostSale }} руб
                                  </div>
                                </div>
                              </td>
                            </tr>
                        </table>
                    </div>
                    <div class="cart__button_send">
                        <button v-if="adminFlag"
                                class="send_cart"
                                @click="sendEmail()">
                          Оформить заказ
                        </button>
                      <div v-if="!adminFlag">
                        Чтобы оформить заказ пройдите
                        <router-link to="/login">
                          авторизацию
                        </router-link>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * Страница корзины
 * Вывод карточек товара и итога
 * Форма оформления заказа
 */

import {mapGetters, mapState} from 'vuex';
import CartCard from "./CartCard.vue";
import HeaderRight from "@/components/Buttons/HeaderRight.vue";
import {formatNumberWithSpaces} from "@/js/globalMethods";

export default {
  components: {
    HeaderRight,
    CartCard
  },
  computed: {
    ...mapGetters(['getCartInfo']),
    ...mapState(['curUserRole', 'userS', "priceS_sale"]),
    cartinfo() {
      return this.getCartInfo;
    },
    adminFlag() {
      return this.curUserRole;
    },
    cnt_bin() {
      return this.getTotal('cnt');
    },
    totalCost() {
      return this.getTotal('price');
    },
    totalCostSale() {
      return this.getTotal('price_sale');
    },
  },
  methods: {
    sendEmail() {
      console.log("тут бы бекенд конечно, nodemailer не подрубился")
    },
    getTotal(flag) {
      let total = 0;
      for (let item of this.cartinfo) {
        if (item.cart_check) {
          switch (flag) {
            case 'price':
              total += item.price * item.cnt;
              break;
            case 'price_sale': {
              let pr;
              if (this.get_price_sale(item.id) > 0) {
                pr = this.get_price_sale(item.id);
              } else {
                pr = item.price;
              }
              total += pr * item.cnt;
              break;
            }
            case 'cnt':
              total += item.cnt;
              break;
          }
        }
      }
      if (flag === 'cnt') return total
      return formatNumberWithSpaces(total);
    },
    get_price_sale(id) {
      let price_prod = this.priceS_sale.find((i) => i.product_id === id)
      if (typeof(price_prod) === "undefined" || ! this.adminFlag) return -1;
      return price_prod.price_sale;
    },
    updateCart(item, id, newCnt) {
      if (typeof newCnt === typeof false)
        this.$store.commit('updateCartCheck', {id, newCnt});
      else
        this.$store.commit('updateCartItemCnt', {id, newCnt});
    },
  },
  name: "CartPage",
}
</script>

