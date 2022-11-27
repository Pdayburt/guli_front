  <template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item size="small">
        <el-input v-model="teacherQuery.name" placeholder="讲师名" />
      </el-form-item>
      <el-form-item size="small">
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间" size="small">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
         />
      </el-form-item>
      <el-form-item size="small">
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
      <el-button size="small" type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table
      border
      :data="teacherListQueried"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="intro"
        label="介绍"
        width="130">
      </el-table-column>
      <el-table-column
        label="头衔"
        width="130">
        <template slot-scope="scope">
          {{scope.row.level === 1?"高级讲师":"首席讲师"}}
        </template>
      </el-table-column>

      <el-table-column
        prop="avatar"
        label="头像">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="170">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">

          <router-link :to="'/teacherManager/edit/'+scope.row.id">
            <el-button
              size="mini"
              type="primary"
            >修改</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getTeacherList"
    />
  </div>
  </template>

  <script>
  import teacher from '../../../api/edu/teacher'
  export default {
    name: 'list',
    data(){
      return{

        teacherListQueried:null,
        current:1,
        size:5,
        total:0,
        teacherQuery:{}
      }
    },
    created() {

      this.getTeacherList()

    },
    methods:{

      removeById(id){
        this.$confirm('此操作将永久删除讲师信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacher.removeById(id)
            .then(Response=>{
                this.$message({
                  type:'success',
                  message:"删除成功"
                })
                this.getTeacherList(this.current)
            })
        })
      },

      getTeacherList(current=1) {
        this.current=current
        teacher.getTeacherList(this.current,this.size,this.teacherQuery)
                .then(Response=>{
                  console.log(Response)
                  this.teacherListQueried=Response.data.rows
                  this.total=Response.data.total
                })
                .catch(error=>{
                  console.log(error)
                })
      },
      resetData(){
        this.teacherQuery={}
        this.getTeacherList()
      }

    }
  }
  </script>

  <style scoped>

  </style>
