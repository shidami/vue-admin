import vue from "vue";
import svgIcon from './svg';

vue.component("svg-icon", svgIcon);

const req = require.context("./svg", false, /\.svg$/)
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireAll(req)