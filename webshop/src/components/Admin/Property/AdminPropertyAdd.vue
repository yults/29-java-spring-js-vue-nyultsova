<template>
  <div>
    <div class="admin__property-add_wrapper">
      <select v-model="selectedLabel"
              id="label"
              @change="loadNestedLabels">
        <option value="" disabled class="property__add">
          Выберите характеристику:
        </option>
          <option v-for="props_names in property_top" :key="props_names.id"
                  :value="props_names.name">
            {{props_names.name}}
          </option>
      </select>
      <div v-if="showChild">
        <AdminPropertyAddChild
          :productId="productId"
          :childList="property_child(this.selectedList)"
          :parentId="selectedList.id"
          @childEvent="handleChildEvent">
        </AdminPropertyAddChild>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Выбор харатеристики отдельного товара в администрировании категорий выпадающим списком
 * Вызов компонента, выводящий значения характеристик выпадающим списком
 */

import {mapState} from "vuex";
import AdminPropertyAddChild from "@/components/Admin/Property/AdminPropertyAddChild.vue";

export default {
  components: {AdminPropertyAddChild},
  computed: {
    ...mapState(['propertyS']),
    property() { /** характеристики и их значения */
      return this.propertyS;
    },
    property_top() { /** характеристики */
      return this.property.filter((prop) => {
        return prop.parentId === null
      });
    },
  },
  data() {
    return {
      selectedLabel: '', /** имя выбранной характеристики */
      selectedId: 0, /** id выбранной характеристики */
      selectedList: {}, /** значения выбранной характеристики */
      showChild: false, /** показать выбор значений выбранной характеристики */
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    handleChildEvent(data) { /** При выборе значения характеристики закрыть окошко */
      this.showChild = data;
      this.selectedLabel = '';
      this.$emit('childEvent', false);
    },
    loadNestedLabels() { /** Выбор характеристики */
      this.showChild = true;
      this.selectedList = this.property_top.find(prop => prop.name === this.selectedLabel);
    },
    property_child(prop_names) { /** Список значений данной характеристики */
      return this.property.filter((prop) => {
        return prop.parentId === prop_names.id
      });
    },
  },
  name: "AdminPropertyAdd",
  props: {
    productId: {
      type: Number,
      required: true
    },
  },
};
</script>
