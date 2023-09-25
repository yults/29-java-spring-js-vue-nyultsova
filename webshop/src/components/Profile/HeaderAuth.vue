<template>
  <div>
    <header class="auth_header">
      <router-link to="/home" class="nav-link">
            <span class="catalog_login">
              Каталог
            </span>
      </router-link>
      <div class="header-right">
        <router-link to="/cart" class="nav-link">
                  <span class="button_bin-login">
                    Корзина ({{ cnt_bin }})
                  </span>
        </router-link>
      </div>
    </header>
    <hr class="hr__login">
  </div>
</template>

<script>
export default {
  name: "HeaderAuth",
  props: {
    cnt_bin: { /** количество товаров в корзине */
      type : Number,
      required: true,
    }
  },
}
</script>