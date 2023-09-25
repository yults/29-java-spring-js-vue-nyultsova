<template>
  <div class="cart__product-cnt">
    <button class="button__less"
            @click="onClickMinus">
      −
    </button>
    <div class="product_cnt">
      {{ cnt }}
    </div>
    <button class="button__more"
            @click="onClickPlus">
      +
    </button>
  </div>
</template>

<script>

/**
 * Переключатель количества товаров
 */
export default {
  methods: {
    onClickPlus() {
      this.$emit('update-cart', this.cnt + 1);
    },
    onClickMinus() {
      if (this.cnt > 1) {
        this.$emit('update-cart', this.cnt - 1);
      } else {
        this.$emit('remove-item');
      }
    },
  },
  name: "BaseSwitcher",
  props: {
    cnt: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  }
};
</script>