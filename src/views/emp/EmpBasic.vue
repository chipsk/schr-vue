<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                    clearable
                    @clear="initEmps"
                    style="width: 350px;margin-right: 10px" v-model="keyword"
                    @keydown.enter.native="initEmps" :disabled="showAdvanceSearchView"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="initEmps" :disabled="showAdvanceSearchView">
            搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-upload
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :on-error="onError"
              :disabled="importDataDisabled"
              style="display: inline-flex;margin-right: 8px"
              action="/employee/basic/import">
            <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
              {{importDataBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" @click="exportData" icon="el-icon-download">
            导出数据
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
            添加用户
          </el-button>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchView"
             style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
          <el-row>
            <el-col :span="5">
              政治面貌:
              <el-select v-model="searchValue.politic" placeholder="政治面貌" size="mini"
                         style="width: 130px;">
                <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位:
              <el-select v-model="searchValue.posname" placeholder="职位" size="mini" style="width: 130px;">
                <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称:
              <el-select v-model="searchValue.joblevel" placeholder="职称" size="mini"
                         style="width: 130px;">
                <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="5">
              所属部门:
              <el-popover
                  placement="right"
                  title="请选择部门"
                  width="200"
                  trigger="manual"
                  v-model="popVisible2">
                <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                         @node-click="searvhViewHandleNodeClick"></el-tree>
                <div slot="reference"
                     style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px"
                     @click="showDepView2">{{inputDepName}}
                </div>
              </el-popover>
            </el-col>
            <el-col :span="10">
              入职日期:
              <el-date-picker
                  v-model="searchValue.beginDateScope"
                  type="daterange"
                  size="mini"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="4">
              <el-button size="mini">取消</el-button>
              <el-button size="mini" icon="el-icon-search" type="primary" @click="initEmps('advanced')">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          stripe
          border
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="userID"
            fixed
            align="left"
            label="工号"
            width="90">
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="userSex"
            label="性别"
            align="left"
            width="50">
        </el-table-column>
        <el-table-column
            prop="idCard"
            width="200"
            align="left"
            label="身份证号码">
        </el-table-column>
        <el-table-column
            prop="politic"
            width="80"
            align="left"
            label="政治面貌">
        </el-table-column>
        <el-table-column
            prop="phone"
            width="120"
            label="手机号">
        </el-table-column>
        <el-table-column
            prop="address"
            width="200"
            label="地址">
        </el-table-column>
        <el-table-column
            prop="basisSalary"
            width="80"
            label="基础薪资">
        </el-table-column>
        <el-table-column
            prop="workstatus"
            label="工作状态">
        </el-table-column>
        <el-table-column
            prop="e_mail"
            width="180"
            align="left"
            label="电子邮件">
        </el-table-column>
        <el-table-column
            prop="departmentid"
            width="50"
            align="left"
            label="部门编号">
        </el-table-column>
        <el-table-column
            prop="dname"
            width="120"
            align="left"
            label="部门">
        </el-table-column>
        <el-table-column
            prop="positionid"
            width="50"
            align="left"
            label="职位编号">
        </el-table-column>
        <el-table-column
            prop="posname"
            width="120"
            align="left"
            label="职位">
        </el-table-column>
        <el-table-column
            prop="joblevel"
            width="60"
            align="left"
            label="职称">
        </el-table-column>
        <el-table-column
            width="100"
            align="left"
            label="合同期限">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTime}}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            prop="beginworkDate"
            width="100"
            label="合同生效日期">
        </el-table-column>
        <el-table-column
            prop="endworkDate"
            width="100"
            label="合同终止日期">
        </el-table-column>
        <el-table-column
            prop="birthday"
            width="100"
            align="left"
            label="出生日期">
        </el-table-column>
        <el-table-column
            fixed="right"
            width="200"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form :model="emp" :rules="rules" ref="empForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="userID">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.userID"
                          placeholder="请输入工号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="username">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.username"
                          placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别:" prop="userSex">
                <el-radio-group v-model="emp.userSex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politic">
                <el-select v-model="emp.politic" placeholder="政治面貌" size="mini" style="width: 200px;">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="e_mail">
                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                          v-model="emp.e_mail" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
            </el-col>
          <el-row>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address">
                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                          v-model="emp.address" placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="positionid">
                <el-select v-model="emp.positionid" placeholder="职位" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="joblevel">
                <el-select v-model="emp.joblevel" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentid">
                <el-popover
                    placement="right"
                    title="请选择部门"
                    width="200"
                    trigger="manual"
                    v-model="popVisible">
                  <el-tree default-expand-all :data="allDeps" :props="defaultProps" :expand-on-click-node="false"
                           @node-click="handleNodeClick"></el-tree>
                  <div slot="reference"
                       style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                       @click="showDepView">{{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                          v-model="emp.phone" placeholder="电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px;"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginworkDate">
                <el-date-picker
                    v-model="emp.beginworkDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 130px;"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同终止日期:" prop="endworkDate">
                <el-date-picker
                    v-model="emp.endworkDate"
                    size="mini"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 150px;"
                    placeholder="合同终止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                          v-model="emp.idCard" placeholder="请输入身份证号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddEmp">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "EmpBasic",
  data() {
    return {
      searchValue: {
        posname: null,
        dname: null,
        beginDateScope: null
      },
      title: '',
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      showAdvanceSearchView: false,
      allDeps: [],
      emps: [],
      loading: false,
      popVisible: false,
      popVisible2: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      keyword: '',
      size: 10,
      joblevels: [],
      politicsstatus: [],
      positions: [],
      inputDepName: '所属部门',
      emp: {
        userID: "100111",
        username: "zzl",
        userSex: "男",
        IDcard: "36078120010514003x",
        politic: "团员",
        phone: 1,
        address: "江西师范大学",
        basisSalary: 13000,
        workstatus: "在职",
        E_mail: "1146942367@qq.com",
        departmentid: 9,
        dname: "校办公室",
        joblevel: "助教",
        contractTime: "2019-12-31",
        beginworkDate: "2020-12-31",
        endworkDate: "2021-12-31",
        birthday: "2001-05-14",
        positionid: "3",
        posname: "院长"
      },
      defaultProps: {
        children: 'children',
        label: 'name'
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
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
    searvhViewHandleNodeClick(data) {
      this.inputDepName = data.name;
      this.searchValue.departmentId = data.id;
      this.popVisible2 = !this.popVisible2
    },
    // eslint-disable-next-line no-unused-vars
    onError(err, file, fileList) {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
    },
    // eslint-disable-next-line no-unused-vars
    onSuccess(response, file, fileList) {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
      this.initEmps();
    },
    beforeUpload() {
      this.importDataBtnText = '正在导入';
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataDisabled = true;
    },
    exportData() {
      window.open('/employee/basic/export', '_parent');
    },
    emptyEmp() {
      this.emp = {
        userID: "",
        username: "",
        userSex: "",
        IDcard: "",
        politic: "",
        phone: 1,
        address: "",
        basisSalary: 13,
        workstatus: "",
        E_mail: null,
        departmentid: 9,
        joblevel: "",
        contractTime: "",
        beginworkDate: "",
        endworkDate: "",
        birthday: "",
        positionid: "",
      }
      this.inputDepName = '';
    },
    showEditEmpView(data) {
      this.initPositions();
      this.title = '编辑员工信息';
      this.emp = data;
      this.inputDepName = data.dname;
      this.dialogVisible = true;
    },
    deleteEmp(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/employee/basic/" + data.id).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddEmp() {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.putRequest("/employee/basic/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.postRequest("/employee/basic/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      }
    },
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentid = data.id;
      this.popVisible = !this.popVisible
    },
    showDepView() {
      this.popVisible = !this.popVisible
    },
    showDepView2() {
      this.popVisible2 = !this.popVisible2
    },
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    getMaxWordID() {
      this.getRequest("/employee/basic/maxuserID").then(resp => {
        if (resp) {
          this.emp.userID = resp.obj;
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
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initEmps('advanced');
    },
    showAddEmpView() {
      this.emptyEmp();
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    initEmps(type) {
      this.loading = true;
      let url = '/employee/basic/?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.politic) {
          url += '&politic=' + this.searchValue.politic;
        }
        if (this.searchValue.joblevel) {
          url += '&joblevel=' + this.searchValue.joblevel;
        }
        if (this.searchValue.posname) {
          url += '&posname=' + this.searchValue.posname;
        }
        if (this.searchValue.dname) {
          url += '&dname=' + this.searchValue.dname;
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
          this.emps = resp.data;
          this.total = resp.total;
        }
      });
    }
  }
}
</script>

<style>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>
