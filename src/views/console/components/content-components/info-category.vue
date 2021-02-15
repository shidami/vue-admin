<template>
  <div id="info-category">
    <el-button type="danger" @click="add_first">添加一级分类</el-button>
    <hr/>
    <el-row>
      <el-col :span="9">
        <div class="category" v-for="(item) in allInfo.items" :key="item.id">
          <h4>
            {{item.category_name}}
            <div class="button_grounp">
              <el-button type="danger" round @click="edit_first(item)">编辑</el-button>
              <el-button type="success" round @click="add_second(item)">添加子类</el-button>
              <el-button round @click="delete_firstOrSecond(item.id)">删除</el-button>
            </div>
          </h4>
          <ul v-if="item.children">
            <li v-for="(item) in item.children" :key="item.id">
              {{item.category_name}}
              <div class="button_grounp">
                <el-button type="danger" round @click="edit_second(item)">编辑</el-button>
                <el-button round @click="delete_firstOrSecond(item.id)">删除</el-button>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="1">
        <div style="background:#fff;height:100vh"></div>
      </el-col>
      <el-col :span="14">
        <div class="edit_category">
          <h4>分类编辑</h4>
          <el-form ref="form" :model="form">
            <el-form-item label="一级分类名称：" prop="name1" v-if="isShow_first">
              <el-input v-model="form.name1" :disabled="isDisable_first"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" prop="name2" v-if="isShow_second">
              <el-input v-model="form.name2" :disabled="isDisable_second"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="danger" :disabled="isDisable_button" @click="addCategory" :loading="isLoading">确定</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {deleteInfo} from '@/utils/info_delete'
import {addFirstClass, deleteClass, editClass, addSecondClass, secondClass, firstClass} from '@/api/infoCategory'
import { onMounted, reactive, ref } from '@vue/composition-api'
export default {
    name: "infoCategory",
    setup(props, {root, refs}){
      onMounted(()=>{
        // requestSecondClass();
        requestfirstClass();
      });            
      //挂一级加二级分类
      const requestSecondClass = ()=>{
        secondClass().then(response=>{
          // console.log(response)
          allInfo.items = response.data.data;
          // console.log(allInfo.items)
        }).catch(error=>{
          root.$message.error('二级分类获取有误！');
        })
      };
      //挂一级分类
      const requestfirstClass = ()=>{
        firstClass().then(response=>{
          // console.log(response)
          allInfo.items = response.data.data.data;
          // console.log(allInfo.items)
        }).catch(error=>{
          root.$message.error('一级分类获取有误！');
        })
      };
      //表单双向绑定
      const form = reactive({
        name1: '',
        name2: ''
      });
      //目前所有信息
      const allInfo = reactive({
        items:[]
      });
      //是否禁用一级表单
      const isDisable_first = ref(true);
      //是否禁用二级表单
      const isDisable_second = ref(true);
      //是否禁用按钮
      const isDisable_button = ref(true);
      //是否显示一级表单
      const isShow_first = ref(true);
      //是否显示二级表单
      const isShow_second = ref(true);
      //是否呈现加载状态
      const isLoading = ref(false);
      //准备添加一级分类
      const add_first = ()=>{
        isDisable_first.value = false;
        isDisable_button.value = false;
        isShow_second.value = false;
        isShow_first.value = true;
        judgeType.value = 'add_first';
        form.name1='';
      };
      //判断添加/编辑分类
      const judgeType = reactive({
        value: '',
        id: ''
      });
      //确定添加分类/编辑分类
      const addCategory = ()=>{
        if(!form.name1){
          root.$message.error('请添加一级分类！');
          return false;
        }
        formStateChange(true);
        isDisable_second.value = true;
        judgeType.value == 'add_first'&&
          addFirstClass({categoryName:form.name1}).then(response=>{
           // console.log(response)
            requestSecondClass();
            refs['form'].resetFields();
            formStateChange(false);
            root.$message({
              type: 'success',
              message: '添加成功!'
            });
          }).catch(error=>{
            root.$message.error('一级分类添加有误，请重新添加！');
            formStateChange(false);
          });
        judgeType.value == 'edit_first'&&
          editClass({id:judgeType.id,categoryName:form.name1}).then(response=>{
            // console.log(response)
            requestSecondClass();
            form.name1 = '';
            formStateChange(false);
            root.$message({
              type: 'success',
              message: '编辑成功!'
            });
          }).catch(error=>{
            root.$message.error('编辑信息失败，请重新编辑！');
            formStateChange(false);
          })
        judgeType.value == 'add_second'&&
          addSecondClass({categoryName:form.name2,parentId:judgeType.id}).then(response=>{
            // console.log(response)
            requestSecondClass();
            form.name2 = '';
            isDisable_second.value = false;
            isDisable_button.value = false;
            isLoading.value = false;
            root.$message({
              type: 'success',
              message: '添加成功!'
            });
          }).catch(error=>{
            root.$message.error('二级分类添加有误，请重新添加！');
            isDisable_second.value = false;
            isDisable_button.value = false;
            isLoading.value = false;
          })
        judgeType.value == 'edit_second'&&
          editClass({id:judgeType.id,categoryName:form.name2}).then(response=>{
            // console.log(response)
            requestSecondClass();
            refs['form'].resetFields();
            formStateChange(false);
            root.$message({
              type: 'success',
              message: '编辑成功!'
            });
          }).catch(error=>{
            root.$message.error('编辑信息失败，请重新编辑！');
            formStateChange(false);
          })
      }
      //封装表单状态改变
      const formStateChange = (state)=>{
        isDisable_first.value = state;
        isDisable_second.value = state;
        isDisable_button.value = state;
        isLoading.value = state;
      };
      //删除一级分类
      const delete_firstOrSecond = (data)=>{
        const {confirm} = deleteInfo();
        confirm({
          content: '删除此条消息将无法恢复，是否继续？',
          method: deleteOperation,
          value: data
        });
      };
      const deleteOperation = (data)=>{
        deleteClass({categoryId:data}).then(response=>{
          // console.log(response)
          root.$message({
            type: 'success',
            message: '删除成功!'
          });
          requestSecondClass();
        }).catch(error=>{
          root.$message.error('删除失败，请重新删除！'); 
        })   
      };    
      //编辑一级分类
      const edit_first = (data)=>{
        isShow_first.value = true;
        isDisable_first.value = false;
        isDisable_button.value = false;
        isShow_second.value = false;
        form.name1 = data.category_name;
        judgeType.value = 'edit_first';
        judgeType.id = data.id;
      };
      //准备添加二级分类
      const add_second = (data) =>{
        isDisable_first.value = true;
        isDisable_button.value = false;
        isDisable_second.value = false;
        isShow_second.value = true;
        isShow_first.value = true;
        judgeType.value = 'add_second';
        judgeType.id = data.id;
        form.name1 = data.category_name;
      };
      //编辑二级
      const edit_second = (data)=>{
        isShow_first.value = false;
        isDisable_button.value = false;
        isShow_second.value = true;
        isDisable_second.value = false;
        form.name2 = data.category_name;
        judgeType.value = 'edit_second';
        judgeType.id = data.id;
      };

      return {
        form,
        allInfo,
        isDisable_first,
        isDisable_second,
        isDisable_button,
        isShow_first,
        isShow_second,
        add_first,
        addCategory,
        isLoading,
        formStateChange,
        delete_firstOrSecond,
        deleteOperation,
        edit_first,
        judgeType,
        add_second,
        requestSecondClass,
        edit_second
      }
    }
}
</script>>
      
