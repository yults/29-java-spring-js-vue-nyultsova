<template>
  <div class="wrapper_color" v-if="userFlag">
    <HeaderAuth :cnt_bin="cnt_bin"></HeaderAuth>
    <div class="auth-page">
      <div class="auth__window">
        <h2 class="auth__head">
          Вход в личный аккаунт
        </h2>
        <Form @submit="handleLogin"
              :validation-schema="schema">
          <div class="auth__inputs">
            <div class="form-group">
              <Field name="email"
                     type="email"
                     v-model="email"
                     class="autorization_input auth_inputs"
                     placeholder="Email"
                     autocomplete="off"/>
            </div>
            <div class="form-group">
              <Field name="password"
                     v-model="password"
                     type="password"
                     class="autorization_input auth_inputs"
                     placeholder="Пароль"
                     autocomplete="off"/>
            </div>
            <div class="auth__buttons">
              <button class="send_entry"
                      :disabled="loading"
                      @mouseenter="onMouseEnterSend($event)"
                      @mouseleave="onMouseLeaveSend($event)">
                                    <span v-show="loading"
                                          class="spinner-border spinner-border-sm"></span>
                <span>
                                      Войти
                                    </span>
              </button>
            </div>
          </div>
          <router-link to="/register" class="new_acc_link">
            <a class="new_acc">
              Нет аккаунта? Создать
            </a>
          </router-link>
          <div class="form-group">
            <div v-if="message"
                 class="alert alert-danger"
                 role="alert">
              {{ message }}
            </div>
          </div>
          <div class="error_messages">
            <div><ErrorMessage name="email" class="error-feedback" /></div>
            <div><ErrorMessage name="password" class="error-feedback" /></div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Страница авторизации
 * Поля email, пароль
 * Кнопка входа
 * Кнопка перехода на страницу регистрации
 */

import {mapGetters, mapState} from 'vuex'
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import HeaderAuth from "@/components/Profile/HeaderAuth.vue";
export default {
  components: {
    HeaderAuth,
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
    ...mapGetters([
       'getCartInfo'
    ]),
    ...mapState(['userS', 'users_reviewS', 'curUserId']),
    userFlag() {
      return this.curUserId === -1
    },
    cnt_bin() {
      let totalCnt = 0;
      for (let item of this.getCartInfo)
        totalCnt += item.cnt;
      return totalCnt;
    },
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Email is required!"),
      password: yup.string().required("Password is required!"),
    });
    return {
      email: '',
      password: '',
      loading: false,
      message: "",
      schema,
    };
  },
  methods: {
    onMouseEnterSend(e) {
      e.target.style.backgroundColor = 'rgb(80, 80, 80)'
    },
    onMouseLeaveSend(e) {
      e.target.style.backgroundColor = 'gray'
    },
    handleLogin() {
      this.loading = true;
      let user1 = this.userS.find((i) => i.email === this.email);
      if (typeof user1 == "undefined")  {
        this.message = 'Такой email не зарегестрирован';
        this.loading = false;
        return;
      }
      if (user1.password !== this.password) {
        this.message = 'Пароль неверный';
        this.loading = false;
        return;
      }
      this.$store.commit('doLogin', {userId : user1.id} );
      this.message = 'Успех';
      this.loading = false;
      this.$router.push({ name: "home" })
    },
    // handleLogin(user) {
    //   this.loading = true;
    //   this.$store.dispatch("auth/login", user).then(
    //       () => {
    //         this.$router.push("/profile");
    //       },
    //       (error) => {
    //         this.loading = false;
    //         this.message =
    //             (error.response &&
    //                 error.response.data &&
    //                 error.response.data.message) ||
    //             error.message ||
    //             error.toString();
    //       }
    //   );
    // },
  },
  name: "LoginPage",
};
</script>
