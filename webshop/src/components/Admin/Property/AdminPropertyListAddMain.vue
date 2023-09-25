<template>
  <div>
    <div>
      <button class="btn btn-success btn-sm button-plus"
              @click="showInputTop = !showInputTop">
        +
      </button>
      <div class="not_my_flex_row_prop">
        <input v-if="showInputTop"
               type="text"
               class="form-control form-control-sm"
               v-model="newPropertyTop">
        <button v-if="showInputTop"
                class="btn btn-outline-success"
                @click="addProperty(null, newPropertyTop)">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Добавление характеристики
 */

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState(['propertyS']),
    property() {
      return this.propertyS;
    },
    property_top() {
      return this.property.filter((prop) => {
        return prop.parentId === null
      });
    },
  },
  data() {
    return {
      inputProperty: '', /** id характеристики-родителя для будущей */
      newPropertyTop: '', /** поле ввода новой характеристики */
      showInputTop: false,
    };
  },
  methods: {
    addProperty(parentIdAdd, nameAdd) {
      this.$store.commit('addPropertyByPropertyComponent', {parentIdAdd, nameAdd});
      this.showInputTop = false;
      this.inputProperty = '';
    },
    showPropertyInput(propertyId) {
      this.inputProperty = propertyId;
    }
  },
  name: "AdminPropertyListAddMain"
};
</script>
