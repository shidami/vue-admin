export default {
    state: {
        userName: sessionStorage.getItem('username')||''
    },
    getters: { 

    },
    mutations: {    
      loginUserName(state,username){
        state.userName = username;
      }
    },
    actions: {    

    }
}