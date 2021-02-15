<template>
  <div id="top">
    <div class="move_left icon_left" @click="toggleCollapse"><svg-icon iconClass="menu" className="menu top_icon"></svg-icon></div>
    <div class="move_right all_info">
      <div class="manager_info move_left">
        <svg-icon iconClass="manager" className="manager top_icon"></svg-icon>
        <h3 class="move_right">{{userName}}</h3>
      </div>
      <div class="icon_right move_right" @click="exit"><svg-icon iconClass="start" className="start top_icon"></svg-icon></div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref,computed} from "@vue/composition-api";
export default {
    name: "top",
    setup(props, {root}){
      const toggleCollapse = () =>{
        root.$store.commit('setCollapse')
      };
      const userName = computed(()=>root.$store.state.top.userName);
      const exit = ()=>{
        root.$router.push({
          path:'/login'
        })
      }
      return{
        toggleCollapse,
        userName,
        exit
      }
    }
}
</script>>
      
<style lang="scss" scoped>
#top{
  position:fixed;
  top: 0;
  left: $navWidth;
  right: 0;
  height: $height;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px 0 #40414048;
  box-sizing: border-box;
  @include webkit(transition, all .3s ease);
}
.icon_left{
  margin: 17px 0 18px 30px;
  cursor: pointer;
  >.menu{
    margin-right: 0;
  }
}
.all_info{
  height: $height;
  >.manager_info{
    margin-right: 100px;
    >.manager{
      margin: 17px 15px 18px 0;

    }
    >h3{
      line-height: $height;
      margin: auto ;
    }
  }
  >.icon_right{
    margin: 17px 30px 18px 0;
    cursor: pointer;
    svg{
      fill: $red;
      margin-right: 0;
    }
  }
}
.strech>#top{
  left: $strechWidth;
}
</style>