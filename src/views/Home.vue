<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">
          <el-image
              style="width: 280px; height: 65px "
              :src="url"
              :to="{ path: '/home' }">
          </el-image>
<!--          <i class="el-icon-s-custom"></i>-->
<!--          校园人事管理系统-->
        </div>
        <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{user.name}}
            <i><img :src="user.userface" alt=""></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
<!--            这里使用template标签将v-for和v-if区分开来避免循环混淆-->
            <template v-for="(item,index) in routes">
              <el-submenu :index="index+''" v-if="!item.hidden" :key="index">
                <template slot="title">
                  <i style="color: #b3a3da;margin-right: 8px" :class="item.iconCls"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                  {{child.name}}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎
            <template>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="一致性 Consistency" name="1">
                  <div>
                    与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
                  </div>
                  <div>
                    在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback" name="2">
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency" name="3">
                  <div>简化流程：设计简洁直观的操作流程；</div>
                  <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                  <div>
                    帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                  </div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability" name="4">
                  <div>
                    用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                  </div>
                  <div>
                    结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                  </div>
                </el-collapse-item>
              </el-collapse>
            </template>
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>



export default {
  name: "Home",
  data(){
    return{
      //读取存在sessionStorge中的用户信息，并转化为JSON对象
      user:JSON.parse(window.sessionStorage.getItem("user")),
      activeNames: ['1'],
      fits: ['fill'],
      url: 'https://i.loli.net/2021/11/29/Txv9MPLkhByFdZE.png',
      path: '/home',
      activeName: 'second',
    }
  },
  computed:{
    routes(){
      return this.$store.state.routes;
    }
  },
  methods:{
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleChange(val) {
      console.log(val)
    },
    commandHandler(cmd) {
      // 如果点击的值logout，则添加一个消息弹框以便确认用户注销的决定，并决定是否进行注销。
      // 参见ElementUI的Message弹框
      if (cmd == "logout") {
        this.$confirm("是否注销?", "提示", {
          confirmButtonText: "注销",
          cancelButtonText: "取消",
          type: "warning"
        })
            .then(() => {
              this.getRequest("/logout");
              // 将下方的消息提示统一封装在api.js中
              //
              // 移除登录用户的信息
              window.sessionStorage.removeItem("user");
              this.$store.commit("initRoutes", []);
              // 将页面跳转至登录页面
              this.$router.replace("/");
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消注销"
              });
            });
      } else if (cmd == "userInfo") {
        this.$router.push("/hrinfo");
      }
    },
  }
}
</script>

<style>
.homeRouterView{
  margin-top: 10px;
}
.homeHeader{
  background-color: #c6bcda;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}

.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: 微软雅黑;
  color: darkorange;
  padding-top: 50px;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 微软雅黑;
  color: aliceblue;
}

.homeHeader .userInfo{
  cursor: pointer;
}

.el-dropdown-link img{
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link{
  display: flex;
  align-items: center;
}
</style>
