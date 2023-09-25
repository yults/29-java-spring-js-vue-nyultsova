export default {
    /**
     * @description Доавить значение характеристики товару
     *
     * @param payload.productIdAdd - id товара к которому добавляется свойство
     * @param payload.childIdAdd - id значения характеристики
     *
     * Проверка на то есть ли уже это значение у товара и если еще нет то добавление связки
     */
    addPropertyByPropertyModal(state, payload) {
        const {productIdAdd, childIdAdd} = payload;
        if (state.product_propertyS.find((obj) => obj.product_id === productIdAdd
            && obj.property_id === childIdAdd)) return
        const maxId = state.product_propertyS.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
        let newProperty = {
            id: maxId + 1,
            product_id: productIdAdd,
            property_id: childIdAdd,
        };
        state.product_propertyS.push(newProperty);
    },

    /**
     * @description Добавление характеристики/значения характеристики в список характеристик
     *
     * @param payload.parentIdAdd - id характеристики для значений / null для характеристик
     * @param payload.nameAdd - имя характеристики
     */
    addPropertyByPropertyComponent(state, payload) {
        const {parentIdAdd, nameAdd} = payload;
        const maxId = state.propertyS.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
        let newProperty = {
            id: maxId + 1,
            parentId: parentIdAdd,
            name: nameAdd,
        };
        state.propertyS.push(newProperty);
    },

    /**
     * @description Удаление у товара значение характеристики
     *
     * @param payload.productId - id товара
     * @param payload.propertyId - id значения характеристики
     *
     * Удаление связки между товаром и значением характеристики
     */
    deletePropertyByPropertyModal(state, payload) {
        const {productId, propertyId} = payload;
        const indexToDelete = state.product_propertyS.findIndex(obj => obj.property_id === propertyId && obj.product_id === productId);
        if (indexToDelete !== -1) {
            state.product_propertyS.splice(indexToDelete, 1);
        }
    },

    /**
     * @description Удалить характеристику или значение характеристики из списка характеристик и у всех продуктов
     *
     * @param payload.childId - id характеристики/значения характеристики
     */
    deletePropertyByPropertyComponent(state, payload) {
        const {childId} = payload;
        /** Записываем индексы которые впоследствии надо будет удалить из связок с товарами */
        let idsToDelete = [];

        /** Удаление характеристики / значения характеристики */
        const indexToDelete = state.propertyS.findIndex(obj => obj.id === parseInt(childId));
        if (indexToDelete !== -1) {
            state.propertyS.splice(indexToDelete, 1);
        }

        /** Удаление значений характеристики если удаляется характеристика, иначе ничего не происходит */
        while (state.propertyS.find(obj => obj.parentId === parseInt(childId))) {
            idsToDelete.push(state.propertyS.find(obj => obj.parentId === parseInt(childId)).id)
            let indexToDelete1 = state.propertyS.findIndex(obj => obj.parentId === parseInt(childId));
            if (indexToDelete1 !== -1) {
                state.propertyS.splice(indexToDelete1, 1);
            }
        }

        /** Удаление связок с товаров с удаленными значениями характеристами */
        for (let id_child of idsToDelete) {
            while (state.product_propertyS.find(obj => obj.property_id === parseInt(id_child))) {
                let productId = state.product_propertyS.find(obj => obj.property_id === parseInt(id_child)).product_id;
                const indexToDelete2 = state.product_propertyS.findIndex(obj => obj.product_id === productId);
                if (indexToDelete2 !== -1) {
                    state.product_propertyS.splice(indexToDelete2, 1);
                }
            }
        }
    },
}