<style lang="scss" scoped>
hr{
  margin: 30px -20px;
  border:none;
  border: .5px solid #f1eaea;
}
.category{
  position: relative;
  &::before{
    content: '';
    top: -20px;
    left: 0;
    width:10px;
    height:34px;
    position: absolute;
    border-right: 1px dashed rgb(44, 44, 44);
  }
  &:first-child::before{
    width:0;
    height: 0;
  }
  h4,li{
    line-height: 44px;
    margin: 0;
    margin-left: 25px;
    @include webkit(transition, all .3s ease);
    &:hover{
      background-color: rgb(197, 197, 197);
      >.button_grounp{
        display: block;
      }
    }
  }
  >h4{
    position: relative;
    &::before{
      position: absolute;
      content: '+';
      top: 15px;
      left: -22px;
      box-sizing: border-box;
      width: 15px;
      height: 15px;
      border: 1px solid rgb(44, 44, 44);
      border-radius: 20%;
      font-size: 15px;
      text-align: center;
      line-height: 15px;
    }
  }
  >ul{
    list-style: none;
    >li{
      padding-left: 40px;
      margin-left: 10px;
      position: relative;
      &::before{
        position: absolute;
        content: '';
        top: -22px;
        left: 0px;
        box-sizing: border-box;
        width: 38px;
        height: 44px;
        border-bottom: 1px dashed rgb(44, 44, 44);
        border-left: 1px dashed rgb(44, 44, 44);
      }
      &:first-child{
        &::before{
          height: 36px;
          top: -14px;
        }
      }
    }
  }
}
.button_grounp{
  position: absolute;
  right: 1px;
  bottom: 1px;
  display: none;
  @include webkit(transition, all .3s ease);
  >button{
    font-size: 80%!important;
    padding: 8px 15px!important;
  }
}
.edit_category{
  >h4{
    line-height: 44px;
    margin: 0;
    padding-left: 25px;
    @include webkit(transition, all .3s ease);
    &:hover{
      background-color: rgb(197, 197, 197);
    }
  }
}
</style>