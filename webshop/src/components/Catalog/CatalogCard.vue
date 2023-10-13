<template>
  <div>
    <div class="catalog__body">
      <BaseSlider
          :sizeOfPic="false"
          :name="name"
          :slides="product_images_find"
          :multiple_img="product_images_find.length > 1"
      ></BaseSlider>

        <div class="catalog__name-desc">
          <router-link :to="{ name: 'ProductReviewPage', params: { productId: id }}">
            <div class="catalog__name">
              {{ name }}
            </div>
          </router-link>
            <div class="catalog__desc">
              {{ description }}
            </div>
        </div>

        <div :class="{'catalog__avail': true,    'catalog__avail_green': avail === 'В наличии',
                                                'catalog__avail_yellow': avail === 'Мало',
                                                'catalog__avail_red': avail === 'Нет в наличии' }">
          {{ avail }}
        </div>

        <div class="catalog__price-cart">
            <div class="catalog__price">
              <span :class="{'catalog__price_sale_not' : price_sale > 0, 'catalog__price_sale': price_sale < 0}">
                {{ formatNumber(price) }} руб
              </span>
              <div v-if="price_sale > 0" class="catalog__price_sale">
                {{ formatNumber(price_sale) }} руб
              </div>
            </div>

            <div class="catalog__cart">
                <div v-if="showBaseSwitcher"
                     class="cart__product-cnt">
                    <BaseSwitcher :id="id" :cnt="cnt"
                                  @update-cart="updateCart(id, $event)"
                                  @remove-item="removeItem(id)"
                    ></BaseSwitcher>
                </div>
                <div v-else>
                    <button :class="{'toCart': true,
                      'button__active_not': avail === 'Нет в наличии',
                      'button__active': avail === 'Мало' || avail === 'В наличии' }"
                    @click="toCartBut()">
                      В корзину
                    </button>
                </div>
            </div>
        </div>
    </div>

      <div v-if="mean_rate > 0"
           class="stars__container">
        <div class="stars"
             :style="{ width: starContainerWidth + 'px' }">
          <i v-for="(n, index) in 5" :key="index"
             :class="[{ 'filled': n <= Math.round(mean_rate) }, 'my-star']"></i>
        </div>
        <div class="cnt-rate">
          ( {{ cnt_rate }} )
        </div>
      </div>
      <div class="catalog_properties_box">
        <div v-for="prop in thisProductProperties" :key="prop.id">
        <span class="catalog_properties">
          {{ thisParentProperty(prop.parentId) }} : {{ prop.name }}
        </span>
        </div>
      </div>
      <hr class="catalog__separator">
  </div>
</template>

<script>

/**
 * Карточка товара из каталога
 * Вывод основной информации, статус наличия, рейтинг и количество отзывов, характеристики
 * Можно добавить товар в корзину, поменять количество товара, полистать фотографии
 * При нажатии на названия товара открывается персональная страница товара с отзывами
 */

import { mapState} from "vuex";
 import BaseSlider from "@/components/Buttons/BaseSlider.vue";
 import BaseSwitcher from "@/components/Buttons/BaseSwitcher.vue";
 import {formatNumberWithSpaces} from "@/js/globalMethods";

export default {
  components: {
    BaseSwitcher,
    BaseSlider
  },
  computed: {
    ...mapState([
      'reviewS', 'product_propertyS', 'propertyS', 'product_imageS', 'product_image'
    ]),
    cnt_rate() { /** количество отзывов */
      let rate_cnt = 0;
      this.reviewS.forEach((item) => {
        if (item.product_id === this.id)
          rate_cnt++;
      })
      return rate_cnt
    },
    productImageS() {
      return this.product_imageS;
    },
    product_images_find() {
      let images = [];
      let imageId = -1;
      if (this.productImageS.find((i) => i.product_id === this.id))
        imageId = this.productImageS.find((i) => i.product_id === this.id);
      let watched = [];
      while (imageId !== -1) {
        watched.push(imageId.images_id)
        if (this.product_image.find((i) => i.id === imageId.images_id).url)
          images.push(this.product_image.find((i) => i.id === imageId.images_id).url)
        if (this.productImageS.find((i) => i.product_id === this.id
            && !watched.includes(i.images_id)))
        {
          imageId = this.productImageS.find((i) => i.product_id === this.id
              && !watched.includes(i.images_id))}
        else imageId = -1;
      }
      return images;
    },
    mean_rate() { /** средняя оценка - рейтинг */
      let rate = 0;
      this.reviewS.forEach((item) => {
        if (item.product_id === this.id) {
          rate = parseInt(rate) + parseInt(item.mark)
        }
      });
      if (this.cnt_rate)
        return Math.ceil(rate / this.cnt_rate * 10) / 10;
      return 0
    },
    productProperty() {
      return this.product_propertyS;
    },
    property() {
      return this.propertyS;
    },
    showBaseSwitcher() { /** Переключение с "В корзину" на плашку свитчера */
      return this.cnt > 0
    },
    starContainerWidth() { /** Вычисляем ширину контейнера звезд */
      return Math.round(this.mean_rate * 20 + 4);
    },
    thisProductProperties() { /** характеристики товара из карточки */
      let thisProductPropertiesAr = this.productProperty.filter((prop) => {
        return prop.product_id === this.id
      });
      return this.property.filter((prop) => {
        let filter = false;
        for (let thisProductProperty of thisProductPropertiesAr) {
          if (prop.id === thisProductProperty.property_id)
            filter = true;
        }
        return filter;
      });
    }
  },
  methods: {
    formatNumber(number) {
      return formatNumberWithSpaces(number);
    },
    removeItem(id) {
      this.showBaseSwitcher = false;
      this.$store.commit('removeCartItem', {id});
    },
    thisParentProperty(parentId) { /** значения для данной характеристики */
      return this.property.find((prop) => {
        return prop.id === parentId
      }).name;
    },
    toCartBut() {
      if (this.avail !== 'Нет в наличии') {
        this.$emit('add-to-cart');
        this.showBaseSwitcher = true;
      }
    },
    updateCart(id, newCnt) {
      this.$store.commit('updateCartItemCnt', {id, newCnt});
    }
  },
  name: "CatalogCard",
  props: {
    avail: {
      type: String,
      required: true
    },
    cnt: {
      type: Number,
      required: true
    },
    description: {
      type: String,
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
