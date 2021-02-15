<template>
  <div id="content">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
export default {
    name: "contentblock",
    setup(props, context){

    }
}
</script>>
      
<style lang="scss" scoped>
#content{
  position: fixed;
  top:80px;
  left: $navWidth;
  right: 0;
  bottom: 0;
  background-color: #fff;
  box-sizing: border-box;
  border: solid 15px rgb(247, 247, 243);
  padding: 20px;
  @include webkit(transition, all .3s ease);
  overflow: auto;
}
.strech>#content{
  left: $strechWidth;
}
</style>