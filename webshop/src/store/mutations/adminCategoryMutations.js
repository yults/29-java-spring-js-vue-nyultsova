export default {
    /**
     * @description onDrop продукта в другую категорию
     *
     * @param payload.itemId - id товара который перетаскиваем
     * @param payload.categoryId - id категории в которую перетаскивается
     *
     * While для товаров которые находятся в нескольких категориях одовременно,
     * товар удалится из всех старых категорий и останется в единственном экземпляере в новом
     */
    updateCategoryByAdminCategory(state, payload) {
        const {itemId, categoryId} = payload;
        while (state.product_categoryS.find(
            i => i.product_id === itemId
                && !(i.category_id === categoryId))) {
            state.product_categoryS.find(i => i.product_id === itemId
                && !(i.category_id === categoryId)).category_id
                = categoryId;
        }
    },

    /**
     * @description onDrop категории и вложенного в нее в другую категорию
     *
     * @param payload.categoryIdChild - id перетаскиваемой категории
     * @param payload.categoryId - id категории в которую перетаскивается
     */
    updateCategoryCategoryByAdminCategory(state, payload) {
        const {categoryIdChild, categoryId} = payload;
        /** Предотвращение возможности перетащить родительскую категорию в дочернюю и саму в себя */
        if (categoryIdChild === categoryId) return;
        let upByTree = categoryId;
        do {
            upByTree = state.categoryS.find(i => i.id === upByTree).parentId;
            if (upByTree === categoryIdChild) return;
        }
        while (upByTree !== null)

        /** Первешать parentId категории перемешенной id категори перемещения */
        state.categoryS.find(i => i.id === categoryIdChild).parentId = categoryId;
    },

    /**
     * @description Добавить вложенную категорию
     *
     * @param payload.categoryId - id родительской категории для новой категории
     * @param payload.newCat {string} - название новой категории
     */
    addCategoryByAdminCategory(state, payload) {
        const {categoryId, newCat} = payload;
        const maxId = state.categoryS.reduce((max, obj) => obj.id > max ? obj.id : max, 0); //newId
        let newCategory = {
            id: maxId + 1,
            parentId: categoryId,
            name: newCat
        };
        state.categoryS.push(newCategory)
    },

    /**
     * @description Удалить категорию и все вложенное в нее
     *
     * @param categoryId - id удаляемой категории
     */
    deleteCategoryByAdminCategory(state, categoryId) {
        /** Удалить запись в базе категорий*/
        const indexToDelete = state.categoryS.findIndex(obj => obj.id === categoryId);
        if (indexToDelete !== -1) {
            state.categoryS.splice(indexToDelete, 1);
        }
        /**
         * @description Удалить товары из данной категории
         *
         * Сначала удалить из связки товара и категорий запись
         * Если есть еще одна связка (в ситуации если товар лежит в разных категориях), то товар не удалится
         * Если товар больше никакой категории не принадлежит то удалется товар полностью
         */
        while (state.product_categoryS.find(obj => obj.category_id === categoryId)) {
            let productId = state.product_categoryS.find(obj => obj.category_id === categoryId).product_id;
            const indexToDelete2 = state.product_categoryS.findIndex(obj => obj.product_id === productId && obj.category_id === categoryId);
            if (indexToDelete2 !== -1) {
                state.product_categoryS.splice(indexToDelete2, 1);
            }
            if (!state.product_categoryS.find(obj => obj.product_id === productId)) {
                this.commit('deleteProductByAdminCategory', productId);
            }
        }
        /** Рекурсивное удаление вложенных категорий */
        while (state.categoryS.find(obj => obj.parentId === categoryId)) {
            let categoryIdChild = state.categoryS.find(obj => obj.parentId === categoryId).id;
            this.commit('deleteCategoryByAdminCategory', categoryIdChild);
        }
    },

    /**
     * @description Удалить товар из базы
     *
     * @param productId - id товара
     *
     * Удаление из каталога, корзины, связки с категориями, отзывы на них и связки с характеристиками
     */
    deleteProductByAdminCategory(state, productId) {
        const indexToDelete = state.info.findIndex(obj => obj.id === productId);
        if (indexToDelete !== -1) {
            state.info.splice(indexToDelete, 1);
        }
        const indexToDelete1 = state.cartinfo.findIndex(obj => obj.id === productId);
        if (indexToDelete1 !== -1) {
            state.cartinfo.splice(indexToDelete1, 1);
        }
        const indexToDelete2 = state.product_categoryS.findIndex(obj => obj.product_id === productId);
        if (indexToDelete2 !== -1) {
            state.product_categoryS.splice(indexToDelete2, 1);
        }
        while (state.product_imageS.findIndex(obj => obj.product_id === productId) !== -1) {
            let indexToDelete3 = state.product_imageS.findIndex(obj => obj.product_id === productId);
            state.product_imageS.splice(indexToDelete3, 1);
        }
        while (state.reviewS.findIndex(obj => obj.product_id === productId) !== -1) {
            let indexToDelete3 = state.reviewS.find(obj => obj.product_id === productId).review_id;
            this.commit('deleteReview', indexToDelete3);
        }
        while (state.product_propertyS.findIndex(obj => obj.product_id === productId) !== -1) {
            let indexToDelete4 = state.product_propertyS.findIndex(obj => obj.product_id === productId);
            state.product_propertyS.splice(indexToDelete4, 1);
        }
        while (state.priceS_sale.findIndex(obj => obj.product_id === productId) !== -1) {
            let indexToDelete5 = state.priceS_sale.findIndex(obj => obj.product_id === productId);
            state.priceS_sale.splice(indexToDelete5, 1);
        }
    },

    /**
     * @description Добавление нового товара
     *
     * @param payload -поля будущего товара и его категория
     *
     * Добавление записи-связки товара и категории
     * Добавление в каталог
     */
    addProductByAdminPage(state, payload) {
        const {categoryId, name, description, quantity, price, price_sale, images} = payload;
        const maxId = state.info.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
        let newCategory = {
            id: maxId + 1,
            product_id: maxId + 1,
            category_id: categoryId
        };
        state.product_categoryS.push(newCategory);
        let item = {
            name: name,
            description: description,
            avail: quantity === 0 ? "Нет в наличии" : quantity < 6 ? "Мало" : "В наличии",
            quantity: quantity,
            id: maxId + 1,
            price: price,
            cnt: 0,
        };
        state.info.push(item);
        for (let img of images)
        {
            let newProductImages = {
                product_id: maxId + 1,
                images_id: img
            };
            state.product_imageS.push(newProductImages);
        }
        if (price_sale.length > 0) {
            let price_sale_el = {
                id: maxId + 1,
                product_id: maxId + 1,
                price_sale: price_sale
            }
            state.priceS_sale.push(price_sale_el)
        }
    },
    addImageToProduct(state, payload) {
        const {url, image_id} = payload;
        let newProductImage = {
            id: image_id,
            url: url
        };
        state.product_image.push(newProductImage);
    }
}