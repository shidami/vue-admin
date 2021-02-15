<template>
    <el-select v-model="allOptions.selectValue" clearable placeholder="请选择" @change="change">
      <el-option
        v-for="item in allOptions.data"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
</template>
<script>
import { computed, onBeforeMount, reactive, watch} from '@vue/composition-api'
export default{
    name: 'ComSelect',
    props:{
        options:{
            type: Array,
            default: ()=>[]
        },
        value:{
            type: String,
            default: ''
        }

    },
    setup(props, {root,emit}){
        const allOptions = reactive({
            data: [],
            selectValue: ""
        })
        if(props.options.length>0){
            allOptions.data = props.options;
        }
        if(props.value){
            allOptions.selectValue = props.value;
        }
        watch(()=>[props.options,props.value], ([newV1,newV2])=>{
            allOptions.data = newV1;
            allOptions.selectValue = newV2;
        })
        const change = () =>{
            emit('update:value', allOptions.selectValue)
        }
        return{
            allOptions,change
        }
    },
}
</script>
<style lang="scss" lang="stylus">

</style>