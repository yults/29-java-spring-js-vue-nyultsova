<template>
  <div>
    <div v-if="showProductAddModal">
      <ProductAddModal :category_id="category_for_new" @close="showProductAddModal = false"></ProductAddModal>
    </div>
  <ul>
    <li
        class="category-color"
        v-for="category in filteredCategories"
        :key="category.id"
        :class="'level-' + level"
        :style="styleObject(category, 0)"
    >
      <div class="droppable"
             @dragstart="onDragStartCategory($event, category)"
             draggable="true"
            @drop="onDrop($event, category.id)"
            @dragover.prevent
            @dragenter.prevent>
        <div :class="[markerClasses(category), 'marker', 'category-color']"></div>
        {{ category.name }}
        <span>
          <button class="btn btn-warning btn-sm button-plus"
                  @click="showCategoryInput(category.id)">
            +
          </button>
          <button class="btn btn-primary btn-sm button-plus"
                  @click="openProductAddModal(category.id)">
            +
          </button>
          <button class="btn btn-danger btn-sm button-minus"
                  @click="deleteCategory(category.id)">
            -
          </button>
        </span>
        <div>
          <input v-if="category.id === inputCategory"
                 type="text"
                 class="form-control-sm"
                 v-model="newCategory">
          <button v-if="category.id === inputCategory"
                  class="btn btn-outline-success"
                  @click="addCategory(category.id)">
            Сохранить
          </button>
        </div>
      </div>
      <ul>
        <li
            class="product-color draggable"
            v-for="product in categoryProducts(category)"
            @drop="onDrop($event, category.id)"
            @dragover.prevent
            @dragenter.prevent
            @dragstart="onDragStart($event, product)"
            draggable="true"
            :key="product.id"
            :class="'level-' + (level + 1)"
            :style="styleObject(category, 1)">
          <div class="marker product-color" :class="[markerClasses(product)]"></div>
            {{ product.name }}
          <span>
          <button class="btn btn-danger btn-sm"
                  @click="deleteProduct(product.id)">
            -
          </button>
            <button class="btn btn-outline-success btn-sm button-plus"
                    @click="propertyModal(product.id)">
            + x.
          </button>
          <button class="btn btn-outline-danger btn-sm button-minus"
                  @click="propertyModalDelete(product.id)">
            - x.
          </button>
          </span>
          <div>
            <AdminPropertyAdd
                v-if="showPropertyChoiceModal === product.id"
                :productId="parseInt(product.id)"
                :productName="product.name"
                @childEvent="handleChildEvent"
            ></AdminPropertyAdd>
            <AdminPropertyDelete
                v-if="showPropertyDeleteModal === product.id"
                :productId="parseInt(product.id)"
                :productName="product.name"
                @childEventDelete="handleChildEventDelete"
            ></AdminPropertyDelete>
          </div>
        </li>
      </ul>
      <AdminCategoryNode
          v-if="hasChildCategories(category.id)"
          :parent-category-id="category.id"
          :level="level + 1"
          @update-category-depth="updateCategoryDepth"
      ></AdminCategoryNode>
    </li>
  </ul>
  </div>
</template>

<script>

/**
 * Список категорий в администрировании
 * Добавление и удаление категорий
 * Drag-and-drop категорий и продуктов
 * Удаление товаров
 * Вызов компонентов-окон с работой над характерисиками отдельного товара
 */

import {mapGetters, mapState} from "vuex";
import AdminPropertyAdd from "@/components/Admin/Property/AdminPropertyAdd.vue";
import AdminPropertyDelete from "@/components/Admin/Property/AdminPropertyDelete.vue";
import ProductAddModal from "@/components/Admin/Category/ProductAddModal.vue";

