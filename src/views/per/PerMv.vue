<template>
  <div>
    <div>
      <el-table
          :data="empmoves"
          border
          @selection-change="handleSelectionChange"
          stripe
          size="small"
          style="width: 81%;margin-top: 10px">
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
            width="80">
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            width="80">
        </el-table-column>
        <el-table-column
            prop="workstatus"
            label="工作状态"
            width="100">
          <template slot-scope="scope">
            <el-tag>{{scope.row.workstatus}}</el-tag>
            <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                style="float: right"
                size="mini"
                @click="showEditViewWork(scope.$index, scope.row)"></el-button>
            <el-dialog
                title="工作状态调动"
                :visible.sync="dialogVisiblework"
                width="35%">
              <div>
                <el-tag>工作状态</el-tag>
                <el-select class="updateMoveInput" v-model="updateMove.workstatus" placeholder="工作状态" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in workstatuses"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisiblework = false">取 消</el-button>
              <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column
            prop="departmentid"
            label="部门编号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="departmentname"
            label="部门"
            width="150">
          <template slot-scope="scope">
            <el-tag>{{scope.row.departmentname}}</el-tag>
            <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                style="float: right"
                size="mini"
                @click="showEditViewDep(scope.$index, scope.row)"></el-button>
            <el-dialog
                title="部门调动"
                :visible.sync="dialogVisibledep"
                width="35%">
              <div>
                <el-tag>部门</el-tag>
                <el-select class="updateMoveInput" v-model="updateMove.departmentname" placeholder="部门" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in allDeps"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisibledep = false">取 消</el-button>
              <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column
            prop="joblevel"
            label="职称"
            width="130">
          <template slot-scope="scope">
            <el-tag>{{scope.row.joblevel}}</el-tag>
            <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                style="float: right"
                size="mini"
                @click="showEditViewLevel(scope.$index, scope.row)"></el-button>
            <el-dialog
                title="职称调动"
                :visible.sync="dialogVisiblelevel"
                width="35%">
              <div>
                <el-tag>职称</el-tag>
                <el-select class="updateMoveInput" v-model="updateMove.joblevel" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisiblelevel = false">取 消</el-button>
              <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column
            prop="positionid"
            label="职位编号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="positionname"
            label="职位"
            width="180">
          <template slot-scope="scope">
            <el-tag>{{scope.row.positionname}}</el-tag>
            <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                style="float: right"
                size="mini"
                @click="showEditViewPos(scope.$index, scope.row)"></el-button>
            <el-dialog
                title="职位调动"
                :visible.sync="dialogVisiblepos"
                width="35%">
                <div>
                  <el-tag>职位</el-tag>
                  <el-select class="updateMoveInput" v-model="updateMove.positionname" placeholder="职位" size="mini" style="width: 150px;">
                    <el-option
                        v-for="item in positions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                  </el-select>
                </div>
              <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisiblepos = false">取 消</el-button>
              <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="showEditView(scope.$index, scope.row)">全局调动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
    title="全局调动"
    :visible.sync="dialogVisible3"
    width="35%">
    <div>
      <div><el-tag>工号</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.userID"></el-input>
      </div>
      <div><el-tag>姓名</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.username"></el-input>
      </div>
      <div><el-tag>工作状态</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.workstatus"></el-input>
      </div>
      <div><el-tag>部门编号</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.departmentid"></el-input>
      </div>
      <div><el-tag>部门</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.departmentname"></el-input>
      </div>
      <div><el-tag>职称</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.joblevel"></el-input>
      </div>
      <div><el-tag>职位编号</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.positionid"></el-input>
      </div>
      <div><el-tag>职位</el-tag>
        <el-input class="updateMoveInput" size="small" v-model="updateMove.positionname"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible3 = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data(){
    return{
      move:{
        name:''
      },
      dialogVisible:false,
      updateMove:{
        userID:'',
        username:'',
        workstatus:'',
        departmentid:'',
        departmentname:'',
        joblevel:'',
        positionname:'',
        positionid:'',
      },
      empmove: {
        userID: "100111",
        username: "zzl",
        workstatus: "",
        E_mail: "",
        departmentid: 9,
        departmentname: "",
        joblevel: "",
        positionid: "",
        positionname: ""
      },

      searchValue: {
        posname: null,
        dname: null,
        beginDateScope: null
      },
      positions: [],
      joblevels: [],
      politicsstatus: [],
      allDeps: [],
      multipleSelection:[],
      empmoves:[],
      workstatuses: [{"name": "在职",}, {"name": "离职",}],
      dialogVisible3:false,
      dialogVisiblepos:false,
      dialogVisiblework:false,
      dialogVisibledep:false,
      dialogVisiblelevel:false,

    }
  },
  mounted(){
    this.initEmpMoves();
    this.initData();
    this.initPositions();
  },
  methods:{
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
            this.initEmpMoves();

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
      Object.assign(this.updateMove,data);
      this.dialogVisible3=true;
    },

    showEditViewPos(index,data){
      Object.assign(this.updateMove,data);
      this.dialogVisiblepos=true;
    },
    showEditViewLevel(index,data){
      Object.assign(this.updateMove,data);
      this.dialogVisiblelevel=true;
    },
    showEditViewDep(index,data){
      Object.assign(this.updateMove,data);
      this.dialogVisibledep=true;
    },
    showEditViewWork(index,data){
      Object.assign(this.updateMove,data);
      this.dialogVisiblework=true;
    },
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/system/basic/department/all').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
    },
    showEditEmpView(data) {
      this.initPositions();
      this.title = '编辑员工信息';
      this.emp = data;
      this.inputDepName = data.dname;
      this.dialogVisible = true;
    },
    //更新职位
    doUpdate(){
      this.putRequest("/personnel/remove/updepartment",this.updateMove).then(resp=>{
        if (resp){
          this.initEmpMoves();
          this.updateMove.name='';
          this.dialogVisible3=false;
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
            this.initEmpMoves();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initEmpMoves(){
      this.getRequest("/personnel/remove/").then(resp=>{
        if (resp) {
          this.empmoves=resp;
        }
      })
    }
  }

}
</script>

<style >
.updatePosInput{
  width: 200px;
  margin-left: 8px;

}
</style>
