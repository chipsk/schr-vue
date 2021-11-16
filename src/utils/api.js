import axios from 'axios';  //引入axios
import { Message } from 'element-ui';  //引入element-ui的message
import router from '../router';  //导入路由


//响应拦截器
axios.interceptors.response.use(success=>{   //成功的响应
                                             //注意：success.status是httpstatus
                                             //success.data.status是返回的JSON中的status
    if (success.status &&success.status==200&&success.data.status==500){
        //msg为后端的RespBean中的msg
        //Message为element-ui的Message
        Message.error({message:success.data.msg})
        //返回空值是为了在请求调用的地方判断值是否为空，为空说明请求失败
        return;
    }
    if (success.data.msg){
        Message.success({message:success.data.msg})
    }

    return success.data;
},error => { //异常的响应
    if (error.response.status == 504||error.response.status==404){
        Message.error({message:'服务器挂了'})
    }else if (error.response.status==403){
        Message.error({message:'权限不足，请联系管理员'})
    }else if (error.response.status == 401){
        Message.error({message:'尚未登录，请登录'})
        //跳转到登录页面
        router.replace("/")

    }else {
        if (error.response.data.msg){
            Message.error({message:error.response.data.msg})
        }else {
            Message.error({message:'未知错误'})
        }
    }
    return;
})
//全局变量 方便添加前缀
//url:`${base}${url}`
let base='';
//请求封装
export const postKeyValueRequest=(url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params,
        transformRequest:[function (data) {
            let ret='';
            for (let i in data){

                ret+=encodeURIComponent(i)+'='+encodeURIComponent(data[i])+'&'
            }
            return ret;
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    });
}
//直接传递JSON对象
export const  postRequest=(url,params)=>{
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

export const  putRequest=(url,params)=>{
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

export const  getRequest=(url,params)=>{
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export const  deleteRequest=(url,params)=>{
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
