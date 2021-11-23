import {getRequest} from "./api";
//创建菜单初始化方法
export const initMenu=(router,store)=>{
    //判断是否有菜单数据，有就不加载
    if (store.state.routes.length>0){
        return;
    }
    getRequest("/system/config/menu").then(data=>{
        if (data){
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes',fmtRoutes)
        }
    })
}

export const formatRoutes=(routes)=>{
    let fmRoutes=[];
    routes.forEach(router=>{
        //批量定义，相当于let path=router.path
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children  //此处的children已经格式化了
        }=router;
        //判断是否是一级菜单的children
        if (children && children instanceof Array){
            //递归
            children=formatRoutes(children);
        }
        let fmRouter={
            path:path,
            name:name,
            iconCls:iconCls,
            meta:meta,
            children:children,
            //动态加载
            component(resolve){
                //Home开头
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                }else if (component.startsWith("Emp")){
                    require(['../views/emp/' + component + '.vue'], resolve);
                }else if (component.startsWith("Per")){
                    require(['../views/per/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sal")){
                    require(['../views/sal/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sta")){
                    require(['../views/sta/' + component + '.vue'], resolve);
                }else if (component.startsWith("Sys")){
                    require(['../views/sys/' + component + '.vue'], resolve);
                }else if (component.startsWith("Bas")){
                    require(['../views/bas/' + component + '.vue'], resolve);
                }
            }
        }
        //fmRouter放入数组fmRoutes中
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}
