
export default {
    updateRole(state, payload) {
        const {userId} = payload;
        let curRole = state.userS.find((i) => i.id === userId).role;
        state.curUserRole = curRole === "ROLE_ADMIN"
    },
    doRegistration(state, payload) {
        const {email, first_name, last_name, password} = payload;
        const maxId = state.userS.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
        let newUser = {
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: password,
            role: "ROLE_USER",
            id: maxId + 1
        }
        state.userS.push(newUser)
        this.commit('doLogin', { userId : maxId + 1});
    },
    doLogin(state, payload) {
        const {userId} = payload;
        state.curUserId = userId;
        this.commit('updateRole', {userId});
    },
    doLogout(state) {
        state.curUserId = -1;
        state.curUserRole = false;
    }
}