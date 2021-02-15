<template>
  <div id="login">
    <div class="login-wrap">
        <ul class="menu-tab">
            <li :class="{'current':item.current}" v-for="item in message" :key="item.text" v-on:click="toggleMenu(item)">{{item.text}}</li>
        </ul>
    </div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="userName">
            <label for="user-name">邮箱</label>
            <el-input id="user-name" type="text" v-model="ruleForm.userName" autocomplete="off" class=""></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <label for="check-pass">密码</label>
            <el-input id="check-pass" type="password" v-model="ruleForm.checkPass" autocomplete="off" class=""></el-input>
        </el-form-item>
        <el-form-item prop="checkPassAgain" v-if="isShow">
            <label for="check-pass-again">确认密码</label>
            <el-input id="check-pass-again" type="password" v-model="ruleForm.checkPassAgain" autocomplete="off" class=""></el-input>
        </el-form-item>
        <el-form-item prop="textCode">
            <label for="text-code">验证码</label>
            <el-row :gutter="15">
                <el-col :span="15"><el-input id="text-code" v-model="ruleForm.textCode"></el-input></el-col>
                <el-col :span="7"><el-button type="success" @click="getCode()" :disabled="changeCode.isShow">{{changeCode.text}}</el-button></el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="danger" @click="submitForm('ruleForm')" class="botton-block" :disabled="submit">{{isShow ? "注册" : "登录"}}</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
//加密base64 md5 sha1安装引入js-sha1，这里没做
import {requestCode, requestReg, requestLog} from '@/api/login';
import {stripscript, testUsername} from "@/utils/validate";
import {onMounted, reactive, ref} from "@vue/composition-api";
export default {
    name: "login",
    setup(props, context){
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
            ruleForm.checkPass = stripscript(value);
            value = ruleForm.checkPass;
            let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入数字加密码6至20位'));
            } else {    
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== ruleForm.checkPass) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
        };
        let checkTextCode = (rule, value, callback) => {
            let reg = /^[a-z0-9]{6}$/;
            if (value === '') {
              callback(new Error('请输入验证码'));
            } else if (!reg.test(value)) {
              callback(new Error('您输入的验证码格式有误'));
            } else {
              callback();
            }
        };

        //登录注册按钮切换
        const toggleMenu = (data=>{
            message.forEach(element => {
                element.current = false;
            });
            data.current = true;
            data.textEn === 'reg'? isShow.value=true:isShow.value=false;
            //重置
            context.refs['ruleForm'].resetFields();
            //改变验证按钮状态
            clearInterval(timer);
            changeCode.text='获取验证码';
            changeCode.isShow=false;
            //改变提交按钮状态
            submit.value = true;
        })       
        //提交按钮   
        const submitForm = (formName=>{
            context.refs[formName].validate((valid) => {
              if (valid) {
                let data = {
                    username: ruleForm.userName,
                    password: ruleForm.checkPass,
                    code: ruleForm.textCode
                };
                if(isShow.value){
                    requestReg(data).then(response=>{
                        alert('submit!');
                        toggleMenu(message[0]);
                    })
                }else{
                    requestLog(data).then(response=>{
                        context.root.$message.success(response.data.message)
                        // console.log(response)
                        sessionStorage.setItem('token', response.data.data.token)
                        sessionStorage.setItem('username', response.data.data.username)
                        sessionStorage.setItem('2960793237@qq.com', "[\"infoSystem\",\"userSystem\"]")
                        //把用户信息传到控制台
                        context.root.$store.commit('loginUserName', ruleForm.userName)
                        //跳转到控制台
                        context.root.$router.push('/mainpage');
                    }).catch(error=>{
                        context.root.$message.error(response.data.message)
                    })
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        })
        //获取验证码
        const getCode = (()=>{
            if(!ruleForm.userName){
                context.root.$message.error('邮箱不能为空！');
                return;
            }

            if(!testUsername(ruleForm.userName)){
                context.root.$message.error('邮箱格式有误！');
                return;
            }
            //改变状态
            changeCode.text='发送中';
            changeCode.isShow=true;
            submit.value = false;
            //请求
            let data = {
                username: ruleForm.userName,
                module: isShow ? 'register' : 'login'
            };
            requestCode(data).then(response=>{
                //弹屏验证发送成功
                context.root.$message({
                    message: response.data.message,
                    type: 'success'
                });
                //定时器
                let count = 60;
                timer = setInterval(()=>{
                    count--;
                    changeCode.text=`剩余${count}秒`;
                    if(count<0){
                        clearInterval(timer);
                        changeCode.text='重新验证';
                        changeCode.isShow=false;

                    };
                },1000);
            }).catch(error=>{
                context.root.$message.error(response.data.message)
                changeCode.isShow=false;
            });
        });

        //生命周期
        onMounted(()=>{

        })

        //登录注册按钮
        const message = reactive([
            {text: '登录', current: true, textEn: 'log'},
            {text: '注册', current: false, textEn: 'reg'}
        ]);
        //message.text
        //确认密码是否显示
        const isShow= ref(false); 
        //if string,isshow.value. If boolean,isshow
        //isref(isshow)判断是不是基础数据类型
        //toRefs(obj)   obj.value.x   {x,y}=toRefs(obj)
        const ruleForm = reactive({
            userName: '',
            checkPass: '',
            checkPassAgain: '',
            textCode: ''
        })
        const rules = reactive({
            userName: [
              { validator: checkUsername, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPassAgain: [
              { validator: validatePass2, trigger: 'blur' }
            ],
            textCode: [
              { validator: checkTextCode, trigger: 'blur' }
            ]
        })
        //验证码
        const changeCode = reactive({
            text: '获取验证码',
            isShow: false
        })
        //提交
        const submit = ref(true);
        //定时器
        let timer = ref(null);

        return {                            
            toggleMenu,                          
            submitForm,
            message,
            isShow,
            ruleForm,
            rules,
            getCode,
            changeCode,
            submit

        }
    }
                            
};
</script>

<style scoped lang="scss">
#login {
  height: 100vh;
  background-color: #344A5F;
}
.login-wrap{
    width: 330px;
    margin:auto;
    padding-top: 60px;
}
.menu-tab{
    text-align: center;
    li{
        text-decoration: none;
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
    }
    .current{
        background-color: #2F4255;
    }
}
//表单样式
.el-form.demo-ruleForm{
    width: 330px;
    margin: 0 auto;
    margin-top: 10px;
    label{
        color: #fff;
        font-size: 14px;
        line-height: 24px;
    }
}
.botton-block{
    display: inline-block;
    width: 100%;
    margin-top: 5px;
}







</style>