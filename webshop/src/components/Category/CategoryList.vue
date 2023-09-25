<template>
  <div>
    <CategoryNode v-for="category in topLevelCategories" :key="category.id" :category="category"></CategoryNode>
  </div>
</template>

<script>

/**
 * Категории для модального окна навигации по категориям в главном меню
 * Вызов компонента генерирующий список всех категорий
 */

import CategoryNode from './CategoryNode.vue';
import {mapState} from "vuex";

export default {
  name: 'CategoryList',
  components: {
    CategoryNode
  },
  computed: {
    ...mapState(['categoryS']),
    topLevelCategories() {
      return this.categoryS.filter(category => category.parentId === null);
    },
  },
};
</script>