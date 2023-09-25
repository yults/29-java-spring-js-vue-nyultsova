<template>
  <div class="filters">
    <div class="filter-buttons">
      <div class="filter-choice">
        <button class="filter-modal-button"
                @click="toggleFilter">
          {{ filterLabel }}
          <i :class="{'arrow-up': showFilter,
                      'arrow-down': !showFilter,
                      'arrow-icon': true }"></i>
        </button>
        <ul class="filter-ul"
            v-if="showFilter">
          <li class="filter-ul-li"
              @click="sortProducts('price_asc')">
            По возрастанию цены
          </li>
          <li class="filter-ul-li"
              @click="sortProducts('price_desc')">
            По убыванию цены
          </li>
          <li class="filter-ul-li"
              @click="sortProducts('rating')">
            По рейтингу
          </li>
        </ul>
      </div>
      <button class="filter-modal-button"
              @click="toggleFilterAnother">
        Другие фильтры
      </button>
    </div>

    <div :class="{ 'filters-open': showAdditionalFilters,
                   'filters-for-open' : true}">
      <div class="button-to-right">
        <button class="review-modal__button_close"
                @click.prevent="showAdditionalFilters = !showAdditionalFilters">
          X
        </button>
      </div>
      <div>
        Стоимость:
      </div>
      <div>
        <div>
          <span> от </span>
          <input type="number"
                 v-model="from_filter"
                 class="filterInput form-control-sm">
          <span> до </span>
          <input type="number"
                 v-model="to_filter"
                 class="filterInput form-control-sm">
        </div>
        <button class="button_filter_delete btn btn-outline-success"
                @click="costFilter()">
          Применить
        </button>
      </div>
      <div class="properties__filter">
        <ul
            class="property__names"
            v-for="props_names in property_top" :key="props_names.id"
        >
          {{ props_names.name }}
          <li
              class="filter__property__names_val"
              v-for="prop in property_child(props_names)" :key="prop.id"
          >
            <input
                type="checkbox"
                :value="prop.id"
                v-model="property_filter"
                @click="propertyFilterEmit()"/>
            {{ prop.name }}
          </li>
        </ul>
      </div>
      <button class="button_filter_delete btn btn-outline-warning"
              @click="onMouseClickFilterDelete()">
        Очистить
      </button>
    </div>
  </div>
</template>

<script>

/**
 * Фильтры на главной странице
 * Основные фильтры: По возрастанию, убыванию, рейтингу в выпадающем списке
 * Дополнительные фильтры: по кнопке выползает модальное окно сбоку
 * Дополнительные фильтры: по стоимости - задаем диапазон и применяем его
 * Дополнительные фильтры: выбираем чекбоксами значения характеристик товара
 */

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState(['propertyS']),
    filterLabel() {
      switch (this.filter) {
        case 'price_asc':
          return 'По возрастанию цены';
        case 'price_desc':
          return 'По убыванию цены';
        case 'rating':
          return 'По рейтингу';
      }
      return 'Выберите фильтр';
    },
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
      from_filter: "", /** мин цена */
      to_filter: "", /** макс цена */
      filter: 'price_asc', /** текущий главный фильтр */
      property_filter: [], /** список значений характеристик */
      showAdditionalFilters: false,
      showFilter: false,
    };
  },
  methods: {
    costFilter() { /** фильтр по цене */
      this.$emit('cost-filter', {
        from_filter: this.from_filter,
        to_filter: this.to_filter
      })
    },
    onMouseClickFilterDelete() { /** очистить все фильтры */
      this.from_filter = "";
      this.to_filter = "";
      this.property_filter = [];
      this.filter = 'price_asc';
      this.$emit('filter-delete')
    },
    propertyFilterEmit() {
      /** Фильтр по характеристикам, при нажатии на чекбокс передаем список
        * характеристик по которым производится фильтрация
       */
      setTimeout(() => {
        this.$emit('update-property-filter', {property_filter: this.property_filter});
      }, 200)
    },
    property_child(prop_names) { /** выводит все подхарактеристики определенной характеристики */
      return this.property.filter((prop) => {
        return prop.parentId === prop_names.id
      });
    },
    sortProducts(filter) { /** сортировка по главным характеристикам */
      this.filter = filter;
      this.$emit('update-filter', {filter: this.filter});
      this.showFilter = !this.showFilter;
    },
    toggleFilter() { /** отображение главных фильтров */
      this.showFilter = !this.showFilter;
    },
    toggleFilterAnother() { /** отображение дополнительных фильтров */
      this.showAdditionalFilters = !this.showAdditionalFilters;
    },
  },
  name: "CatalogFilter"
}
</script>