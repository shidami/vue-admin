<template>
    <svg :class="svgClass" aria-hidden="true">N
        <use :xlink:href="iconName"></use>
    </svg>
</template>
<script>
import {onMounted, reactive, ref, computed} from "@vue/composition-api";
export default {
    name: "svgIcon",
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
            //validate: (value)=>{return value>=0}
        }
    },
    setup(props){
        //const onplug= computed(()=>{return number.value+1})  number赋值和改变都会被调用
        //const onplug= computed({get:()=>number.value+1, set:()=>val=>{number.value=val+1}})  
        //默认调get，当onplug.value改变时，getset都调
        const iconName = computed(()=>`#icon-${props.iconClass}`);
        const svgClass = computed(()=>{
            if(props.className){
                return `svg-icon ${props.className}`;
            }else{
                return `svg-icon`;
            }
        });

        return {
            iconName,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
.svg-icon{
  width: 20px;
  height: 20px;
  fill: #FFFFFF;
  margin-right: 10px;
}
</style>
