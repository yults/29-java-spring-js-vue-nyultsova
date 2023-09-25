import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";



// import globalMethods from '@/js/globalMethods.js';

/*BOOTSTRAP FONT----------*/
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import '@fortawesome/fontawesome-free/css/all.css'

/*MAIN--------------------*/
import '@/assets/css/main.css';
import '@/assets/css/media.css';

/*BASE-ELEMENTS-----------*/
import '@/assets/css/base-elements/rating.css';
import '@/assets/css/base-elements/slider.css';
import '@/assets/css/base-elements/checkbox.css';

/*CARDS-------------------*/
import '@/assets/css/cards/catalog-card.css';
import '@/assets/css/cards/cart-card.css';
import '@/assets/css/cards/review-card.css';

/*MODAL-------------------*/
import '@/assets/css/modal/category.css';
import '@/assets/css/modal/filter.css';
import '@/assets/css/modal/review-modal.css';
import '@/assets/css/modal/property.css';

/*PAGES-------------------*/
import '@/assets/css/pages/cart.css';
import '@/assets/css/pages/login.css';
import '@/assets/css/pages/home.css';
import '@/assets/css/pages/register.css';
import '@/assets/css/pages/admin.css';
import '@/assets/css/pages/product-review.css';

const app = createApp(App)
    .use(router)
    .use(store)
    .component("font-awesome-icon", FontAwesomeIcon);

// app.config.globalProperties.$methods = globalMethods;

app.mount('#app');