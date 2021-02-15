<template>
    <el-checkbox-group v-model="allData.checkList" @change="change">
        <el-checkbox v-for="item in allData.data" :key="item.role" :label="item.role">{{item.name}}</el-checkbox>
    </el-checkbox-group>
</template>
<script>
import { onBeforeMount, reactive, watch, computed} from '@vue/composition-api'
export default {
    name: "checkbox_com",
    props:{
        config:{
            type:Object,
            default:()=>{}
        },
        allRoles:{
            type:Array,
            default:()=>[]
        }
    },
    setup(props, {root,emit}){
        const allData = reactive({
            //显示列出的项
            data: [],
            //哪些是选中的项
            checkList: []
        })
        allData.checkList = props.config.checkList;
        //根据传进的值筛选出真正要挂的项
        const hangData = ()=>{
            let propBox = props.config.allCheckBox;
            if(propBox&&propBox.length>0){
                allData.data.forEach((item,index)=>{
                    if(!propBox.includes(item.role)){
                        allData.data.splice(index,1)
                    }
                })
            }
        }
        watch(()=>[props.allRoles,props.config.checkList], ([n1,n2])=>{
            allData.data = n1;
            allData.checkList = n2;
        })
        watch(()=>props.config.allCheckBox,()=>{
            hangData()
        })
        onBeforeMount(()=>{
            hangData()
        })
        const change = ()=>{
            emit("change", allData.checkList)
        }
        return{
            allData,change
        }
    }
}
</script>
<style lang="scss" scoped>

</style>