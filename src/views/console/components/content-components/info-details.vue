<template>
    <div class="info_details">
        <el-form ref="form" label-width="110px">
            <el-form-item label="信息分类：">
              <el-select class="info_category" v-model="info_details.infoCategory" clearable placeholder="请选择">
                <el-option
                  v-for="item in info_details.options"
                  :key="item.id"
                  :label="item.category_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新闻标题：">
                <el-input class="new_title" v-model="info_details.newTitle" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item class="short_image" label="缩略图：">
              <avatarUpload :imgUrl.sync="info_details.imgUrl" :config="info_details.config"/>
            </el-form-item>
            <el-form-item label="发布日期：">
                <el-date-picker class="date_picker"
                 v-model="info_details.publicDate"
                 type="date"
                 placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="详细内容：">
                <quill-editor class="editor"
                    ref="myTextEditor"
                    v-model="info_details.content"
                    :options="info_details.editorOption">
                </quill-editor>
            </el-form-item>
            <el-button class="save" type="danger" @click="save" :loading="info_details.submitLoading">保存</el-button>
        </el-form>
    </div>
</template>
<script>
import {editInfo} from '@/api/infoList'
import {uploadImgToken} from '@/api/infoDetails'
import avatarUpload from '@/components/avatar_upload'
import { onMounted, reactive, ref, onBeforeMount} from '@vue/composition-api'
export default {
    name: 'infoDetails',
    components:{avatarUpload},
    setup(props, {root}){
        //全部信息
        const info_details = reactive({
            id: '',
            infoCategory:'',
            options:[],
            newTitle:'',
            publicDate:'',
            content: '',
            editorOption:{},
            imgUrl:'http://shidami.web-jshtml.com/',
            config:{
              token:'',
              action: 'http://upload-z2.qiniup.com'
            },
            submitLoading: false
        })
        //保存
        const save = () =>{
          const requestData = {
            categoryId: info_details.infoCategory,
            title: info_details.newTitle,
            content: info_details.content,
            id: info_details.id,
            updateDate:info_details.publicDate,
            imgUrl: info_details.imgUrl
          }
          info_details.submitLoading= true;
          editInfo(requestData).then(response=>{
            root.$message({
              message: response.data.message,
              type: 'success'
            })
            info_details.submitLoading= false;
          }).catch(error=>{
            root.$message.error(response.data.message);
            info_details.submitLoading= false;
          })
        }



        onBeforeMount(()=>{
          console.log(root.$route.params.details)
          if(root.$route.params.details == ":details"){
            return false;
          }
          let detailsParse = JSON.parse(root.$route.params.details)
          info_details.options = Object.assign([],JSON.parse(root.$route.params.options))
          info_details.newTitle = detailsParse.title
          info_details.infoCategory = detailsParse.categoryId
          info_details.publicDate = detailsParse.createDate
          info_details.id = detailsParse.id
        })

        
        uploadImgToken({
            ak: 'V39LOrOWUFeLqbsltTqLU3WRBgXUm_lTlM3BGjd0',
            sk: 'ynRl6g0OHcnnERp4ovP3ZFJ_ar0ZljIAzPGA9VZl',
            buckety:'shidami'
        }).then(response=>{
            info_details.config.token = response.data.data.token;
        }).catch(error=>{
            root.$message.error('未获取到七牛云Token!');
        })

        return{
            info_details,
            save
        }
    }
}
</script>
<style lang="scss" scoped>
.info_details{
    padding-top: 20px;
}
</style>