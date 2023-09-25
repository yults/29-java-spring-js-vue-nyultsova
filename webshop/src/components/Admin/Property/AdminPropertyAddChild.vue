<template>
  <div>
    <select v-model="selectedNestedLabel"
            id="nestedLabel"
            @change="selectNestedLabels">
      <option value="" disabled class="property__add">
        Выберите значение:
      </option>
        <option v-for="prop in childList" :key="prop.id"
                :value="prop.name">
          {{prop.name}}
        </option>
    </select>
      <div v-if="selectedNestedLabel">
        <button @click="addLabel" class="btn btn-outline-success">
          Сохранить
        </button>
      </div>
  </div>
</template>

<script>

/**
 * Выбор из значений определенной харатеристики отдельного товара в администрировании категорий выпадающим списком
 * Добавление значения характеристики товару
 */

import {mapState} from "vuex";
export default {
  computed: {
    ...mapState(['propertyS']),
    property() {
      return this.propertyS;
    },
  },
  data() {
    return {
      selectedNestedLabel: '', /** выбранное значение */
      selectedList: '', /** сваязка характеристика-родитель и значение */
    };
  },
  methods: {
    addLabel() {
      this.$emit('childEvent', false);
      this.$store.commit('addPropertyByPropertyModal',
          { parentIdAdd : this.parentId,
            productIdAdd : this.productId,
            childIdAdd : this.selectedList.id
          });
    },
    selectNestedLabels() {
      this.selectedList = this.property.find(prop => prop.name === this.selectedNestedLabel);
    },
  },
  name: "AdminPropertyAddChild",
  props: {
    productId: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      required: true
    },
    childList: {
      type: Object,
      required: true
    }
  },
};
</script>
