<template>
  <div>
    <div>
      <el-table :data="emps" border stripe size="mini">
        <el-table-column type="selection" align="left" width="55"></el-table-column>
        <el-table-column prop="userID" label="工号" fixed width="120" align="left"></el-table-column>
        <el-table-column prop="username" label="姓名" fixed width="120" align="left"></el-table-column>
        <el-table-column prop="e_mail" label="电子邮件" width="200" align="left"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120" align="left"></el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="120" align="left"></el-table-column>
        <el-table-column prop="salaryAccount.name" label="所属部门账套" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popover
                placement="left"
                title="修改工资账套"
                @show="showPop(scope.row.salary)"
                @hide="hidePop(scope.row)"
                width="200"
                trigger="click">
              <div>
                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                  <el-option
                      v-for="item in salaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference" type="danger">修改工资账套</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      emps: [],
      total: 0,
      currentPage: 1,
      currentSize: 10,
      currentSalary: null,
      salaries: [],
      salary: {
        basisSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        socialPer: 0,
        socialBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0,
        name: ''
      },
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    sizeChange(size) {
      this.currentSize = size;
      this.initEmps();
    },
    currentChange(page) {
      this.currentPage = page;
      this.initEmps();
    },
    hidePop(data) {
      if (this.currentSalary) {
        this.putRequest('/salary/sobcfg1/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initEmps()
          }
        });
      }
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    initSalaries() {
      this.getRequest("/salary/sobcfg/salaryaccounts").then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    initEmps() {
      this.getRequest("/salary/sobcfg/?page=" + this.currentPage + '&size=' + this.currentSize).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
