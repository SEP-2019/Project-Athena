import Api from './Api'

export default {

  // POST REQUESTS
  post (username, password, email, student_id) {
  	var data = {
        "username": username,
        "password": password,
        "email": email,
        "student_id": student_id
    }
    return Api().post('users/addStudentUser', data)
  }

  compare_course(course_list){
    var data = {
        "completed_courses": course_list
    }
    return Api().post('users/completedCourses/comparison', data)
  }

  login(username, password){
    var data = {
        "username": username,
        "password": password
    }
    return Api().post('users/login', data)
  }


  // GET REQUESTS
  get(id) {
    var param = {
        "params": {
          "studentID": id
        }
    }
    return Api().get('users/getStudentData', param)
  }

  completed_courses(id){
   var param = {
        "params": {
          "studentID": id
        }
    }
   return Api().post('users/getCompletedCourses', param)
  }

}