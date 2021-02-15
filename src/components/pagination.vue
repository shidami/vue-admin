<template>
    <el-pagination
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
        @prev-click="tableCurrentData" @next-click="tableCurrentData"
        :current-page.sync="vModel.currentPage" :page-size.sync="vModel.pageSize" 
        :page-sizes="config.pageSizes" :layout="config.layout" :total="config.total">
    </el-pagination>
</template>
<script>
import {allUsersData} from '@/utils/allUsersData'
import { computed, onBeforeMount, reactive, watch} from '@vue/composition-api'
export default {
    name:"pagination_com",
    props: {
        config: {
            type: Object,
            default: ()=>{}
        }
    },
    setup(props, {emit,root}){
        const {tableLoadData} = allUsersData(root)
        const vModel = reactive({
            pageSize:NaN,
            currentPage:NaN
        })
        vModel.pageSize = props.config.pageSize;
        vModel.currentPage = props.config.currentPage;
        const tableCurrentData = ()=>{
            root.$store.dispatch("Users/tableLoadData",{
              data: {pageNumber:vModel.currentPage,pageSize:vModel.pageSize}
            });
        }
        const handleCurrentChange =()=>{
            root.$store.state.Users.currentPage = vModel.currentPage;
            tableCurrentData();
        }
        const handleSizeChange = ()=>{
            root.$store.state.Users.pageSize = vModel.pageSize;
            tableCurrentData();
        }
        return{
            handleCurrentChange,handleSizeChange,vModel,tableCurrentData
        }
    }
}
</script>
<style lang="scss" scoped>

</style>