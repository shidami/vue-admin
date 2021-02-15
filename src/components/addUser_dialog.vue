<template>
    <el-dialog :title="formData.id?'编辑':'新增'" :visible.sync="allData.dialogFormVisible" 
    :modal-append-to-body="false" class="addUser_dialog" @close="close" @open="open">
      <el-form :model="allData.form" :rules="allData.rules" ref="bigForm" label-width="88px" status-icon>
        <el-form-item label="用户名：" for="user-name" prop="userName">
          <el-input id="user-name" v-model="allData.form.userName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码：" for="pass-word" prop="passWord">
          <el-input id="pass-word" v-model="allData.form.passWord" type="password" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" for="label-name" prop="name">
          <el-input id="label-name" v-model="allData.form.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" for="label-phone" prop="phone">
          <el-input id="label-phone" v-model="allData.form.phone" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="地区：">
            <comSelect v-for="item in allData.regionOptions" :key="item.key" :options="item.option" :value.sync="item.value"
            style="margin-right:2.5%;height:40px;width:22%"/>
        </el-form-item>
        <el-form-item label="是否启用：">
            <el-radio v-model="allData.radio" label="1">禁用</el-radio>
            <el-radio v-model="allData.radio" label="2">启用</el-radio>
        </el-form-item>
        <el-form-item label="权限系统：">
          <comCheckbox :config="checkBoxConfig" :allRoles="allRoles" @change="boxChange"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="allData.dialogFormVisible = false" style="width:30%;margin-right:20px">取 消</el-button>
        <el-button type="danger" @click="submitForm" style="width:30%" :loading="addUserLoading">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import {userEdit,addUser,userRole} from '@/api/infoUsers'
import {stripscript, testUsername} from "@/utils/validate";
import {allUsersData} from '@/utils/allUsersData'
import comCheckbox from '@/components/checkbox'
import { reactive, watch } from '@vue/composition-api'
import comSelect from './select.vue'
export default {
    components: { comSelect, comCheckbox},
    name:'addUser_dialog',
    props:{
        isShow:{
            type: Boolean,
            default: false
        },
        //判断新增还是编辑，编辑有数据进来
        formData:{
          type: Object,
          default: ()=>{}
        }
    },
    setup(props, {root,emit,refs}){
        let checkUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'));
            } else if (!testUsername(value)) {
                callback(new Error('您输入的用户名有误'));
            } else { 
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            allData.form.passWord = stripscript(value);
            value = allData.form.passWord;
            let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
            if (value === '') {
                if(props.formData.id){
                  callback();
                }
                callback(new Error('请输入密码'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入数字加密码6至20位'));
            } else {    
                callback();
            }
        };
        const {getRole, allRoles, getPlace, allProvinces, addOrEditUserbtn,addUserLoading}= allUsersData(root);
        const checkBoxConfig = reactive({
          //哪些是选中的项,默认[]都不选
          checkList: ['infoSystem'],
          //显示列出的项
          allCheckBox: ['infoSystem','userSystem']
        });
        const allData = reactive({
            regionOptions:[{
              key:"province",
              option:[],
              value:''
            },{
              key:"city",
              option:[],
              value:''
            },{
              key:"area",
              option:[],
              value:''
            },{
              key:"street",
              option:[],
              value:''
            }],
            radio: '1',
            dialogFormVisible: false,
            form:{
                userName:'',
                passWord:'',
                name:'',
                phone:''
            },
            rules:{
              userName: [
                { validator: checkUsername, trigger: 'blur' }
              ],
              passWord: [
                { validator: validatePass, trigger: 'blur' }
              ],
              name: [
                { required: true, message: '请填写姓名', trigger: 'blur' }
              ],
              phone: [
                { required: true, message: '请填写手机号', trigger: 'blur' }
              ]
            }
        })
        watch(()=>props.isShow, (newVal)=>{
            allData.dialogFormVisible = newVal;
        })
        // watch(()=>[root.$store.state.Users.currentPage,root.$store.state.Users.pageSize],([n1,n2])=>{
          // allData.pageSize=n2;
          // allData.currentPage=n1;
          // console.log(n1,n2)
        // })
        const regOptions =  allData.regionOptions;
        regOptions.forEach((item,index)=>{
          if(item.key!='street'){
            watch(()=>item.value,(newVal)=>{
              if(item.key=='province'){
                regOptions.forEach((item,index)=>{
                  if(index!=0){
                    item.option = [];
                    item.value = '';
                  }
                })
                newVal!=''&& getPlace({type:"city",province_code:newVal}).then(response=>{
                  regOptions[index+1].option=response
                })
              }
              if(item.key=='city'){
                regOptions.forEach((item,index)=>{
                  if(index==2||index==3){
                    item.option = [];
                    item.value = '';
                  }
                })
                newVal!=''&& getPlace({type:"area",city_code:newVal}).then(response=>{
                  regOptions[index+1].option=response
                })
              }
              if(item.key=='area'){
                regOptions[index+1].value = '';
                regOptions[index+1].option = [];
                newVal!=''&& getPlace({type:"street",area_code:newVal}).then(response=>{
                  regOptions[index+1].option=response
                })
              }
            })
          }
        })
        const close = ()=>{
            emit('update:isShow',false);
        }
        const open = ()=>{
          //避免请求滥用
          if(allRoles.value.length==0){
            getRole();
          }
          if(regOptions[0].option.length==0){
            getPlace({type:"province"}).then(response=>{
              regOptions[0].option = response;
            })
          }
          reSetSelect();
          if(props.formData.id){
            allData.radio = props.formData.status;
            checkBoxConfig.checkList = props.formData.role.split(',');
            allData.form.userName = props.formData.username;
            allData.form.name = props.formData.truename;
            allData.form.passWord = "";
            allData.form.phone = props.formData.phone;
          }else{
            // refs["bigForm"].resetFields();
            for(let key in allData.form){
              allData.form[key] = '';
            }
          }
        }
        const reSetSelect = ()=>{
          regOptions.forEach((item,index)=>{
            item.value = '';
            if(index>0){
              item.option = [];
            }
          })
        }
        //all selected checkBoxes
        const boxChange = (val)=>{
          checkBoxConfig.checkList = val;
        }
        //add user reqData
        const addReq = () =>{
          const region = {};
          regOptions.forEach(item=>{
            region[`${item.key}Value`] = item.value
          })
          const reqData = {
            username:allData.form.userName,
            truename:allData.form.name,
            password:allData.form.passWord,
            phone:allData.form.phone,
            region,
            status:allData.radio,
            role:JSON.stringify(checkBoxConfig.checkList),
            id: Number(props.formData.id)
          }
          !props.formData.id && delete reqData.id;
          return reqData;
        }
        const submitForm = () =>{
          refs["bigForm"].validate((valid) => {
            if (valid) {
              addOrEditUserbtn(props.formData.id?userEdit:addUser,addReq())
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
        return{
            allData,close,checkBoxConfig,allRoles,open,boxChange,submitForm,addUserLoading
        }
    }
}
</script>
<style lang='scss' scoped>
</style>