import { reactive, toRefs} from '@vue/composition-api'
import {getDiaRole, getProvinceDistrict,userActive,userEdit,addUser,userDelete,getSysPerm} from '@/api/infoUsers'
export function allUsersData(root){
    const totalData = reactive({
        allRoles:[],
        allProvinces:[],
        allcities:[],
        allareas:[],
        allstreets:[],
        addUserLoading:false,
        activeIsAllowed:true
    })
    
    const addOrEditUserbtn = (func,req)=>{
        totalData.addUserLoading = true;
        func(req).then(response=>{
            root.$message.success(`${response.data.message}`);
            totalData.addUserLoading = false;
            root.$store.dispatch("Users/tableLoadData",{
                data: {
                  pageNumber:root.$store.state.Users.currentPage,
                  pageSize:root.$store.state.Users.pageSize
                }
            });
            sessionStorage.setItem(req.username,req.role)
        }).catch(error=>{
            root.$message.error(`${error.data.message}`);
            totalData.addUserLoading = false;
        })
    }
    const getRole = ()=>{
        getSysPerm().then(response=>{
            totalData.allRoles = response.data.data
        }).catch(error=>{
            root.$message.error('加载角色失败！')
        })
    }
    const activeChg = (req)=>{
        if(!totalData.activeIsAllowed){
            return false;
        }
        totalData.activeIsAllowed = false;
        userActive(req).then(response=>{
            root.$message.success(`${response.data.message}`);
            totalData.activeIsAllowed = true;
        }).then(error=>{
            totalData.activeIsAllowed = true;
        })
    }
    const getPlace = (reqData) =>{
        return new Promise((resolve, reject)=>{
            getProvinceDistrict(reqData).then(response=>{
                // console.log(response.data.data.data)
                let resData = response.data.data.data;
                if(reqData.type == 'province'){
                    totalData.allProvinces = resData.map(item=>{
                        return {id:item.PROVINCE_CODE,value:item.PROVINCE_NAME}
                    })
                    resolve(totalData.allProvinces);
                }
                if(reqData.type == 'city'){
                    totalData.allcities = resData.map(item=>{
                        return {id:item.CITY_CODE,value:item.CITY_NAME}
                    })
                    resolve(totalData.allcities);
                }
                if(reqData.type == 'area'){
                    totalData.allareas = resData.map(item=>{
                        return {id:item.AREA_CODE,value:item.AREA_NAME}
                    })
                    resolve(totalData.allareas);
                }
                if(reqData.type == 'street'){
                    totalData.allstreets = resData.map(item=>{
                        return {id:item.STREET_CODE,value:item.STREET_NAME}
                    })
                    resolve(totalData.allstreets);
                }
            }).catch(error=>{
                root.$message.error('获取地区失败！')
                reject()
            })        
        })
    }
    
    const delOneOrAll = (req)=>{
        userDelete(req).then(response=>{
            root.$message.success(`${response.data.message}`);
            root.$store.dispatch("Users/tableLoadData",{
                data: {
                  pageNumber:root.$store.state.Users.currentPage,
                  pageSize:root.$store.state.Users.pageSize
                }
            });
        }).catch(error=>{
            root.$message.error('删除信息失败！')
        })
    }
    return {
        getRole,...toRefs(totalData),getPlace,addOrEditUserbtn,activeChg,delOneOrAll
    }
}