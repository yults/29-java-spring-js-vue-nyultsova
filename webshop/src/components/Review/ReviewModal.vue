<template>
  <div class="review-modal">
    <div class="review-modal__overlay"
         @click.prevent="closeModal"></div>
    <div class="review-modal__container">
      <div class="review-modal__header">
        <h3>
          Оставить отзыв на товар {{ productName }}
        </h3>
        <button class="review-modal__button_close"
                @click.prevent="closeModal">
          X
        </button>
      </div>
      <div  v-if="userFlag">
        <div class="review-modal__body">
          <div class="form-group">
            <label class="review-modal__label" for="rating">
              Оценка:
            </label>
            <div class="rating">
              <label v-for="i in 5" :key="i">
                <input type="radio"
                       :id="'star' + i"
                       :value="i"
                       v-model="selectedStars">
                <span
                    :class="{ 'highlighted': i <= highlightedStars,
                     'selected': i <= selectedStars,
                      star: true }"
                    @mouseover="highlight(i)"
                    @mouseleave="resetHighlight">

              </span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="review-modal__label" for="comment">
              Комментарий:
            </label>
            <textarea id="comment"
                      v-model="comment"
                      class="review-modal__textarea"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="review-modal__label" for="image">
              Изображения:
            </label>
            <input type="file"
                   id="image"
                   @change="onImageChange" multiple>
          </div>
          <div>Загружено {{ imageCnt }} изображений</div>
          <div class="images-preview">
            <img v-for="(image, index) in images" :key="index"
                 :src="image"
                 alt="Preview">
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-button"
                  @click.prevent="submitReview">
            Отправить
          </button>
        </div>
      </div>
      <div v-else>
        Чтобы оставить отзыв пройдите
        <router-link to="/login">
          авторизацию
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Модальное окно отправки отзыва на товар
 * Необходимо заполнить оценку, комментарий и добавить фото(опционально)
 */

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState(['reviewS', 'curUserId']),
    userFlag() {
      return this.curUserId !== -1
    }
  },
  data() {
    return {
      /** Поля для заполнения */
      imageCnt: 0,
      selectedStars: null,
      highlightedStars: null,
      comment: '',
      images: [],
    };
  },
  methods: {
    highlight(star) {
      this.highlightedStars = star;
    },
    resetHighlight() {
      this.highlightedStars = null;
    },
    onImageChange(event) {
      this.imageCnt++;
      let review_id = this.reviewS.length + 2;
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
          const url = e.target.result;
          this.$store.commit('addImageToReview', { url, review_id });
        };

        reader.readAsDataURL(file);
      }
    },
    submitReview() {
      this.imageCnt = 0;
      let review_id = this.reviewS.length + 2;
      let now = new Date();
      let mon = parseInt(now.getMonth()) + 1;
      if (parseInt(mon) < 10) mon = "0" + mon;
      mon = '.' + mon + '.';
      let dateStr = now.getDate() + mon + now.getFullYear();
      let review = {
        product_id: this.productId,
        mark: this.selectedStars,
        comment: this.comment,
        date: dateStr,
        review_id: review_id
      };
      this.$store.commit('addToReview', review);
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    },
  },
  name: "ReviewModal",
  props: {
    productId: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    }
  },
};
</script>
