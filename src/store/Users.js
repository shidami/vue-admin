import {getTableInfos} from '@/api/infoUsers'
import { Message} from 'element-ui';

export default {
    namespaced: true,
    state: {
        pageSize:NaN,
        currentPage:NaN,
        tableLoading:false,
        totalRows:NaN,
        tableRows:[]
    },
    getters: {

    },
    mutations: {

    },
    actions: {
        tableLoadData({state},reqDa){
            return new Promise((resolve,reject)=>{
                state.tableLoading = true;
                getTableInfos(reqDa).then(response=>{
                    // console.log(response)
                    state.tableRows = response.data.data.data;
                    state.totalRows = response.data.data.total;
                    // console.log(state.totalRows)
                    Message.success('列表加载成功！');
                    state.tableLoading = false;
                    resolve();
                }).catch(error=>{
                    Message.error('列表加载失败！');
                    state.tableLoading = false;
                    reject();
                })
            })
        },
    }
}