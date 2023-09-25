<template>
  <div>
    <div class="properties">
        <ul
            class="property__names"
            v-for="props_names in property_top"
            :key="props_names.id">
          {{props_names.name}}
          <button class="btn btn-success btn-sm button-plus"
                  @click="showPropertyInput(props_names.id)">
            +
          </button>
          <button class="btn btn-danger btn-sm button-minus"
                  @click="deleteProperty(props_names.id)">
            -
          </button>
          <div>
            <input v-if="props_names.id === inputProperty"
                   type="text"
                   class="form-control-sm"
                   v-model="newPropertyChild">
            <button class="btn btn-outline-success" v-if="props_names.id === inputProperty"
                    @click="addProperty(props_names.id, newPropertyChild)">
              Сохранить
            </button>
          </div>
            <li
                class="property__names_val"
                v-for="prop in property_child(props_names)"
                :key="prop.id">
                {{ prop.name }}
              <button class="btn btn-outline-danger btn-sm button-minus"
                      @click="deleteProperty(prop.id)">
                -
              </button>
            </li>
        </ul>
  </div>
  </div>
</template>

<script>

/**
 * Список всех характеристик и их значений в администрировании
 * Добавление/удаление характеристик
 * Добавление/удаление значений характеристик
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
      newPropertyChild: '', /** поле ввода нового значения */
    };
  },
  methods: {
    addProperty(parentIdAdd, nameAdd) {
      this.$store.commit('addPropertyByPropertyComponent', {parentIdAdd, nameAdd});
      this.inputProperty = '';
    },
    closeModal() {
      this.showModal = false;
    },
    deleteProperty(cid) {
      this.$store.commit('deletePropertyByPropertyComponent', {childId : parseInt(cid)});
    },
    property_child(prop_names) {
      return this.property.filter((prop) => {
        return prop.parentId === prop_names.id
      });
    },
    showPropertyInput(propertyId) {
      this.inputProperty = propertyId;
    }
  },
  name: "AdminPropertyList"
};
</script>
