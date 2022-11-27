<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 章节 -->
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliyun'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
          <!-- TODO -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button  type="primary" @click="saveOrUpdateVideo">确 定</el-button>
<!--        :disabled="saveVideoBtnDisabled"-->
      </div>
    </el-dialog>
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="remove(chapter.id)">删除</el-button>
            </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import chapter from '../../../api/edu/chapter'
import video from '../../../api/edu/video'

export default {


  data() {
    return {
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      video:{
        title: '',
        sort: 0,
        free:0,
        videoSourceId:'',
        videoOriginalName:''
      },
      dialogVideoFormVisible:false,
      chapter:{
        title:'',
        sort:0
      },
      dialogChapterFormVisible:false,
      courseId:'',
      chapterVideoList:[],
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },

  created() {
    if (this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getAllChapterVideo()
    }

  },

  methods: {

    handleVodRemove(){
      video.deleteAliyunVideo(this.video.videoSourceId)
            .then(res=>{
              this.$message({
                type:'success',
                message:'删除视频成功'
              })
              this.fileList=[]
              this.video.videoSourceId=''
              this.video.videoOriginalName = ''
            })
    },
    beforeVodRemove(files, fileList){
      return this.$confirm(`确定要删除${files.name}?`)
    },

    handleVodUploadSuccess(response,file,fileList){
      this.video.videoSourceId=response.data.videoId
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed(){
      this.$message.warning("想要重新上传视频，请先删除已上传的视频")
    },

    //====================小节操作==========================
    openVideo(chapterId){
      this.video = {}
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId
      this.fileList=[]

    },
    openEditVideo(id){
      this.dialogVideoFormVisible = true
      video.getVideo(id)
        .then(res=>{
          this.video = res.data.video
        })
    },
    updateVideo(){
      video.updateVideo(this.video)
        .then(res=>{
          this.dialogVideoFormVisible = false
          this.$message({
            type:'success',
            message:'修改小节成功'
          })
          this.getAllChapterVideo();
        })
    },

    removeVideo(id){
      this.$confirm('此操作将永久删除讲师信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id)
          .then(Response=>{
            this.$message({
              type:'success',
              message:"删除成功"
            })
            this.getAllChapterVideo()
          })

      })
    },


    addVideo(){
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(res=>{
          this.dialogVideoFormVisible = false
          this.$message({
            type:'success',
            message:'添加小节成功'
          })
          this.getAllChapterVideo();
        })
    },
    saveOrUpdateVideo(){
      if (this.video.id){
        this.updateVideo()
      }else {
        this.addVideo()
      }

    },








    //====================章节操作==========================
    remove(chapterId){
      this.$confirm('此操作将永久删除讲师信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
          .then(Response=>{
            this.$message({
              type:'success',
              message:"删除成功"
            })
            this.getAllChapterVideo()
          })
      })
    },

    openEditChapter(chapterId){

      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId)
          .then(res=>{
            this.chapter = res.data.chapter
          })
    },

    openChapterDialog(){
      this.dialogChapterFormVisible = true
      this.chapter = {}
    },
    addChapter(){
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(res=>{
          this.dialogChapterFormVisible = false
          this.$message({
            type:'success',
            message:'添加章节成功'
          })
          this.getAllChapterVideo();
        })
    },
    updateChapter(){
      chapter.updateChapter(this.chapter)
          .then(res=>{
            this.dialogChapterFormVisible = false
            this.$message({
              type:'success',
              message:'修改章节成功'
            })
            this.getAllChapterVideo();
          })
    },

    saveOrUpdate(){
      if (this.chapter.id){
        this.updateChapter()
      }else {
        this.addChapter()
      }


    },

    getAllChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(Response=>{
        this.chapterVideoList = Response.data.allChapterVideo
      })
    },
    previous() {
      this.$router.push({ path: `/courseManager/info/${this.courseId}`})
    },

    next() {
      this.$router.push({ path: `/courseManager/publish/${this.courseId}` })
    }
  }
}
</script>
<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
