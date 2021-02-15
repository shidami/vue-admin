<template>
    <el-table :data="tableRows.items" style="width: 100%" v-loading="tableLoading" @selection-change="selChg">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <template v-for="item in tableConfig.columes">
            <el-table-column align="center" v-if="item.slotType" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
                <template slot-scope="scope">
                    <slot :name="item.slotType" :data="scope.row"></slot>
                </template>
            </el-table-column>
            <el-table-column align="center" v-else :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
            </el-table-column>
        </template>    
    </el-table>
</template>
<script>
import { computed, onBeforeMount,reactive, ref,watch} from '@vue/composition-api'
export default {
    name:"table_com",
    props:{
        tableConfig:{
            type:Object,
            default:()=>{}
        }
    },
    setup(props, {root,emit}){
        const tableLoading = computed(()=>root.$store.state.Users.tableLoading);
        const tableRows = reactive({
            items:[]
        });
        watch(()=>root.$store.state.Users.tableRows,(n1)=>{
            if(n1&&n1.length>0){
               n1.forEach(item=>{
                   item.role = JSON.parse(item.role).join(',')
               })
            }
            tableRows.items = n1;
        })
        // const tableData = reactive({
            // items:[{
                // email: "2960793237@qq.com",
                // name: "shimin",
                // phone: "17673774203",
                // region: "guangdong zhuhai",
                // role: "manager"
            // },{
                // email: "2960793237@qq.com",
                // name: "shimin",
                // phone: "17673774203",
                // region: "guangdong zhuhai",
                // role: "manager" 
            // }]
        // })
        onBeforeMount(()=>{
            root.$store.dispatch("Users/tableLoadData",props.tableConfig.requestData)
        })
        const selChg = (val)=>{
            const delData = val.map(item=>Number(item.id));
            emit("allSeleteData",delData)
        }
        return{
            tableRows,tableLoading,selChg
        }
    }
}
</script>
<style lang="scss" scoped>

</style>