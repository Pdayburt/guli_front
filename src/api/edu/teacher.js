import request from '@/utils/request'

export default {


  queryAllTeacher(){

    return request({
      url:`/eduservice/teacher/findAll`,
      method:'get',
    })
  },
    getTeacherList(current,size,teacherQuery){

      return request({
        url:`/eduservice/teacher/pageTeacherCondition/${current}/${size}`,
        method:'post',
        data:teacherQuery
      })
    },

    removeById(id){
      return request({
        url:`/eduservice/teacher/remove/${id}`,
        method:'delete'
      })
    },

    saveTeacher(teacher){
      return request({
        url:`/eduservice/teacher/add`,
        method:'post',
        data:teacher
      })
    } ,

    getTeacherById(id){
      return request({
        url:`/eduservice/teacher/queryById/${id}`,
        method:'get',
      })
    },

    updateTeacherById(teacher){
      return request({
        url:`/eduservice/teacher/update`,
        method:'post',
        data:teacher
      })
    }






}
