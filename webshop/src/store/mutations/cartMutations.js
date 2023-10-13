export default {
    /**
     * @description Добавление товара в корзину
     *
     * @param id - id товара из каталога
     *
     * Довешано поле cart_check для контроля чекбокса и сохранения его состояния
     * при переключении между страницами
     */
    addToCart(state, id) {
        let item = state.info.find(i => i.id === id);
        let cartItem = {
            name: item.name,
            description: item.description,
            avail: item.avail,
            quantity: item.quantity,
            id: item.id,
            price: item.price,
            image: item.image,
            cnt: 1,
            cart_check: true,
        };
        state.cartinfo.push(cartItem);
        item.cnt++;
    },

    /**
     * @description Изменение количества товара в корзине
     *
     * @param payload.id - id товара количество в корзине которого меняется
     * @param payload.newCnt - новое значение количества товара в корзине
     *
     * Изменения отображаются в плашке каталога
     */
    updateCartItemCnt(state, payload) {
        const { id, newCnt } = payload;
        let item = state.info.find(i => i.id === id);
        /** Проверка остатков */
        if (state.cartinfo.find(i => i.id === id) && (item.quantity - item.cnt > 0 || item.cnt > newCnt)) {
            state.cartinfo.find(i => i.id === id).cnt = newCnt;
            item.cnt = newCnt;
        }
    },

    /**
     * @description Снять или повесть чекбокс и сделать запись в базе
     *
     * @param payload.id - id изменяемого товара
     * @param payload.newCnt {boolean} - новое значение чексбокса
     */
    updateCartCheck(state, payload) {
        const { id, check } = payload;
        state.cartinfo.find(i => i.id === id).cart_check = check;
    },

    /**
     * @description Удалить товар из корзины
     *
     * @param payload.id - id удаляемого товара
     */
    removeCartItem(state, payload) {
        const { id } = payload;
        let item = state.info.find(i => i.id === id);
        item.cnt = 0;
        let indexToDelete = state.cartinfo.findIndex(i => i.id === item.id);
        if (indexToDelete !== -1) {
            state.cartinfo.splice(indexToDelete, 1);
        }
    },
}