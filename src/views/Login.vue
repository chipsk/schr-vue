
<template>
  <div>
    <el-form :rules="rules"
             ref="loginForm"
             v-loading="loading"
             element-loading-text="正在登录..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             :model="loginForm"
             class="loginContainer">
      <h3>校园人事管理系统登陆</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off"
                  placeholder="请输入用户名..."></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"
                  placeholder="请输入密码..." @keydown.enter.native="submitLogin"></el-input>
      </el-form-item>
      <el-button type="primary" style="width: 50%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>

  import {postKeyValueRequest} from "@/utils/api";

  export default {
    name: "Login",
    data(){
      return{
        loginForm:{
          username:"admin",
          password:"123"
        },
        rules:{
          username:{ required: true, message: '请输入用户名', trigger: 'blur' },
          password:{ required: true, message: '请输入密码', trigger: 'blur' }
        }
      }
    },
    methods:{
      submitLogin(){
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            //alert('submit!');
            //请求成功处理
            postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
              if (resp) {
                window.sessionStorage.setItem("user",JSON.stringify(resp.obj));
                let path = this.$route.query.redirect;
                //两个方法：replace和push
                //区别：push可以页面后退 replace不可以
                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
              }
            })
          } else {
            this.$message.error('这是一条错误消息');
            return false;
          }
        });
      },
    }
  }
</script>

<style>
  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }

  .loginRemember {
    text-align: left;
    margin: 0px 0px 15px 0px;
  }
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
</style>
