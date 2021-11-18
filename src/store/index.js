import Vue from 'vue'
import Vuex from 'vuex' //导入Vuex

Vue.use(Vuex)

export default new Vuex.Store({
    // 定义属性
    state:{
        //菜单信息存放
        routes:[]
    },
    //修改属性
    mutations:{
        //调用时只需传data
        initRoutes(state,data){
            state.routes=data;
        }
    },
    //Action类似于mutation
    //Action 提交的是 mutation，而不是直接变更状态。
    //Action 可以包含任意异步操作。
    actions:{

    }
})
