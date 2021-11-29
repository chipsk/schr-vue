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
      <el-button type="primary" icon="el-icon-plus" @click="showAddSalView">
        添加工资表
      </el-button>
      <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="80%">
        <div>
          <el-form :model="salaries" ref="salForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="工号:" prop="userID">
                  <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salaries.userID"
                            placeholder="请输入工号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="姓名:" prop="username">
                  <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="salaries.username"
                            placeholder="请输入员工姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="部门编号:" prop="departmentid">
                  <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                            v-model="salaries.departmentid" placeholder="部门编号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="基础薪资:" prop="basisSalary">
                  <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                            v-model="salaries.basisSalary" placeholder="基础薪资"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="总薪资:" prop="allSalary">
                  <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                            v-model="salaries.allSalary" placeholder="总薪资"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="奖金:" prop="bonus">
                  <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                            v-model="salaries.bonus" placeholder="奖金"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="备注:" prop="remark">
                  <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                            v-model="salaries.remark" placeholder="备注"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发放时间:" prop="adate">
                  <el-date-picker
                      v-model="salaries.adate"
                      size="mini"
                      type="date"
                      value-format="yyyy-MM-dd"
                      style="width: 150px;"
                      placeholder="发放时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddSalary">确 定</el-button>
  </span>
      </el-dialog>
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
        :visible.sync="dialogVisible2"
        width="35%">
      <div>
        <div><el-tag>工号</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.userID"></el-input>
        </div>
        <div><el-tag>姓名</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.username"></el-input>
        </div>
        <div><el-tag>部门编号</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.departmentid"></el-input>
        </div>
        <div><el-tag>基础薪资</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.basisSalary"></el-input>
        </div>
        <div><el-tag>总薪资</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.allSalary"></el-input>
        </div>
        <div><el-tag>奖金</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.bonus"></el-input>
        </div>
        <div><el-tag>备注</el-tag>
          <el-input class="updateSalInput" size="small" v-model="updateSal.remark"></el-input>
        </div>
        <div>
          <el-tag>发放时间</el-tag>
          <el-date-picker
              v-model="updateSal.adate"
              class="updateSalInput"
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 150px;"
              placeholder="发放时间">
          </el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible2 = false">取 消</el-button>
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
      dialogVisible2:false,
      updateSal:{
        userID: "",
        username: "",
        departmentid: 9,
        basisSalary: "",
        allSalary: "",
        bonus: "",
        remark: "",
        adate: "",
      },
      multipleSelection:[],
      salaries:[],
      keyword: '',
      type: '',
      allDeps: [],
      page: 1,
      total: 0,
      loading: false,
      popVisible: false,
      popVisible2: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      size: 10,
      title: '',
      showAdvanceSearchView: false,
      sal: {
        userID: "101111",
        username: "zzl",
        departmentid: 9,
        basisSalary: "5000",
        allSalary: "8000",
        bonus: "2000",
        remark: "无",
        adate: "2021-11-29",
      },
      rules: {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        userSex: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        e_mail: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentid: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        joblevel: [{required: true, message: '请输入职称', trigger: 'blur'}],
        positionid: [{required: true, message: '请输入职位', trigger: 'blur'}],
        workstatus: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        userID: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTime: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
        beginworkDate: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endworkDate: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
      },

      emptySal() {
        this.salaries = {
          userID: "",
          username: "",
          departmentid: 9,
          basisSalary: "",
          allSalary: "",
          bonus: "",
          remark: "",
          adate: "",
        }
        this.inputDepName = '';
      },
    }
  },
  mounted(){
    this.initSals();
  },
  methods:{
    searvhViewHandleNodeClick(data) {
      this.inputDepName = data.name;
      this.searchValue.departmentId = data.id;
      this.popVisible2 = !this.popVisible2
    },
    //添加工资表
    addPosition(){
      if (this.pos.name){
        this.postRequest("/salary/table/",this.pos).then(resp=>{
          if (resp){
            //刷新工资表
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
        this.deleteRequest("/salary/table/"+ids).then(resp=>{
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
      Object.assign(this.updateSal,data);
      this.dialogVisible2=true;
    },

    doUpdate(){
      this.putRequest("/salary/table/",this.updateSal).then(resp=>{
        if (resp){
          this.initSals();
          this.updateSal.name='';
          this.dialogVisible2=false;
        }
      })
    },

    handleDelete(index,data){
      this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/salary/table/"+data.id).then(resp=>{
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
    showAddSalView() {
      this.emptySal();
      this.title = '添加工资表';
      this.dialogVisible = true;
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
    doAddSalary() {
      if (this.salaries.id) {
        this.$refs['salForm'].validate(valid => {
          if (valid) {
            this.putRequest("/salary/table/", this.sal).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      } else {
        this.$refs['salForm'].validate(valid => {
          if (valid) {
            this.postRequest("/salary/table/", this.sal).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSals();
              }
            })
          }
        });
      }
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
