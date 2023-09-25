<template>
  <ul>
    <li
        class="category-color"
        v-for="category in filteredCategories"
        :key="category.id"
        :class="'level-' + level"
        :style="styleObject(category, 0)"
        @click="handleCategoryClick($event, category.id)"
    >
      <div :class="[markerClasses(category), 'marker', 'category-color']"></div>
      <span @click="handleCategoryClick($event, category.id)"
            @mouseenter="onMouseEnterSend($event)"
            @mouseleave="onMouseLeaveSend($event)">
        {{ category.name }}
      </span>
      <ul>
        <li
            class="product-color"
            v-for="product in categoryProducts(category)"
            :key="product.id"
            :class="'level-' + (level + 1)"
            :style="styleObject(category, 1)"
        >
          <div :class="[markerClasses(product), 'marker', 'product-color']"></div>
          <router-link :to="{ name: 'ProductReviewPage', params: { productId: product.id }}">
            {{ product.name }}
          </router-link>
        </li>
      </ul>
      <CategoryNode
          v-if="hasChildCategories(category.id)"
          :parent-category-id="category.id"
          :level="level + 1"
          @update-category-depth="updateCategoryDepth"
          @product-ids="handleProductIds"
      ></CategoryNode>
    </li>
  </ul>
</template>

<script>

/**
 * Список категорий в модальном окне навигации по категориям в главном меню
 * Древовидная структура, отступы и метки по уровням
 */

import {mapGetters, mapState} from "vuex";

export default {
  computed: {
    ...mapGetters(["getInfo"]),
    ...mapState(['categoryS', 'product_categoryS']),
    products() {
      return this.getInfo.map((product) => {
        return {
          ...product,
          depth: this.level + 1,
        };
      });
    },
    productCategory() {
      return this.product_categoryS;
    },
    categories() {
      return this.categoryS.map((category) => {
        return {
          ...category,
          depth: this.level,
        };
      });
    },
    filteredCategories() {
      const parentCategoryId = this.parentCategoryId || null;
      if (parentCategoryId === null) {
        return this.topLevelCategories;
      }
      return this.categories.filter(
          (category) => category.parentId === parentCategoryId
      );
    },
    topLevelCategories() {
      return this.categories.filter((category) => category.parentId === null);
    },
  },
  emits: ['product-ids'],
  methods: {
    categoryProducts(category) {
      const filteredProducts = this.products.filter((product) => {
        return this.productCategory.some((pc) => {
          return pc.product_id === product.id && pc.category_id === category.id;
        });
      });
      return filteredProducts.map((product) => {
        return {
          ...product,
          depth: category.depth + 1,
        };
      });
    },
    hasChildCategories(categoryId) {
      return this.categories.some((category) => category.parentId === categoryId);
    },
    updateCategoryDepth() {
      this.categories.forEach((category) => {
        category.depth = this.level;
      });
      this.products.forEach((product) => {
        product.depth = this.level + 1;
      });
    },
    styleObject(category, smt) {
      const padding = 20;
      const paddingLeft = `${(category.depth + smt) * padding}px`;
      return {
        paddingLeft,
      };
    },
    markerClasses(category) {
      let markerType;
      if (category.depth % 3 === 0) {
        markerType = "circle";
      } else if (category.depth % 3 === 1) {
        markerType = "circle-empty";
      } else if (category.depth % 3 === 2) {
        markerType = "square";
      }
      return {
        [`marker-${markerType}`]: true,
        "marker-inline": true,
      };
    },
    getProductIdsByCategoryId(categoryId) {
      const productIds = [];

      /** Рекурсивная функция для добавления всех productIds в категории и ее непосредственных дочерних категориях */
      function addProductIds(category, prodCategory, categs) {
        const categoryProductIds = prodCategory
            .filter((pc) => pc.category_id === category.id)
            .map((pc) => pc.product_id);
        productIds.push(...categoryProductIds);

        categs
            .filter((c) => c.parentId === category.id)
            .forEach((childCategory) => {
              addProductIds(childCategory, prodCategory, categs);
            });
      }

      /** Найти категорию по id и добавить все productIds */
      const category = this.categories.find((c) => c.id === categoryId);
      if (category) {
        addProductIds(category, this.productCategory, this.categories);
      }

      return productIds;
    },
    handleCategoryClick(event, categoryId) {
      if (event.target !== event.currentTarget) {
        return;
      }
      const productIds = this.getProductIdsByCategoryId(categoryId);
      productIds.unshift(categoryId);
      this.$emit("product-ids", productIds);
    },
    handleProductIds(productIds) {
      this.$emit('product-ids', productIds);
    },
    onMouseEnterSend(e) {
      e.target.style.fontWeight = "700";
    },
    onMouseLeaveSend(e) {
      e.target.style.fontWeight = "400";
    },
  },
  name: "CategoryNode",
  props: {
    level: {
      type: Number,
      default: 1,
    },
    parentCategoryId: {
      type: Number,
      default: null,
    },
  },
};
</script>