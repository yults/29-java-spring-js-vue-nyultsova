<template>
    <div class="cart__component">
        <div class="cart__pic-name">
            <div class="cart__check-pic">
                <div>
                  <label class="checkbox-container">
                    <input type="checkbox"
                           class="cart__check"
                           id="my-checkbox"
                           checked name="cart_check"
                           v-model="isChecked"
                           @click="onClickCheck">
                    <span class="checkmark"></span>
                  </label>
                </div>
                <img :src="image"
                     :alt="name"
                     class="cart__pic">
            </div>
            <div class="cart__name-product">{{ name }}</div>
        </div>
        <div class="cart__buttons">
            <div class="cart__product-cnt">
              <BaseSwitcher :id="id" :cnt="cnt"
                            @update-cart="updateCart(id, $event)"
                            @remove-item="removeItem(id)"
              ></BaseSwitcher>
            </div>
            <div class="cart__delete">
                <a class="button__remove"
                   @click="removeItem(id)">
                  удалить
                </a>
            </div>
        </div>
        <div class="cart__product-sum">
          <span class="catalog__price_sale_not">
            {{ formatNumber(price) }} руб
          </span>
          <div class="catalog_money_sale">
            {{ formatNumber(price_sale) }} руб
          </div>
        </div>
    </div>
    <hr>
</template>

<script>
//кнопка удаления и чекбокса некорректна
/**
 * Карточка товара добавленного в корзину
 * Если чекбокс не активен, то в итог товар не идет
 * Можно поменять количество товара прямо в корзине или удалить оттуда совсем
 */

import BaseSwitcher from "@/components/Buttons/BaseSwitcher.vue";
import {formatNumberWithSpaces} from "@/js/globalMethods";
import {mapState} from "vuex";
export default {
  components: {
    BaseSwitcher
  },
  data() {
    return {
      isChecked: this.cart_check /** начальное значение чекбокса */
    };
  },
  computed: {
    ...mapState(['product_image', 'product_imageS']),
    image() {
      let imageId = this.product_imageS.find((i) => i.product_id === this.id).images_id;
      return this.product_image.find((i) => i.id === imageId).url;
    }
  },
  methods: {
    formatNumber(number) {
      return formatNumberWithSpaces(number);
    },
    onClickCheck() {
      this.isChecked = !(this.cart_check);
      this.$store.commit('updateCartCheck', {id : this.id, check : this.isChecked});
    },
    removeItem(id) {
      this.$store.commit('removeCartItem', {id});
    },
    updateCart(id, newCnt) {
      if (typeof newCnt === typeof false) {
        this.$store.commit('updateCartCheck', {id, newCnt});
      } else {
        this.$store.commit('updateCartItemCnt', {id, newCnt});
      }
      this.$store.commit('updateCartItemCnt', {id, newCnt});
    },
  },
  name: "CartCard",
  props: {
    cart_check: {
      type: Boolean,
      required: true
    },
    cnt: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    price_sale: {
      type: Number,
      required: true
    }
  },
}
</script>

