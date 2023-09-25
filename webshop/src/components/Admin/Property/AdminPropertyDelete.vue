<template>
  <div class="property__delete_modal">
    <div>
      <ul>
        <li
            class="property__delete"
            v-for="prop in thisProductProperties"
            :key="prop.id"
        >
          {{ prop.name }}
          <button class="btn btn-outline-danger btn-sm"
                  @click="deleteProperty(prop.id)">
            -
          </button>
        </li>
      </ul>
    </div>
    <div v-show="thisProductProperties.length ===0" class="property__delete_notfound">
      Удалить нечего
    </div>
    <div>
    <button class="review-modal__button_close property__delete_close"
            @click.prevent="closeModal">
      X
    </button>
    </div>
    </div>
</template>

<script>

/**
 * Список значений харатеристик отдельного товара в администрировании категорий
 * Удаление значений харатеристик отдельного товара
 */

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState([
        'propertyS', 'product_propertyS'
    ]),
    productProperty() {
      return this.product_propertyS;
    },
    property() {
      return this.propertyS;
    },
    thisProductProperties() {
      let product_in_productProperty = this.productProperty.filter((prop) => {
        return prop.product_id === this.productId
      });
      return this.property.filter((prop) => {
        let filter = false;
        for (let prop_in_productProperty of product_in_productProperty)
          if (prop.id === prop_in_productProperty.property_id) filter = true;
        return filter;
      });
    },
  },
  methods: {
    closeModal() {
      this.$emit('childEventDelete')
    },
    deleteProperty(propertyId) {
      this.$store.commit('deletePropertyByPropertyModal', {productId : this.productId, propertyId});
    },
  },
  name: "AdminPropertyDelete",
  props: {
    productId: {
      type: Number,
      required: true
    },
  }
};
</script>
