<template>
  <div>
    <div>
      <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                clearable
                @clear="initSals"
                style="width: 350px;margin-right: 10px" v-model="keyword"
                @keydown.enter.native="initSals" :disabled="showAdvanceSearchView"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="initSals" :disabled="showAdvanceSearchView">
        查询
      </el-button>
      <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
        <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
           aria-hidden="true"></i>
        工号查询
      </el-button>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchView"
           style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
        <el-row>
          <el-col :span="5">
            工号:
            <el-input v-model="searchValue.userID" placeholder="工号" size="mini"
                      style="width: 130px;">
            </el-input>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini">取消</el-button>
            <el-button size="mini" icon="el-icon-search" type="primary" @click="initSals('advanced')">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div>
      <el-table
          :data="salaries"
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
            prop="userID"
            label="工号"
            width="100">
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            width="80">
        </el-table-column>
        <el-table-column
            prop="departmentid"
            label="部门编号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="basisSalary"
            label="基础薪资"
            width="80">
        </el-table-column>
        <el-table-column
            prop="allSalary"
            label="总薪资"
            width="80">
        </el-table-column>
        <el-table-column
            prop="bonus"
            label="奖金"
            width="80">
        </el-table-column>
        <el-table-column
            prop="adate"
            label="薪资结算日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="remark"
            label="备注"
            width="100">
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
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
        >
        </el-pagination>
      </div>
      <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px" :disabled="multipleSelection.length==0">批量删除</el-button>
    </div>
    <el-dialog
        title="修改职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div><el-tag>职位名称</el-tag>
          <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
        </div>
        <div>
          <el-tag style="margin-right: 8px">是否启用</el-tag>
          <el-switch
              v-model="updatePos.enabled"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </div>
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
  name: "SalTable",
  data(){
    return{
      searchValue: {
        userID: null,
        username: null,
        beginDateScope: null,
      },
      pos:{
        name:''
      },
      dialogVisible:false,
      updatePos:{
        name:'',
        enabled:false
      },
      multipleSelection:[],
      salaries:[],
      keyword: '',
      loading: false,
      type: '',
      page: 1,
      total: 0,
      size: 10,
      showAdvanceSearchView: false,
    }
  },
  mounted(){
    this.initSals();
  },
  methods:{
    //添加职位
    addPosition(){
      if (this.pos.name){
        this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
          if (resp){
            //刷新职位
            this.initSals();
            //清空输入
            this.pos.name='';
          }
        })
      }else {
        this.$message.error('职位名称不可为空');
      }
    },
    //多选
    handleSelectionChange(val){
      this.multipleSelection=val;
    },
    //批量删除
    deleteMany(){
      this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids='?';
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+'&';
        })
        this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
          if (resp){
            this.initSals();

          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showEditView(index,data){
      Object.assign(this.updatePos,data);
      this.dialogVisible=true;
    },
    //更新职位
    doUpdate(){
      this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
        if (resp){
          this.initSals();
          this.updatePos.name='';
          this.dialogVisible=false;
        }
      })
    },
    //删除职位
    handleDelete(index,data){
      this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
          if (resp) {
            this.initSals();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initSals('advanced');
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initSals();
    },

    initSals(type) {
      this.loading = true;
      let url = '/salary/table/?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.userID) {
          url += '&userID=' + this.searchValue.userID;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
      } else {
        url += "&username=" + this.keyword;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.salaries = resp.data;
        }
      });
    },
  },
}
</script>

<style >
.updatePosInput{
  width: 200px;
  margin-left: 8px;

}
</style>