import Api from './Api'

export default {
  // POST REQUESTS
  post_complete (course_list, student_id) {
    var data = {
        "courses": course_list,
        "student_id": student_id
    }
    return Api().post('courses/addCompletedCourses', data)
  },

  update(course_code, new_title, new_tags_list){
    var data = {
        "course": course_code,
        "new_title": new_title,
        "new_tags": new_tags_list
    }
    return Api().post('courses/updateCourse', data)
  },

  update_phased_out(course_code){
    var data = {
         "course_code" : course_code
    }
    return Api().post('courses/phaseOutCourses', data)
  },

  update_prereq(preqreq_list){
    var data = {
       "prereq": preqreq_list
    }
    return Api().post('courses/addPrereq', data)
  },

  update_coreq(coreq_list){
     var data = {
       "coreq": coreq_list
    }
    return Api().post('courses/addCoreq', data)
  },

  add_to_curriculum(course_type, course_code, curriculum){
     var data = {
       "courseType": course_type, 
       "courseCode": course_code, 
       "curriculum": curriculum
    }
    return Api().post('courses/assignCourseToCurriculum', data)
  },

  // GET REQUESTS
  get(tag) {
    var param = {
        "params": {
          "tag": tag
        }
    }
    return Api().get('courses/getCourseByTag', param)
  },

  // get all courses
  index(){
   return Api().get('courses/getAllCourses')
  }
}