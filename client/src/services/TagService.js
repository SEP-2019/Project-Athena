import Api from './Api'

export default {
  // get all tags
  index(){
   return Api().get('tags/getAllTags')
  }
}