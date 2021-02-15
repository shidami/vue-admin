import router from './index';
import store from '../store/index'

const whiteRoute = ['/login']
//需要在main.js全局引入
router.beforeEach((to,from,next)=>{
    if(sessionStorage.getItem('token')){
        if(to.path=='/login'){
            sessionStorage.setItem('token','');
            sessionStorage.setItem('username','');
            store.state.dynRoute.allRoutes.length = 0;
            store.state.dynRoute.addRoutes.length = 0;
            next();
        }else{
            //动态路由
            if(store.state.dynRoute.allRoutes.length==0){
                store.dispatch("dynRoute/getAllRoutes").then(allR=>{
                    //添加动态路由
                    if(store.state.dynRoute.addRoutes.length!=0){
                        router.options.routes = allR;
                        router.addRoutes(store.state.dynRoute.addRoutes)
                        next({...to,replace:true})
                    }else{
                        next()
                    }
                })
            }else{
                next();
            }
        }
    }else{
        if(whiteRoute.indexOf(to.path)>-1){
            next();
        }else{
            next('/login');
        }
    }
});