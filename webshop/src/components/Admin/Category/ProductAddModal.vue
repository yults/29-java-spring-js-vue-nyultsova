<template>
  <div class="admin-modal">
    <div class="admin-modal__overlay"></div>
    <div class="admin-modal__container">
     <Form @submit="addProduct"
           :validation-schema="schema"
           class="admin__inputs_option">
       <div class="review-modal__header">
         <h3>
           Карточка нового товара
         </h3>
         <button class="review-modal__button_close"
                 @click.prevent="closeModal">
           X
         </button>
       </div>
       <div class="admin_name_input" >
         Заголовок:
       </div>
       <Field name="product_title"
              type="text"
              v-model="name"
              class="form-control">
       </Field>
       <div class="admin__inputs_short">
         <div>
           <div class="admin_price_input">
             Цена:
           </div>
           <Field pattern="[0-9]+"
                  name="product_price"
                  step="1000"
                  type="number"
                  v-model="price"
                  class="form-control">
           </Field>
         </div>
         <div>
           <div class="admin_price_sale_input">
             Цена со скидкой:
           </div>
           <Field pattern="[0-9]*"
                  name="product_price_sale"
                  step="1000"
                  type="number"
                  v-model="price_sale"
                  class="form-control">
           </Field>
         </div>
         <div>
           <div class="admin_quantity_input">
             Количество:
           </div>
           <Field pattern="[0-9]+"
                  name="product_quantity"
                  step="10"
                  type="number"
                  v-model="quantity"
                  class="form-control">
           </Field>
         </div>
       </div>
       <Field name="product_description"
              type="text"
              class="admin_description_input">
         Описание:
       </Field>
       <textarea rows="10"
                 type="text"
                 v-model="description"
                 class="form-control my-textarea">
          </textarea>
       <div class="form-group">
         <label class="admin_image_input">
           Изображения продукта:
         </label>
         <input type="file"
                id="image"
                @change="onImageChange" multiple>
       </div>
       <div>Загружено {{ imageCnt }} изображений</div>
       <button class="btn btn-success btn-lg">
         Добавить товар
       </button>
       <div class="form-group">
         <div v-if="message"
              class="alert alert-danger"
              role="alert">
           {{ message }}
         </div>
       </div>
       <div class="error_messages">
         <div><ErrorMessage name="product_title" class="error-feedback" /></div>
         <div><ErrorMessage name="product_price" class="error-feedback" /></div>
         <div><ErrorMessage name="product_price_sale" class="error-feedback" /></div>
         <div><ErrorMessage name="product_quantity" class="error-feedback" /></div>
       </div>
     </Form>
   </div>
 </div>
</template>

<script>
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from "yup";
import {mapGetters, mapState} from "vuex";
export default {
  components: {
    ErrorMessage, Field, Form,
  },
  data() {
    /** Схема валидации */
    const schema = yup.object().shape({
      product_title: yup
          .string()
          .required("Name is required!")
          .min(3, "Must be at least 3 characters!")
          .max(20, "Must be maximum 255 characters!"),
      product_price: yup
          .number()
          .required("Price is required!")
          .min(9, "Price alert: It's too cheap and not profitable to sell")
          .max(1000000000, "Price alert: It's too expensive, no one has that kind of money"),
      product_price_sale: yup
          .number()
          .max(1000000000, "Sale price alert: It's too expensive, no one has that kind of money"),
      product_quantity: yup
          .number()
          .required("Quantity is required!")
          // .min(1, "Must be at least 6 characters!")
          .max(100000, "I can't believe there are so many items in stock."),
    });
    return {
      imageCnt: 0,
      loading: false,
      message: "",
      newProductCategoryId: null, /** категория нового товара */
      schema,
      /** поля будущей карточки */
      description: "",
      image: Array,
      name: "",
      price: null,
      price_sale: null,
      quantity: null,
      newPicIds: []
    };
  },
  computed: {
    ...mapGetters(['getInfo']),
    ...mapState(['product_imageS', 'product_image'])
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    addProduct() {
      if (this.newPicIds.length === 0) {
        this.message = "Нужно добавить хотя бы одну картинку";
        return
      }
      this.$store.commit('addProductByAdminPage', {
        categoryId: this.category_id,
        name: this.name,
        description: this.description,
        quantity: this.quantity,
        price: this.price,
        price_sale: this.price_sale,
        images: this.newPicIds
      });
      this.newPicIds = [];
      this.imageCnt = 0;
      this.$emit('close')
    },
    onImageChange(event) {
      this.message = "";
      this.imageCnt++;
      let image_id = this.product_image.length + 2;
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
          this.newPicIds.push(image_id)
          const url = e.target.result;
          this.$store.commit('addImageToProduct', { url, image_id });
          image_id++;
        };

        reader.readAsDataURL(file);
      }
    },
  },
  props: {
    category_id: {
      type: Number,
      required: true
    }
  },
  name: "ProductAddModal",
}
</script>