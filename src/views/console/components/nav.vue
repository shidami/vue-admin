<template>
  <div id="nav">
    <img src="../../../assets/logo.png">
    <el-menu class="el-menu-vertical-demo" :router="true" :collapse="isCollapse">
      <template v-for="(item,index) in routers">
        <el-submenu :index="index.toString()" :key="item.id" v-if="!item.hidden">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
            <span>{{item.meta.name}}</span>
          </template>
          <el-menu-item :index="item.path" v-for="(item) in item.children" :key="item.id">{{item.meta.name}}</el-menu-item>
        </el-submenu>
      </template>              
    </el-menu>
  </div>
</template>

<script>
import {onMounted, reactive, ref,computed} from "@vue/composition-api";
export default {
    name: "navi",
    setup(props, {root}){
      const isCollapse = computed(() => root.$store.state.nav.isCollapse);
      const routers = reactive(root.$router.options.routes);
      return {
        routers,
        isCollapse
      }
    }
}
</script>
      
<style lang="scss" scoped>
// @import '../../../styles/config.scss';
#nav{
    position:fixed;
    top:0;
    left:0;
    width:$navWidth;
    height: 100vh;
    background-color: #344A5F;
    @include webkit(transition, all .3s ease);
    >img{
      width: 150px;
      height: 150px;
      margin: 20px 50px;
      display: inline-block;
      @include webkit(transition, all .3s ease);
    }
}
.strech>#nav{
  width: $strechWidth;
  >img{
    width: 55px;
    height: 55px;
    margin: 10px 5px;
    display: inline-block;
  }
}

</style>