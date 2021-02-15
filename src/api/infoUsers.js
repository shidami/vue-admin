import service from "@/utils/request";

//获取列表信息
export function getTableInfos(data){
    return service.request({
        method: data.method||'post',
        url: data.url||'/user/getList/',
        data: data.data||{}
    });
}

//获取角色
export function getDiaRole(data){
    return service.request({
        method: 'post',
        url: '/role/',
        data
    });
}

//用户角色
export function userRole(data){
    return service.request({
        method: 'post',
        url: '/userRole/',
        data
    });
}

//获得省市区
export function getProvinceDistrict(data){
    return service.request({
        method: 'post',
        url: '/cityPicker/',
        data
    });
}

//添加用户
export function addUser(data){
    return service.request({
        method: 'post',
        url: '/user/add/',
        data
    });
}

//用户禁启用
export function userActive(data){
    return service.request({
        method: 'post',
        url: '/user/actives/',
        data
    });
}

//用户编辑
export function userEdit(data){
    return service.request({
        method: 'post',
        url: '/user/edit/',
        data
    });
}

//用户删除
export function userDelete(data){
    return service.request({
        method: 'post',
        url: '/user/delete/',
        data
    });
}

//获取按钮权限
export function getBtnPerm(data){
    return service.request({
        method: 'post',
        url: '/permButton/',
        data
    });
}

//获取系统权限
export function getSysPerm(data){
    return service.request({
        method: 'post',
        url: '/system/',
        data
    });
}