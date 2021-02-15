<template>
    <div class="addinfo_dialog">
        <el-dialog :title="edit_transfer.isEdit?'编辑':'新增'" :visible.sync="dialogFormVisible" 
        :modal-append-to-body="false" @close="close" @opened="opened">
            <el-form :model="form" ref="form">
                <el-form-item label="类型：" prop="value">
                  <el-select v-model="form.value" placeholder="请选择">
                    <el-option
                      v-for="item in options.items"
                      :key="item.id"
                      :label="item.category_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题：" prop="name">
                  <el-input v-model="form.name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="概况：" prop="desc">
                  <el-input type="textarea" v-model="form.desc" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="danger" @click="dialog_confirm" :loading="form.submitLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {addInfo, editInfo} from '@/api/infoList'
import { computed, reactive, ref, watch} from '@vue/composition-api'
export default {
    name: 'addInfo',
    props:{
        isShow:{
          type:Boolean,
          default:false
        },
        inputCategory:{
          type:Array,
          required:true 
        }

    },
    setup(props, {root, emit, refs}){
        //是否显示
        const dialogFormVisible = ref(false);
        watch(()=>[props.isShow,props.inputCategory], ([new1,new2], [old1,old2])=>{
            dialogFormVisible.value = new1;
            options.items = new2;
        })
        //表单双向绑定的数据
        const form = reactive({ 
          value: '',
          name: '',
          desc: '',
          submitLoading: false
        });
        //分类多选框
        const options = reactive({
          items:[]
        });
        //elementUI关闭时触发
        const close = ()=>{
          emit('update:isShow',false);
        };
        //编辑按钮传入信息
        const edit_transfer = reactive({
          isEdit: computed(()=>root.$store.state.info.isEdit),
          editInfo: computed(()=>root.$store.state.info.editInfo)
        })
        //打开后触发
        const opened = ()=>{
          if(edit_transfer.isEdit){
            sessionStorage.removeItem('contiuneAdd');
            form.value= edit_transfer.editInfo.categoryName;
            form.name= edit_transfer.editInfo.title;
            form.desc= edit_transfer.editInfo.content;
          }else{
            if(!sessionStorage.getItem('contiuneAdd')){
              sessionStorage.setItem('contiuneAdd','yes');
              refs.form.resetFields();
            }
          }
        }
        //确定新增信息
        const dialog_confirm = () =>{
          if(!form.value) {
            root.$message({
                message: '分类不能为空！！',
                type: 'error'
            })
            return false;
          }
          form.submitLoading= true;
          const requestData = {
            categoryId: form.value,
            title: form.name,
            content: form.desc
          }
          if(edit_transfer.isEdit){
            requestData.id = edit_transfer.editInfo.id
            addOrEditRequest(editInfo, requestData);
          }else{
            addOrEditRequest(addInfo, requestData);
          }
        };
        //封装请求
        const addOrEditRequest = (func, reqData) =>{
          func(reqData).then(response=>{
            root.$message({
               message: response.data.message,
               type: 'success'
            })
            dialogFormVisible.value = false;
            form.submitLoading= false;
            emit('add_get_info')
          }).catch(error=>{
            root.$message.error(response.data.message);
            form.submitLoading= true;
          })
        }

        return{
            dialogFormVisible,
            form,
            options,
            close,
            dialog_confirm,
            edit_transfer,
            opened
        }
    }
}
</script>
<style lang="scss" scoped>

</style>