export default {
  components: {
    ProductAddModal,
    AdminPropertyAdd,
    AdminPropertyDelete
  },
  computed: {
    ...mapState(["categoryS", "product_categoryS"]),
    ...mapGetters(["getInfo"]),
    categories() { /** категории с уровнем для древовидного отображения */
      return this.categoryS.map((category) => {
        return {
          ...category,
          depth: this.level,
        };
      });
    },
    filteredCategories() { /** список выводимых категорий */
      const parentCategoryId = this.parentCategoryId || null;
      if (parentCategoryId === null) {
        return this.topLevelCategories;
      }
      return this.categories.filter(
          (category) => category.parentId === parentCategoryId
      );
    },
    products() { /** товары с уровнем для древовидного отображения */
      return this.getInfo.map((product) => {
        return {
          ...product,
          depth: this.level + 1,
        };
      });
    },
    topLevelCategories() { /** категории верхнего уровня (корневые) */
      return this.categories.filter((category) => category.parentId === null);
    },
  },
  data() {
    return {
      category_for_new: -1, /** id категории добавляемоего товара */
      inputCategory: null, /** id родителя новой подкатегории */
      newCategory: "", /** поле ввода новой подкатегории */
      showPropertyChoiceModal: '', /** окошко выбора характеристики */
      showPropertyDeleteModal: '', /** окошко с перечисленными подхарактеристиками для их удаления */
      showProductAddModal: false,
    }
  },
  methods: {
    openProductAddModal(cat) {
      this.category_for_new = cat;
      this.showProductAddModal = true;
    },
    addCategory(categoryId) { /** добавить подкатегорию */
      this.inputCategory = null;
      this.$store.commit('addCategoryByAdminCategory', {categoryId, newCat : this.newCategory});
    },
    categoryProducts(category) {
      const filteredProducts = this.products.filter((product) => {
        return this.product_categoryS.some((pc) => {
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
    deleteCategory(categoryId) {
      this.$store.commit('deleteCategoryByAdminCategory', categoryId);
    },
    deleteProduct(productId) {
      this.$store.commit('deleteProductByAdminCategory', productId);
    },

    /** Закрытие модалки при фиксации изменений в дочернем компоненте */
    handleChildEvent() {
      this.showPropertyChoiceModal = '';
    },
    handleChildEventDelete() {
      this.showPropertyDeleteModal = '';
    },
    hasChildCategories(categoryId) {
      return this.categories.some((category) => category.parentId === categoryId);
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

    /** Окошки с выбором для конкретного товара характеристик */
    propertyModal(productId) {
      if (productId === this.showPropertyChoiceModal)
        this.showPropertyChoiceModal = '';
      else
        this.showPropertyChoiceModal = productId;
      this.showPropertyDeleteModal = '';
    },
    propertyModalDelete(productId) {
      if (productId === this.showPropertyDeleteModal)
        this.showPropertyDeleteModal = '';
      else
        this.showPropertyDeleteModal = productId;
     this.showPropertyChoiceModal = '';
    },

    /** Механизм перетаскивания товаров и категории в другие категории */
    onDragStart(e, item) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('itemId', item.id.toString())
    },
    onDragStartCategory(e, category) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('categoryId', category.id.toString())
    },
    onDrop(e, categoryId) {
      const itemId = parseInt(e.dataTransfer.getData('itemId'))
      const categoryIdChild = parseInt(e.dataTransfer.getData('categoryId'))
      try {
        this.$store.commit('updateCategoryCategoryByAdminCategory', {categoryIdChild, categoryId});
      } catch (e) {
        this.$store.commit('updateCategoryByAdminCategory', {itemId, categoryId});
      }
    },

    showCategoryInput(categoryId) {
      this.inputCategory = categoryId;
    },
    styleObject(category, smt) { /** Стилизуем отступы */
      const padding = 20;
      const paddingLeft = `${(category.depth + smt) * padding}px`;
      return {paddingLeft};
    },
    updateCategoryDepth() { /** Пересчет глубины для всех продуктов и категорий */
      this.categories.forEach((category) => {
        category.depth = this.level;
      });
      this.products.forEach((product) => {
        product.depth = this.level + 1;
      });
    },
  },
  name: "AdminCategoryNode",
  props: {
    level: { /** уровень расположения по дереву */
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