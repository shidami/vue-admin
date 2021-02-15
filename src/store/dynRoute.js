import {addRoutes,defaultRoutes} from '../router/index';
import store from './index'

export default {
    namespaced: true,
    state:{
        allRoutes: [],
        addRoutes: []
    },
    getter:{},
    mutations:{},
    actions:{
        getAllRoutes({state}){
            return new Promise((resolve,reject)=>{
                let logUser = store.state.top.userName;
                //登录页面跳转之前获取该账户系统
                let sys = []
                if(sessionStorage.getItem(logUser)){
                    sys = JSON.parse(sessionStorage.getItem(logUser));
                }
                let allRoutes, actualAddRoutes;
                if(sys.length==0||!sys[0]){
                    allRoutes = defaultRoutes;
                }else{
                    //实际添加的路由
                    actualAddRoutes = addRoutes.filter((item,index)=>{
                        if(index<addRoutes.length-1){
                            return sys.indexOf(item.meta.system)>-1
                        }
                    })
                    actualAddRoutes.push(addRoutes[addRoutes.length-1]);
                    allRoutes = defaultRoutes.concat(actualAddRoutes);
                    state.addRoutes = actualAddRoutes;
                }                                   
                state.allRoutes = allRoutes;
                resolve(allRoutes)
            })
        }
    }
}