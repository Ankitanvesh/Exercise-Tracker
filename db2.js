const mongoose= require('mongoose');
const Schema = mongoose.Schema ;
const bookschema = new Schema({
description: String,
duration: Number,
date: String
});
const modulo= new Schema({
'username' : String,
  'userId' : String,
    'date' : String,
  'logs':[bookschema],
  'count' : Number
});

const Modelss = mongoose.model('cmod',modulo);
module.exports = Modelss ;