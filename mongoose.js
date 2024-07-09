const mongoose = require('mongoose');



const filesh= new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: false },
    mime_type: { type: String, required: true },
  
  
  
  })
  const RandomModel = mongoose.model('RandomModel', filesh);
module.exports=RandomModel