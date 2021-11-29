<template>
  <div>
    <div>
      <el-input size="small"
                v-model="jl.name"
                style="width: 300px"
                prefix-icon="el-icon-plus"
                placeholder="添加职称...">
      </el-input>
      <el-select size="small" v-model="jl.titleLevel" placeholder="职称等级" style="margin-left: 8px;margin-right: 8px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addJobLevel">添加</el-button>
    </div>
    <div>
      <el-table
          :data="jls"
          border
          @selection-change="handleSelectionChange"
          stripe
          size="small"
          style="width: 75%;margin-top: 10px">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称级别"
            width="180">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
        >
        </el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
          @click="deleteMany"
          type="danger"
          size="small"
          style="margin-top: 8px"
          :disabled="multipleSelection.length==0">
        批量删除
      </el-button>
    </div>
    <el-dialog
        title="修改职称"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td><el-tag>职称名称</el-tag></td>
            <td><el-input class="updateJlInput" size="small" v-model="updateJl.name"></el-input></td>
          </tr>
          <tr>
            <td><el-tag>职称级别</el-tag></td>
            <td>
              <el-select size="small" v-model="updateJl.titleLevel" placeholder="职称等级" style="margin-left: 8px;margin-right: 8px">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td><el-tag style="margin-right: 8px">是否启用</el-tag></td>
            <td>
              <el-switch
                  v-model="updateJl.enabled"
                  active-text="启用"
                  inactive-text="禁用">
              </el-switch>
            </td>
          </tr>
        </table>

      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JobLevelMana",
  data(){
    return{
      jl:{
        name:'',
        titleLevel:'',
      },
      updateJl:{
        name:'',
        titleLevel:'',
        enabled: false
      },
      dialogVisible: false,
      jls:[],
      multipleSelection:[],
      titleLevels:[
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'

      ],
    }
  },
  mounted(){
    this.initJls();
  },
  methods:{
    handleSelectionChange(val){
      this.multipleSelection=val;
    },
    showEditView(index,data){
      Object.assign(this.updateJl,data);
      this.dialogVisible=true;
    },
    doUpdate(index,data){
      this.putRequest("/system/basic/joblevel/"+data.id).then(resp=>{
        if (resp){
          this.initJls();
          this.dialogVisible=false;
        }
      })
    },
    handleDelete(index,data){
      this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/joblevel/"+data.id).then(resp=>{
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addJobLevel(){
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest("/system/basic/joblevel/", this.jl).then(resp => {
          if (resp) {
            this.initJls();
            this.jl={
              name:'',
              titleLevel:''
            };
          }
        });

      }else {
        this.$message.error("添加字段不可以为空")
      }
    },
    initJls(){
      this.getRequest("/system/basic/joblevel/").then(resp=>{
        if (resp) {
          this.jls=resp;
        }
      })
    },
    deleteMany(){
      this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids='?';
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+'&';
        });
        this.deleteRequest("/system/basic/joblevel/"+ids).then(resp=>{
          if (resp){
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style>
.updateJlInput{
  width: 200px;
  margin-left: 8px;

}
</style>
