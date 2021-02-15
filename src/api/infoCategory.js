import service from "@/utils/request";

//添加一级分类
export function addFirstClass(data){
    return service.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data
    });
}

//删除一级/二级分类
export function deleteClass(data){
    return service.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data
    });
}

//编辑一级/二级分类
export function editClass(data){
    return service.request({
        method: 'post',
        url: '/news/editCategory/',
        data
    });
}

//添加二级分类
export function addSecondClass(data){
    return service.request({
        method: 'post',
        url: '/news/addChildrenCategory/',
        data
    });
}

//获取一级加二级信息分类
export function secondClass(data){
    return service.request({
        method: 'post',
        url: '/news/getCategoryAll/',
        data
    });
};

//获取一级信息分类
export function firstClass(data){
    return service.request({
        method: 'post',
        url: '/news/getCategory/',
        data
    });
};
