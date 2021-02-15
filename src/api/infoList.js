import service from "@/utils/request";

//获取信息列表
export function infoList(data){
    return service.request({
        method: 'post',
        url: '/news/getList/',
        data
    });
};

//添加信息
export function addInfo(data){
    return service.request({
        method: 'post',
        url: '/news/add/',
        data
    });
};

//修改信息
export function editInfo(data){
    return service.request({
        method: 'post',
        url: '/news/editInfo/',
        data
    });
};

//删除信息
export function deleteInformation(data){
    return service.request({
        method: 'post',
        url: '/news/deleteInfo/',
        data
    });
};