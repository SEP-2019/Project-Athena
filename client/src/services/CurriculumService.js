import Api from './Api'

export default {
  // POST REQUESTS
  post (name, type, department, num_electives, cores_list, tech_comps_list, comps_list) {
    var data = {
        "name": name,
        "type": type,
        "department" : department,
        "numOfElectives" : num_electives,
        "cores" : cores_list,
        "techComps" : tech_comps_list,
        "comps" : comps_list
    }
    return Api().post('curriculums/createCurriculum', data)
  },

  // GET REQUESTS
  get(year) {
    //?? 
  }
}