let proxyObj ={};
//拦截http请求
proxyObj['/']={
    ws:false, //关闭websocket
    target:'http://localhost:8085', //拦截的http请求转发到8085
    changeOrigin:true, //默认是false：请求头中host仍然是浏览器发送过来的host 如果设置成true：发送请求头中host会设置成target
    //地址修改
    pathRewrite:{
        '^/':''  //不修改
    }
}
module.exports={
    //开发环境配置
    devServer:{
        host:'localhost',
        port:8086,
        proxy:proxyObj
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    }
}
