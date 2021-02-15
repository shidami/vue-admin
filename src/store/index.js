import Vue from "vue";
import Vuex from "vuex";
import top from "./top";
import nav from "./nav";
import info from "./info";
import Users from "./Users";
import dynRoute from "./dynRoute";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    top,
    nav,
    info,
    Users,
    dynRoute
  }
});
