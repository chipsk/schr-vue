<template>
  <div style="width: 500px;">
    <el-input
        placeholder="输入部门名称进行搜索"
        prefix-icon="el-icon-search"
        v-model="filterText">
    </el-input>

    <el-tree
        style="margin-top: 10px"
        :data="deps"
        :props="defaultProps"
    :expand-on-click-node="false"
    :filter-node-method="filterNode"
    ref="tree">
    <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="depBtn"
              @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="depBtn"
              @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div>
          <el-tag style="margin-bottom: 8px;margin-right: 8px">上级部门</el-tag>
          <span>{{pname}}</span>
        </div>
        <div>
          <el-tag style="margin-right: 8px">部门名称</el-tag>
          <el-input v-model="dep.name" size="small" placeholder="请输入部门名称..." style="width: 70%"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddDep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data(){
    return{
      filterText:'',
      deps:[],
      dialogVisible:false,
      dep:{
        name:'',
        parentId:-1,

      },
      pname:'',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted(){
    this.initDeps();
  },
  methods: {
    removeDep2Deps(deps,id){
      for (let i = 0; i <deps.length; i++) {
        let d=deps[i];
        if (d.id == id) {
          deps.splice(i,1);
          return;
        }else {
          this.removeDep2Deps(d.children,id);
        }
      }
    },
    addDep2Deps(deps,dep){
      for (let i = 0; i <deps.length; i++) {
        let d=deps[i];
        if (d.id == dep.parentId) {
          d.children=d.children.concat(dep);
          return;
        }else {
          this.addDep2Deps(d.children,dep);
        }
      }
    },
    initDep(){
      this.dep={
        name:'',
        parentId:-1,
      };
      this.pname=''
    },
    doAddDep(){
      this.postRequest("/system/basic/department/",this.dep).then(resp=>{
        if (resp) {
          this.addDep2Deps(this.deps,resp.obj);
          this.initDep();
          this.dialogVisible=false;
        }
      })
    },
    deleteDep(data){
      if (data.parent) {
        this.$message.error("父部门删除失败")
      }else {
        this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
            if (resp) {
              this.removeDep2Deps(this.deps,data.id);
              this.initDep();
              this.dialogVisible=false;
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    showAddDepView(data){
      this.pname=data.name;
      this.dep.parentId=data.id;
      this.dialogVisible=true;
    },
    initDeps(){
      this.getRequest("/system/basic/department/").then(resp=>{
        if (resp) {
          this.deps=resp;
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
}
</script>

<style>
.depBtn{
  padding: 2px;
}

</style>
