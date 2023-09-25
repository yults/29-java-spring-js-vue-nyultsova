<template>
  <div :class="[{ 'slider_big': sizeOfPic }, 'slider']">
    <div class="slider__container"
         :style="{ transform: 'translateX(' + this.position + 'px)' }">
      <div :class="[{ 'slider__slide_big': sizeOfPic }, 'slider__slide']"
           v-for="(slide, index) in slides"
           :key="index">
        <img :class="[{ 'slider__image_big': sizeOfPic }, 'slider__image']"
             :src="slide" :alt="name">
      </div>
    </div>
    <div v-if="multiple_img"
         :class="{ 'slider__controls_big': this.sizeOfPic,
                   'slider__controls': true }">
      <button :class="[{ 'slider__control_big': sizeOfPic }, 'slider__controls_control', 'slider__control--prev']"
              @click="prevSlide">
        <i :class="['fas', 'fa-chevron-left']"></i>
      </button>
      <button :class="[{ 'slider__control_big': sizeOfPic }, 'slider__controls_control', 'slider__control--next']"
              @click="nextSlide">
        <i :class="['fas', 'fa-chevron-right']"></i>
      </button>
    </div>
  </div>
</template>

<script>

/**
 * Слайдер фотографий с иконками стелок
 * В двух форматах - большой и маленький
 */

export default {
  data() {
    return {
      picIndex: 0, /** номер картинки */
      position: 0, /** позиция в px */
      slideWidth: 300,
    }
  },
  methods: {
    nextSlide() {
      if (this.picIndex < this.slides.length - 1) {
        this.picIndex++;
        if (this.sizeOfPic) this.position -= 370; else
          this.position -= 100;
      }
    },
    prevSlide() {
      if (this.picIndex !== 0) {
        this.picIndex--;
        if (this.sizeOfPic) this.position += 370; else
          this.position += 100;
      }
    }
  },
  mounted() { /** Вычисляем ширину слайда после рендера, чтобы использовать ее для перемещения слайдов */
  this.slideWidth = this.$el.querySelector('.slider__slide').offsetWidth;
  },
  name: "BaseSlider",
  props: {
    multiple_img: { /** флаг есть ли несколько картинок или она одна */
      type: Boolean,
      required: true
    },
    name: { /** название товара */
      type: String,
      required: true
    },
    sizeOfPic: { /** маленький или большой слайдер */
      type: Boolean,
      required: true
    },
    slides: {
      type: Array,
      required: true
    }
  }
}
</script>
