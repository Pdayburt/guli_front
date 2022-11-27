import request from '@/utils/request'

export default {

  removeCourseById(courseId){
    return request({
      url:`/eduservice/course/removeById/${courseId}`,
      method:'delete',
    })
  },


  getCourseByCondition(current,size,courseQuery){
    return request({
      url:`/eduservice/course/getCourseByCondition/${current}/${size}`,
      method:'post',
      data:courseQuery
    })
  },

  getCourseList(){
    return request({
      url:`/eduservice/course/getCourseList`,
      method:'get',
    })
  },
    addCourseInfo(courseInfo){

      return request({
        url:`/eduservice/course/addCourseInfo`,
        method:'post',
        data:courseInfo
      })
    },
  getPublishCourseInfo(courseId){
    return request({
      url:`/eduservice/course/getPublishCourseInfo/${courseId}`,
      method:'get',
    })
  },
  getCourseInfo(courseId){
    return request({
      url:`/eduservice/course/getCourseInfo/${courseId}`,
      method:'get',
    })
  },

  updateCourseInfo(courseInfo){
      return request({
        url:`/eduservice/course/updateCourseInfo`,
        method:'post',
        data:courseInfo
      })
    },

  publishCourse(courseId){
    return request({
      url:`/eduservice/course/publishCourse/${courseId}`,
      method:'post',
      data:courseId
    })
  }




}
