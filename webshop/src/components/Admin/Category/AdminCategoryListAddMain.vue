<template>
  <div>
    <button class="btn btn-warning button-plus"
            @click="showInputMethod">
      +
    </button>
    <div class="not_my_flex_row">
      <input v-if="showInput"
             class="form-control form-control-sm"
             type="text"
             v-model="newCategory">
      <button v-if="showInput"
              class="btn btn-outline-success"
              @click="addCategory()">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>

/**
 * Кнопка добавления категории верхнего уровня
 */

import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(["categoryS"]),
    categories() {
      return this.categoryS;
    }
  },
  data() {
    return {
      showInput: false, /** видимость поля ввода новой категории */
      newCategory: '', /** поле ввода новой категории */
    }
  },
  methods: {
    addCategory() { /** создать новую категорию верхнего уровня */
    this.inputCategory = null;
      this.showInput = false;
      this.$store.commit('addCategoryByAdminCategory', {categoryId : null, newCat : this.newCategory});
    },
    showInputMethod() {
      this.showInput = !this.showInput;
    }
  },
  name: 'AdminCategoryListAddMain',
};

</script>