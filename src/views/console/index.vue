<template>
  <div id="console" :class="{'strech': isCollapse}">
    <navi></navi>
    <top></top>
    <contentblock></contentblock>
  </div>
</template>

<script>
import {onMounted, reactive, ref,computed} from "@vue/composition-api";
import navi from "./components/nav";
import top from "./components/top";
import contentblock from "./components/content";
export default {
    name: "console",
    components: {contentblock, top, navi},
    setup(props, {root}){
        const isCollapse = computed(() => root.$store.state.nav.isCollapse);

        return{
            isCollapse
        }
    }
}
</script>
      
<style lang="scss" scoped>
   

</style>