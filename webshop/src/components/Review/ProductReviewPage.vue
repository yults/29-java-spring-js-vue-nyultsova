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
    <div>
      <h2 class="product_details_header">
        Страница товара {{product.name}}
      </h2>
      <div class="product_detail_card">
        <BaseSlider
            :size-of-pic="true"
            :slides="product_images_find"
            :id="product.id"
            :name="product.name"
            :multiple_img="product_images_find.length>1"
        ></BaseSlider>
        <div class="review-page__name-desc">
          <span class="review-page__name">
            {{ product.name }}
          </span>
          <div class="review-page_desc">
            {{ product.description }}
          </div>
        </div>
      </div>
      <div class="mean_rate-wrap">
        <div class="mean_rate">
          <div>
            Рейтинг : {{mean_rate}}
          </div>
          <div v-if="mean_rate > 0" class="stars__container">
            <div class="stars" :style="{ width: starContainerWidth + 'px' }">
              <i class="my-star" v-for="(n, index) in 5" :key="index" :class="{ 'filled': n <= Math.round(mean_rate) }"></i>
            </div>
            <div class="cnt-rate">
              ({{this.cnt_rate}})
            </div>
          </div>
        </div>
        <button class="btn btn-primary give_feedback"
                @click="showModal = true">
          <span class="font-more">
            Оставить отзыв
          </span>
        </button>
      </div>
    </div>
    <div>
      <ReviewModal
          v-if="showModal"
          :product-id="id"
          :product-name="product.name"
          :show-modal="showModal"
          @close="showModal = false"
      ></ReviewModal>
    </div>
    <div class="reviews-title">
      Отзывы ( {{cnt_rate}} )
    </div>
    <div class="filter-choice-comments">
      <div>
        <button class="filter-modal-button-wide"
                @click="toggleFilter">
          {{ filterLabel }} <i class="arrow-icon" :class="{'arrow-up': showFilter, 'arrow-down': !showFilter}"></i>
        </button>
        <ul class="filter-ul" v-if="showFilter">
          <li class="filter-ul-li"
              @click="sortProducts('date_ear')">
            Более ранние
          </li>
          <li class="filter-ul-li"
              @click="sortProducts('date_late')">
            Более поздние
          </li>
          <li class="filter-ul-li"
              @click="sortProducts('mark_less')">
            Сначала отрицательные
          </li>
          <li class="filter-ul-li"
              @click="sortProducts('mark_more')">
            Сначала положительные
          </li>
        </ul>
      </div>
      <div><label class="filter-photo" >
        <input type="checkbox"
               class="filter-photo-checkbox"
               v-model="isChecked">
        <span class="filter-foto-label">
          Только с фото
        </span>
      </label>
      </div>
    </div>
    <hr style="margin-top: 0;
                        border: 0;
                        border-top: 2px solid lightgray;;
                        color: rgb(128,128,128)">
    <div class="review_cards">
      <div v-for="review in filteredInfo" :key="review.review_id">
        <div>
          <ReviewCard
                      :id="review.review_id"
                      :mark="review.mark"
                      :comment="review.comment"
                      :date="review.date"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Страница товара с отзывами
 * Можно оставить отзыв на товар выбрав количество звезд, загрузить фотографии и написав комментарий
 * Отзывы фильтруются по наличию фотографий, по положительности/отрицательности, по дате
 * Для администратора есть возможность удаления отзывов
 */

import {mapGetters, mapState} from "vuex";
import ReviewModal from "@/components/Review/ReviewModal.vue";
import BaseSlider from "@/components/Buttons/BaseSlider.vue";
import ReviewCard from "@/components/Review/ReviewCard.vue";
import HeaderRight from "@/components/Buttons/HeaderRight.vue";

export default {
  components: {
    HeaderRight,
    ReviewCard,
    BaseSlider,
    ReviewModal},
  computed: {
    ...mapGetters(['getInfo', 'getCartInfo']),
    ...mapState(['reviewS', 'product_imageS', "product_image", "review_imageS"]),
    product_images_find() {
      let thisId = this.product.id;
      let images = [];
      let imageId = -1;
      if (this.product_imageS.find((i) => i.product_id === thisId))
        imageId = this.product_imageS.find((i) => i.product_id === thisId);
      let watched = [];
      while (imageId !== -1) {
        watched.push(imageId.images_id)
        if (this.product_image.find((i) => i.id === imageId.images_id).url)
          images.push(this.product_image.find((i) => i.id === imageId.images_id).url)
        if (this.product_imageS.find((i) => i.product_id === thisId
            && !watched.includes(i.images_id)))
        {
          imageId = this.product_imageS.find((i) => i.product_id === thisId
              && !watched.includes(i.images_id))}
        else imageId = -1;
      }
      return images;
    },
    cnt_bin() {
      let totalCnt = 0;
      for (let item of this.getCartInfo)
        totalCnt += item.cnt;
      return totalCnt;
    },
    cnt_rate() {
      let rate_cnt = 0;
      this.reviewS.forEach((item) => {
        if (item.product_id === this.id) rate_cnt++;
      })
      return rate_cnt
    },
    filterLabel() {
      switch (this.filter) {
        case 'date_ear':
          return 'Более ранние';
        case 'date_late':
          return 'Более поздние';
        case 'mark_less':
          return 'Сначала отрицательные';
        case 'mark_more':
          return 'Сначала положительные';
      }
      return 'Выберите фильтр';
    },
    filteredInfo() { /** Фильтрация по наличию фото и по выставленному фильтру */
      let filtered = [];
      if (this.isChecked) {
        for (let i of this.productReviews) {
          if (this.review_imageS.find((o) => o.review_id === i.review_id))
            filtered.push(i)
        }
      } else
        filtered = this.productReviews;
      if (this.filter === "date_ear") {
        filtered.sort(function (a, b) {
          return parseInt(a.date) - parseInt(b.date);
        });
      } else if (this.filter === "date_late") {
        filtered.sort(function (a, b) {
          return parseInt(b.date) - parseInt(a.date);
        });
      }
      if (this.filter === "mark_less") {
        filtered.sort(function (a, b) {
          return parseInt(a.mark) - parseInt(b.mark);
        });
      } else if (this.filter === "mark_more") {
        filtered.sort(function (a, b) {
          return parseInt(b.mark) - parseInt(a.mark);
        });
      }
      return filtered;
    },
    id() {
      return parseInt(this.productId);
    },
    mean_rate() { /** Среднее по оценкам - рейтинг или его отсутствие */
      let rate = 0;
      this.reviewS.forEach((item) => {
        if (item.product_id === this.id)
          rate = parseInt(rate) + parseInt(item.mark)
      });
      if (this.cnt_rate)
        return Math.ceil(rate / this.cnt_rate * 10) / 10;
      return "Оценок нет"
    },
    product() {
      return this.getInfo.find((c) => c.id === this.id);
    },
    productReviews() {
      let pr = [];
      for (let review of this.reviewS) {
        if (review.product_id === this.id)
          pr.push(review)
      }
      return pr;
    },
    starContainerWidth() { /** Вычисляем ширину контейнера звезд */
      return Math.round(this.mean_rate * 20 + 4);
    }
  },
  data() {
    return {
      showFilter: false,
      showModal: false,
      filter: '', /** название фильтра */
      isChecked: false /** флаг фильтрации по наличию фото */
    }
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    sortProducts(filter) {
      this.filter = filter;
      this.showFilter = !this.showFilter;
    },
  },
  name: "ProductReviewPage",
  props: {
    productId: {
      required: true
    }
  },
};
</script>
