export default {
    state: {
        isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false 
    },
    getters: { 
        isCollapse: state => state.isCollapse
    },
    mutations: {     //commit
        setCollapse(state){
          state.isCollapse = !state.isCollapse;
          sessionStorage.setItem('isCollapse', state.isCollapse)
        }
    },
    actions: {    //dispatch

    }
}