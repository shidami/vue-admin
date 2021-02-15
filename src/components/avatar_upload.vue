<template>
    <el-upload
      class="avatar-uploader"
      :action="config.action"
      :data="info_details.uploadData"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="info_details.imageUrl" :src="info_details.imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>
<script>
import {reactive} from '@vue/composition-api'
export default {
    name: 'avatarUpload',
    props: {
        imgUrl: {
            type: String,
            default: ""
        },
        config: {
            type: Object,
            default: ()=>{}
        }
    },
    setup(props, {root,emit}){

        const info_details = reactive({
            imageUrl:'',
            action: '',
            uploadData:{
                key:'',
                token:''
            }
        })
        //缩略图方法
        const handleAvatarSuccess = (res, file)=>{
            info_details.imageUrl = `${props.imgUrl}${res.key}`;
            emit("update:imgUrl", info_details.imageUrl)
        }
        const beforeAvatarUpload = (file)=>{
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!isJPG) {
            root.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            root.$message.error('上传头像图片大小不能超过 5MB!');
          }
          //图片格式转换
          let key = encodeURI(`${file.name}`)
          info_details.uploadData.key = key;
          info_details.uploadData.token = props.config.token
          return isJPG && isLt2M;
        }

        return{
            handleAvatarSuccess,
            beforeAvatarUpload,
            info_details
        }
    }
}
</script>
<style scoped lang="scss">
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>