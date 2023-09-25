<template>
      <div class="header-right">
          <span v-if="fullName.length === 0" class="button__entry">
            <router-link to="/login"
                         class="nav-link button__entry">
            войти &#128125;
            </router-link>
          </span>
          <span v-else class="button__entry">
             <span @click="logout()" class="nav-link">
               выйти  &#128125;
             </span>
          </span>
        <span v-if="fullName.length !== 0" class="button__entry nav-link">
             {{ fullName }}
        </span>
        <span v-if="showAdmin" >
          <router-link to="/adminpage"
                       class="nav-link">
          <span class="button__entry">
            Админка
          </span>
        </router-link>
        </span>

        <router-link to="/cart"
                     class="nav-link">
          <span class="link__to-cart">
            корзина &#128722; ({{ cnt_bin }})
          </span>
        </router-link>
      </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "HeaderRight",
  computed: {
    ...mapState(['curUserRole', 'curUserId', 'userS']),
    showAdmin() {
      return this.curUserRole
    },
    fullName() {
      if (this.curUserId !== -1) {
        let user = this.userS.find((u) => u.id === this.curUserId)
        return user.first_name + ' ' + user.last_name;
      }
      return '';
    }
  },
  methods: {
    logout() {
      this.$store.commit('doLogout');
      this.$router.push({ path: "/login" })
    }
  },
  props: {
    cnt_bin: { /** количество товаров в корзине */
      type : Number,
      required: true,
    }
  },
}
</script>