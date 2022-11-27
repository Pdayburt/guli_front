<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item size="small">
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item size="small">
        <el-select v-model="courseQuery.status" clearable placeholder="状态">
          <el-option :value="'Draft'" label="未发布"/>
          <el-option :value="'Normal'" label="已发布"/>
        </el-select>
      </el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
      <el-button size="small" type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table
      border
      :data="courseListQueried"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="课程名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="price"
        label="课程售价"
        width="100">
      </el-table-column>
      <el-table-column
        prop="lessonNum"
        label="总课程数"
        width="100">
      </el-table-column>
      <el-table-column
        label="状态"
        width="130">
        <template slot-scope="scope">
          {{scope.row.status === 'Draft' ?"未发布":"已发布"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">


          <router-link :to="'/courseManager/info/'+scope.row.id">
            <el-button
              size="mini"
              type="primary"
            >编辑课程基本信息</el-button>
          </router-link>

          <router-link :to="'/courseManager/chapter/'+scope.row.id">
            <el-button
              size="mini"
              type="primary"
            >编辑课程大纲</el-button>
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
      @current-change="getCourseList"
    />
  </div>
</template>

<script>
import course from '../../../api/edu/course'
export default {
  name: 'list',
  data(){
    return{

      courseListQueried:null,
      current:1,
      size:5,
      total:0,
      courseQuery:{}
    }
  },
  created() {

    this.getCourseList()

  },
  methods:{

    removeById(id){
      this.$confirm('此操作将永久删除课程信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.removeCourseById(id)
          .then(Response=>{
            this.$message({
              type:'success',
              message:"删除成功"
            })
            this.getCourseList(this.current)
          })
      })
    },

    getCourseList(current=1) {
      this.current=current
      course.getCourseByCondition(this.current,this.size,this.courseQuery)
        .then(Response=>{
          console.log(Response)
          this.courseListQueried=Response.data.rows
          this.total=Response.data.total
        })
        .catch(error=>{
          console.log(error)
        })
    },
    resetData(){
      this.courseQuery={}
      this.getCourseList()
    }

  }
}
</script>

<style scoped>

</style>
