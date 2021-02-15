<template>
  <div id="user-list">
    <el-form ref="form">
      <div class="move_left" style="width: 50%">
        <el-form-item label="关键字：" class="label_key move_left">
          <comSelect :options="allData.options" :value.sync="allData.value" class="com_select" style="width:auto;margin-left:68px"/>
        </el-form-item>
        <div class="userList_input move_right">
          <el-input style="padding-right:84px;width:100%;box-sizing:border-box" v-model="allData.input" placeholder="请输入内容"></el-input>
          <el-button type="danger" @click="click_search" size="medium">搜索</el-button>
        </div>
      </div>
      <el-button class="move_right add_user" type="danger" @click="click_add" size="medium">新增</el-button>
    </el-form>
    <comTable :tableConfig="tableConfig" @allSeleteData="allSeleteData">
      <template v-slot:status="stData">
        <el-switch v-model="stData.data.status" active-color="#13ce66" inactive-color="#ff4949" 
        active-value="2" inactive-value="1" @change="swiChange(stData.data)"></el-switch>
      </template>
      <template v-slot:operation="opData">
        <el-button size="mini" type="success" @click="editOneUser(opData.data)">编辑</el-button>
        <el-button size="mini" type="danger" @click="deleteOneUser(opData.data)">删除</el-button>
      </template>
    </comTable>
    <div class="bottom_content">
      <el-button plain @click="deleteAllUsers" class="move_left" size="small">批量删除</el-button>
      <comPagination :config ="pageConfig" class="move_right"/> 
    </div>
    <addUserDialog :isShow.sync="allData.isShow" :formData="allData.formData"/>
  </div>
</template>

<script>
import {deleteInfo} from '@/utils/info_delete'
import {allUsersData} from '@/utils/allUsersData'
import addUserDialog from "@/components/addUser_dialog";
import comPagination from '@/components/pagination';
import comTable from '@/components/table_com';
import comSelect from '@/components/select';
import { reactive, watch} from '@vue/composition-api';
export default {
    name: "userList",
    components: {comSelect,comTable,comPagination,addUserDialog},
    setup(props, {root}){
      const tableConfig = reactive({
        columes:[{
          prop: "username",
          label: "邮箱/用户名",
          width: "170"
        },{
          prop: "truename",
          label: "真实姓名",
          width: "150"
        },{
           prop: "phone",
           label: "手机号",
           width: "150"
        },{
           prop: "region",
           label: "地区",
           width: "200"
        },{
          prop: "role",
          label: "角色",
          width: "100"
        },{
          prop: "status",
          label: "禁启用状态",
          width: "150",
          slotType: "status"
        },{
          prop: "operation",
          label: "操作",
          width: "200",
          slotType: "operation"
        }],
        requestData: {
          method: 'post',
          url: '/user/getList/',
          data: {
            pageNumber: NaN,
            pageSize: NaN
          }
        }
      })
      const pageConfig = reactive({
        pageSizes: [2,4],
        layout: "total, sizes, prev, pager, next, jumper",
        total: NaN,
        pageSize: 4,
        currentPage: 1
      })
      root.$store.state.Users.pageSize = pageConfig.pageSize;
      root.$store.state.Users.currentPage = pageConfig.currentPage;
      tableConfig.requestData.data.pageSize = pageConfig.pageSize;
      tableConfig.requestData.data.pageNumber = pageConfig.currentPage;
      
      const allData = reactive({
        options:[{
          id: "truename",
          value: "姓名"
        },{
          id: "phone",
          value: "手机号"
        }],
        value:"",
        input: "",
        isShow: false,
        formData:{},
        allSeletedData:[]   
      })
      watch(()=>root.$store.state.Users.totalRows, (n1)=>{
        // console.log(n1)
        pageConfig.total = n1;
      })
      const {activeChg,delOneOrAll} = allUsersData(root)
      const {confirm} = deleteInfo();
      //搜索
      const click_search = () =>{
        if(allData.value&&allData.input){
          root.$store.dispatch("Users/tableLoadData",{
            data: {
              pageNumber:1,
              pageSize:root.$store.state.Users.pageSize,
              [allData.value]:allData.input
            }
          });
        }else{
          if(allData.value){
            root.$message.error('搜索框不能为空!')
          }else if(allData.input){
            root.$message.error('请选择关键字！')
          }else{
            root.$message.error('关键字和搜索框不能为空！')
          }
        }
      }
      //新增
      const click_add = () =>{
        allData.isShow = true;
        allData.formData = {};
      }
      //编辑一个用户
      const editOneUser = (val) =>{
        allData.isShow = true;
        for(let key in val){
          allData.formData[key] = val[key];
        }
      }
      // 删除一个用户
      const deleteOneUser =(val) =>{
        confirm({
          content:'此操作将永久删除此条信息, 是否继续?',
          method: delOneOrAll,
          value: {id: [val.id]},
          username: val.username
        });
      }
      //删除所有用户
      const deleteAllUsers =()=>{
        if(allData.allSeletedData.length>0){
          confirm({
            content:'此操作将永久批量删除已选信息, 是否继续?',
            method: delOneOrAll,
            value: {id: allData.allSeletedData}
          });
        }else{
          root.$message.error("请选择要删除的数据！")
        }
      }
      const allSeleteData = (val)=>{
        allData.allSeletedData = val
      }
      const swiChange = (val)=>{
        let req = {
          id:Number(val.id),
          status:val.status
        }
        activeChg(req)
      }
      return{
        tableConfig,
        allData,
        click_search,
        click_add,
        deleteOneUser,
        editOneUser,
        pageConfig,
        deleteAllUsers,
        swiChange,
        allSeleteData
      }
    }
}
</script>
      
<style lang="scss" scoped>
.userList_input{
  width: 55%;
  position: relative;
  button{
    position: absolute;
    top:0;
    right:0;
  }
}
.label_key{
  width: 42%;
  padding-right: 10px;
  overflow: hidden;
  .el-select{
    display: block!important;
  }
}
.bottom_content{
  margin-top: 20px;
}
</style>