const mongoose= require('mongoose');
const Schema = mongoose.Schema ;
const mod= new Schema({
'username' : String,
  'userId' : String
});

const Model = mongoose.model('cmon',mod);
module.exports = Model ;