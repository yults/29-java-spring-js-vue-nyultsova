<template>
  <div>
    <AdminCategoryNode :category="topLevelCategories"></AdminCategoryNode>
  </div>
</template>

<script>

/**
 * Категории в администрировании
 * Добавление категорий вернего уровня
 * Вызов компонента генерирующий список всех категорий
*/

import { mapState } from 'vuex';
import AdminCategoryNode from "@/components/Admin/Category/AdminCategoryNode.vue";

export default {
  components: {
    AdminCategoryNode
  },
  computed: {
    ...mapState(["categoryS"]),
    categories() {
      return this.categoryS;
    },
    topLevelCategories() {
      return this.categories.filter(category => category.parentId === null);
    },
  },
  name: 'AdminCategoryList',
};

</script>