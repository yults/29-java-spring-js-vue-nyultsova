<template>
  <div class="wrapper_color" v-if="userFlag">
    <HeaderAuth :cnt_bin="cnt_bin"></HeaderAuth>
    <div class="registration-page">
      <div class="registration_window">
        <h2 class="registration_h">
          Регистрация нового пользователя
        </h2>
        <Form @submit="handleRegister"
              :validation-schema="schema">
          <div v-if="!successful">
            <div class="registration_name_inputs">
              <Field name="firstName"
                     type="text"
                     v-model="firstName"
                     class="registration_name_input"
                     placeholder="Имя"/>
              <Field name="lastName"
                     type="text"
                     v-model="lastName"
                     class="registration_name_input"
                     placeholder="Фамилия"/>
            </div>
            <div class="registration_inputs">
              <Field name="email"
                     type="email"
                     v-model="email"
                     class="registration_input auth_inputs"
                     placeholder="Email"/>
              <Field name="password"
                     type="password"
                     v-model="password"
                     class="registration_input auth_inputs"
                     placeholder="Пароль"/>
            </div>
            <div class="registration_buttons">
              <button class="send_entry"
                      :disabled="loading"
                      @mouseenter="onMouseEnterSend($event)"
                      @mouseleave="onMouseLeaveSend($event)">
                                <span v-show="loading"
                                      class="spinner-border spinner-border-sm"></span>
                <span>
                                  Зарегестрироваться
                                </span>
              </button>
            </div>
            <div class="form-group">
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
            </div>
            <div class="error_messages">
              <div><ErrorMessage name="firstName" class="error-feedback" /></div>
              <div><ErrorMessage name="lastName" class="error-feedback" /></div>
              <div><ErrorMessage name="email" class="error-feedback" /></div>
              <div><ErrorMessage name="password" class="error-feedback" /></div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>


<script>

/**
 * Страница регистрации
 * Поля email, имя, фамилия, пароль
 * Кнопка регистрации
 * Валидация полей
 */

import { Form, Field, ErrorMessage } from "vee-validate";
import {mapGetters, mapState} from 'vuex'
import * as yup from "yup";
import HeaderAuth from "@/components/Profile/HeaderAuth.vue";
export default {
    name: "RegisterPage",
    components: {
      HeaderAuth,
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            firstName: yup
                .string()
                .required("Name is required!")
                .min(3, "Must be at least 3 characters!")
                .max(20, "Must be maximum 20 characters!"),
            lastName: yup
                .string()
                .required("Surname is required!")
                .min(3, "Must be at least 3 characters!")
                .max(20, "Must be maximum 20 characters!"),
            email: yup
                .string()
                .required("Email is required!")
                .email("Email is invalid!")
                .max(50, "Must be maximum 50 characters!"),
            password: yup
                .string()
                .required("Password is required!")
                .min(6, "Must be at least 6 characters!")
                .max(40, "Must be maximum 40 characters!"),
        });
        return {
            successful: false,
            loading: false,
            message: "",
            schema,
            email: '',
            password: '',
            lastName: '',
            firstName: '',
        };
    },
    computed: {
        ...mapGetters(['getCartInfo']),
        ...mapState(['userS', 'users_reviewS', 'curUserId']),
        userFlag() {
          return this.curUserId === -1
        },
        cartinfo() {
            return this.getCartInfo;
        },
        fullName() {
            return this.firstName + " " + this.lastName;
        },
        cnt_bin() {
            let totalCnt = 0;
            for (let item of this.cartinfo) {
                totalCnt += item.cnt;
            }
            return totalCnt;
        },
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    mounted() {
        if (this.loggedIn) {
            this.$router.push("/profile");
        }
    },
    methods: {
        onMouseEnterSend(e) {
          e.target.style.backgroundColor = 'rgb(80, 80, 80)'
        },
        onMouseLeaveSend(e) {
          e.target.style.backgroundColor = 'gray'
        },
        handleRegister() {
          this.loading = true;
          let user1 = this.userS.find((i) => i.email === this.email);
          if (!(typeof user1 == "undefined"))  {
            this.message = 'Такой email уже зарегестрирован';
            this.successful = false;
            this.loading=false;
            return;
          }
          this.$store.commit('doRegistration', {email : this.email,
            first_name : this.firstName,
            last_name : this.lastName,
            password : this.password} )
          this.successful = true;
          this.message = 'Успех';
          this.loading = false;
          this.$router.push({ name: "home" })
        },
        // handleRegister(user) {
        //     this.message = "";
        //     this.successful = false;
        //     this.loading = true;
        //     this.$store.dispatch("auth/register", user).then(
        //         (data) => {
        //             this.message = data.message;
        //             this.successful = true;
        //             this.loading = false;
        //         },
        //         (error) => {
        //             this.message =
        //                 (error.response &&
        //                     error.response.data &&
        //                     error.response.data.message) ||
        //                 error.message ||
        //                 error.toString();
        //             this.successful = false;
        //             this.loading = false;
        //         }
        //     );
        // },
    },
};
</script>

