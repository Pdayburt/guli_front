  <template>

    <div class="app-container">

      <h2 style="text-align: center;">发布新课程</h2>

      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="最终发布"/>
      </el-steps>

      <el-form label-width="120px">

        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">
          <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="一级分类"
            @change="subjectLevelOneChanged">
            <el-option
              v-for="subject in subjectOneList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>

          <!-- 二级分类 -->
          <el-select v-model="courseInfo.subjectId"
                     clearable @change="updateFun"
                     placeholder="二级分类"
                      >
            <el-option
              v-for="subject in subjectTwoList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>


        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
          <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>


        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面-->
        <el-form-item label="课程封面">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
          </el-upload>
        </el-form-item>


        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  import course from '../../../api/edu/course'
  import teacher from '../../../api/edu/teacher'
  import Subject from '../../../api/edu/subject'
  import Tinymce from '../../../components/Tinymce'
  export default {
    components: { Tinymce },
    data() {
      return {

        courseId:'',
        BASE_API:process.env.BASE_API,
        subjectTwoList:[],
        subjectOneList:[],
        teacherList:[],
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo:{
          title: '',
          subjectId: '',
          subjectParentId:'',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
        }
      }
    },

    created() {
      if (this.$route.params.id) {
        this.courseId=this.$route.params.id
        this.getCourseInfo()
      }else {
        this.getAllTeacher()
        this.getOneSubject()
        this.courseInfo={}
        this.courseInfo.cover='/static/01.jpg'
      }
    },

    methods: {
      updateFun(){
        this.$forceUpdate();
      },
      getCourseInfo() {
        course.getCourseInfo(this.courseId)
          .then(res=>{
            this.courseInfo=res.data.courseInfoVo
            Subject.getSubjectList()
              .then(res=>{
                this.subjectOneList = res.data.list

                for (let i = 0; i < this.subjectOneList.length; i++) {
                  let onSubject = this.subjectOneList[i]
                  if ( this.courseInfo.subjectParentId == onSubject.id) {
                     this.subjectTwoList= onSubject.children
                  }
                }
                this.getAllTeacher()
              })
          })
      },

      handleAvatarSuccess(res,file){
        // console.log(res)// 上传响应
        // console.log(URL.createObjectURL(file.raw))// base64编码
        this.courseInfo.cover = res.data.url
      },
      beforeAvatarUpload(file){

        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      subjectLevelOneChanged(value) {

        for (let i = 0; i < this.subjectOneList.length; i++) {
          let subjectOneListElement = this.subjectOneList[i]
          if (subjectOneListElement.id == value){
            this.subjectTwoList=subjectOneListElement.children;
            this.courseInfo.subjectId='';
          }

        }

      },

      getOneSubject(){
        Subject.getSubjectList()
          .then(Response=>{
            this.subjectOneList=Response.data.list;
          })
      },

      getAllTeacher(){
        teacher.queryAllTeacher()
          .then(Response=>{
            this.teacherList=Response.data;
          })
      },
      addCourseInfo() {
        course.addCourseInfo(this.courseInfo).then(Response=>{
          this.$message({
            type: 'success',
            message: '添加课程成功'
          })
          this.$router.push({ path: '/courseManager/chapter/'+Response.data.courseId })
        })
      },
      updateCourseInfo(){
        course.updateCourseInfo(this.courseInfo)
          .then(res=>{
            this.$message({
              type: 'success',
              message: '修改课程成功'
            })
            this.$router.push({ path: `/courseManager/chapter/+${this.courseId}`})
          })
      },
      saveOrUpdate() {
        if (this.$route.params.id){
          this.updateCourseInfo()
        }else {
          this.addCourseInfo()
        }


      }
    }
  }
  </script>
  <style scoped>
  .tinymce-container {
    line-height: 29px;
  }
  </style>
