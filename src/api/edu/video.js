import request from '@/utils/request'

export default {

  deleteAliyunVideo(videoId){
    return request({
      url:`/eduvod/video/deleteVideo/${videoId}`,
      method:'delete',
    })
  },
  addVideo(video){

    return request({
      url:`/eduservice/video/addVideo/`,
      method:'post',
      data:video
    })
  },

  updateVideo(video){

    return request({
      url:`/eduservice/video/updateVideo/`,
      method:'post',
      data:video
    })
  },

  deleteVideo(videoId){

    return request({
      url:`/eduservice/video/deleteVideo/${videoId}`,
      method:'delete',
    })
  },

  getVideo(videoId){

    return request({
      url:`/eduservice/video/getVideo/${videoId}`,
      method:'get',
    })
  },




}
