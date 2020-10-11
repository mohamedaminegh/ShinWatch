const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(data,file){
let errors = {};
data.description = !isEmpty(data.description) ? data.description : '';
data.content = !isEmpty(data.content) ? data.content : '';
data.title = !isEmpty(data.title) ? data.title : '';

    if (isEmpty(data.type)) {
        errors.type = 'Type field is required';
    } 
    if(Validator.isEmpty(data.content) && isEmpty(file)){
        errors.content='Content field is required';
    }
    if (Validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
      }
      if (Validator.isEmpty(data.title)) {
        errors.title = 'Title field is required';
      }
      if ((data.type !== "Image") && (data.type !== "Video") ) {
        errors.type = 'Type invalid';
    } 

return{
    errors,
    isValid: isEmpty(errors)
}
}