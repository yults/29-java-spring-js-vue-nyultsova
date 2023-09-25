<template>
  <div id="app">
    <div v-if="loading" class="spinner-border spinner-border-lr"></div>
    <div v-else>
      <div class="container1">
        <router-view />
      </div>
    </div>
  </div>
</template>



<script>
import {mapActions} from "vuex";
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    ...mapActions(["fetchInfo"]),
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    async getData()
    {
      this.$store.dispatch('fetchCategory');
      this.$store.dispatch('fetchInfo');
      this.$store.dispatch('fetchProperty');
      this.$store.dispatch('fetchReview');
      this.$store.dispatch('fetchProductPropertyS');
      this.$store.dispatch('fetchProductCategoryS');
      this.$store.dispatch('fetchReviewImage');
      this.$store.dispatch('fetchReviewImages');
      this.$store.dispatch('fetchUsers');
      this.$store.dispatch('fetchUsersReviews');
    }
  },
  data() {
    return {
      loading: true
    }
  },
  async created() {
    await this.getData();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>
