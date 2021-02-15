<template>
  <div id="info_list">
    <el-form ref="form" label-width="45px">
      <!-- 头部表单 -->
      <el-form-item label="分类：">
        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options.items"
            :key="item.id"
            :label="item.category_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker
          value-format="yyyy-MM-dd hh:mm:ss"
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键字：" label-width="60px">
        <el-select v-model="value2" clearable placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="input_search move_left">
        <el-input  class="move_left" v-model="input" placeholder="请输入内容"></el-input>
        <el-button class="move_right" type="danger" @click="click_search">搜索</el-button>
      </div>
      <div class="move_right">
        <el-button type="danger" @click="click_add">新增</el-button>
      </div>
      <!-- 中部表格 -->
      <el-table :data="tableData.items" border style="width: 100%" 
      v-loading="tableData.loading" @select="selection" @select-all="select_all" ref="multipleTable">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="150"></el-table-column>
        <el-table-column align="center" prop="categoryId" label="类别ID" width="70"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="分类" width="100"></el-table-column>
        <el-table-column align="center" prop="createDate" label="日期" width="100"></el-table-column>
        <el-table-column align="center" prop="content" label="内容" width="100"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editOneInfo(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteOneInfo(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="warning" @click="detailedEdit(scope.row)">详细编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部批量删除与分页 -->
      <div class="bottom_content">
        <el-button plain @click="deleteAllInfos">批量删除</el-button>
        <el-pagination
          background
          :current-page.sync="pageSelection.currentPage"
          :page-sizes="[1, 2, 3]"
          :page-size.sync="pageSelection.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageSelection.total"
          @current-change = "get_list"
          @prev-click = "get_list"
          @next-click = "get_list"
          @size-change = "get_list">
        </el-pagination>
      </div>
    </el-form>
    <!-- 增添信息对话框 -->
    <addInfoDialog :isShow.sync="dialogVisible" :inputCategory="options.items" @add_get_info="add_get_info"/>
  </div>
</template>

<script>
import format from '@/utils/time_transfer'
import {firstClass} from '@/api/infoCategory'
import {infoList, addInfo, editInfo, deleteInformation} from '@/api/infoList'
import {deleteInfo} from '@/utils/info_delete'
import addInfoDialog from '@/components/addInfo_dialog'
import { onMounted, reactive, ref, onActivated } from '@vue/composition-api'
export default {
    name: "infoList",
    components:{addInfoDialog},
    setup(props, {root,refs}){
        //多选框
        const options = reactive({
          items: []
        });
        const value = ref('');
        //时间选择器
        const value1 = ref('');
        //关键字选择器
        const options1 = reactive([{
          value: 'ID',
          label: 'ID'
        }, {
          value: '标题',
          label: '标题'
        }]);
        const value2 = ref('ID');
        //搜索框
        const input = ref('');
        //新增/编辑弹出框
        const dialogVisible = ref(false);
        //表格
        const tableData = reactive({
          items: [],
          loading : true
        });
        //分页
        const pageSelection = reactive({
          total: null,
          currentPage: 1,
          pageSize: 2
        });
        //多选信息集合
        const idCollection = reactive({
          items: []
        });
        //新增按钮
        const click_add = ()=>{
          dialogVisible.value = true;
          root.$store.state.info.editInfo = {};
          root.$store.state.info.isEdit = false;

        }
        //搜索按钮
        const click_search = ()=>{
          get_list()
        }
        //单个信息删除
        const deleteOneInfo = (index, row)=>{
          const {confirm} = deleteInfo();
          confirm({
            content:'此操作将永久删除此条信息, 是否继续?',
            method: delete_information,
            value: {id: [row.id]}
          });
        };
        //信息删除操作
        const delete_information = (data)=>{
          deleteInformation(data).then(response=>{
            root.$message({
              type: 'success',
              message: response.data.message
            });
            get_list();
            // options.items.filter(item=>item.id!=response.data.data.data.id);
          }).catch(error=>{
            root.$message({
              type: 'error',
              message: response.data.message
            });
          })
        }
        //做出选中项数组
        const selection = (val,row)=>{
          if(idCollection.items.length<1){
            idCollection.items[0] = row;
          }else{
            idCollection.items.forEach((item,index)=>{
              if(item.id==row.id){
                idCollection.items.splice(index,1)
              }else{
                if(index==idCollection.items.length-1){
                  idCollection.items[index+1] = row;
                }
              }
            })
          }
          // console.log(idCollection.items)
        }
        const select_all = (vals) =>{
          if(vals.length>0){
            idCollection.items = vals;
          }else{
            idCollection.items = [];
          }
          // console.log(idCollection.items)
        }
        //批量信息删除
        const deleteAllInfos = ()=>{
          const {confirm} = deleteInfo();
          const id= [];
          idCollection.items.forEach(item=>{
            id.push(item.id)
          });
          confirm({
            content:'此操作将批量删除信息, 是否继续?',
            method: delete_information,
            value: {id: id}
          });
        };
        //获取信息列表的请求数据
        const moreReq = ()=>{
          const req = {
            pageNumber:pageSelection.currentPage,
            pageSize:pageSelection.pageSize
          }
          if(value.value){   //分类
            req.categoryId = Number(value.value)
          }
          if(value1.value){    //时间
            req.startTiem = value1.value[0]
            req.endTime = value1.value[1]
          }
          if(value2.value=='ID'){    //ID 标题
            if(input.value){
              req.id = Number(input.value);
            }
          }
          if(value2.value=='标题'){
            if(input.value){
              req.title = input.value;
            }
          }
          return req
        }
        //获得分类列表
        const get_list = ()=>{
          infoList(moreReq()).then(response=>{
            tableData.items = response.data.data.data;
            tableData.items.forEach(item=>{
              //为表格每一项添加categoryName属性
              options.items.forEach(option=>{
                option.id == item.categoryId && function(){
                  item.categoryName = option.category_name;
                }();
              });
              //时间戳转换
              item.createDate = format(item.createDate)
            });
            pageSelection.total = response.data.data.total;
            tableData.loading = false;
            root.$message.success('信息列表加载完成！');
            boxSelected();
          }).catch(error=>{
            root.$message.error('信息列表加载失败，请刷新重试或检查网络连接！');
            tableData.loading = false;
          });
        };
        //判断每一项是否为选中状态，如果是，变成选中状态
        const boxSelected = ()=>{
          idCollection.items.forEach(collect=>{
            tableData.items.forEach(item=>{
              if(collect.id==item.id){
                // console.log(11111)
                refs.multipleTable.toggleRowSelection(item,true);
                // console.log(22222)
              }
            })
          })
        }
        //挂分类
        onMounted(()=>{
          get_list();
        });
        onActivated(()=>{
          firstClass().then(response=>{
            options.items = response.data.data.data;
          }).catch(error=>{
            root.$message.error('分类加载失败，请刷新重试或检查网络连接！');
          });
        })
        //新增信息刷新
        const add_get_info = ()=>{
          get_list()
        }
        //编辑信息
        const editOneInfo = (index, row)=>{
          dialogVisible.value = true;
          root.$store.state.info.editInfo = row;
          root.$store.state.info.isEdit = true;
        }
        //详细编辑
        const detailedEdit = (row)=>{
          let opt = JSON.stringify(options.items)
          let rows = JSON.stringify(row)
          // console.log(rows,opt)
          root.$router.push({
            path:`/infodetails/${opt}/${rows}`
            // path:`/infodetails/dfdsfndfmn/dnfdnl`
          })
        }

        return{
          options,
          value,
          deleteAllInfos,
          deleteOneInfo,
          tableData,
          dialogVisible,
          input,
          value2,
          options1,
          value1,
          pageSelection,
          get_list,
          add_get_info,
          editOneInfo,
          click_add,
          selection,
          select_all,
          idCollection,
          boxSelected,
          click_search,
          detailedEdit
        }
    }
}
</script>
      
<style lang="scss" scoped>

</style>