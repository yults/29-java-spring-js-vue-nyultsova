<template>
  <div class="review-card">
    <div class="review-card__header">
      <div class="review-card__header_title">
        {{ user }}
      </div>

      <div class="review-card__header_icon">
        <span v-for="index in [1, 2, 3, 4, 5]" :key="index">
          <i v-if="index <= mark" class="fas fa-star"></i>
          <i v-else class="far fa-star"></i>
        </span>
        {{ mark }}
      </div>
    </div>

    <div class="review-card__content">
      <div class="review__content">
        {{ comment }}
      </div>
    </div>

    <div class="review__images" v-if="image.length > 0">
      <div class="review_image"
           v-for="(slide, index) in image"
           :key="index">
        <img class="review__img"
             :src="slide"
             :alt="name">
        <button v-if="adminFlag" class="btn btn-outline-secondary btn-sm"
                @click="deleteSlide(slide)">
          Удалить
        </button>
      </div>
    </div>

    <div class="review__date">
      <div>
        {{ date }}
      </div>
      <div>
        <button v-if="adminFlag" class="btn btn-outline-secondary btn-sm"
                @click="deleteReview()">
          Удалить отзыв
        </button>
      </div>
    </div>
  </div>
</template>

<script>/**
 * Карточка отзыва на товар
 * Отзывы имеют отправителя, дату, количество звезд, комментарий, фото(опционально)
 */

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState(['review_imageS', "review_image", "users_reviewS", "userS", "curUserRole"]),
    adminFlag() {
      return this.curUserRole
    },
    user() {
      let userId = this.users_reviewS.find((i) => i.review_id === this.id).user_id;
      let userObj = this.userS.find((i) => i.id === userId);
      return userObj.first_name + ' ' + userObj.last_name;
    },
    /**
     * Выбираем запись из связки отзыв изображение по id отзыва, фиксируем id картинок в просмотренных
     * пока находятся новые записи для данного отзыва с не просмотренными id изображений
     * добавляем url картинок под данный отзыв в массив
     * @returns список url изображений вложенных в отзыв
     */
    image() {
      let images = [];
      let imageId = -1;
      if (this.review_imageS.find((i) => i.review_id === this.id))
        imageId = this.review_imageS.find((i) => i.review_id === this.id);
      let watched = [];
      while (imageId !== -1) {
        watched.push(imageId.images_id)
        images.push(this.review_image.find((i) => i.id === imageId.images_id).url)
        if (this.review_imageS.find((i) => i.review_id === this.id
            && !watched.includes(i.images_id)))
        {
          imageId = this.review_imageS.find((i) => i.review_id === this.id
              && !watched.includes(i.images_id))}
        else imageId = -1;
      }
      return images;
    }
  },
  methods: {
    deleteReview() {
      let reviewId = this.id;
      this.$store.commit('deleteReview', reviewId);
    },
    deleteSlide(slide) {
      let idToDelete = this.review_image.find((i) => i.url === slide).id
      this.$store.commit('deleteReviewImage', {idToDelete});
    }
  },
  name: "ReviewCard",
  props: {
    id: {
      type: Number,
      required: true
    },
    mark: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
}
</script>
