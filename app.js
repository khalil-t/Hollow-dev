const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app =express()
require('dotenv').config(); // Load environment variables from .env file

const RandomModel =require('./mongoose');
const { error } = require('console');
mongoose.connect(process.env.MONGO_URI,{
}).then(()=>{console.log("ok")}).catch(()=>{console.log("error")});



// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: async (req, file, cb) => {
    const id = new mongoose.Types.ObjectId().toString(); // Generate a new ObjectId
    req.fileId = id; // Store the ID in the request object
    cb(null, `${id}-${file.originalname}`);
  },
});

const upload = multer({ storage });
app.use(express.json());





app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { description } = req.body;

    const file = new RandomModel({
      _id: req.fileId, // Use the generated ID as the document ID
      name: req.file.filename, // Use the generated filename
      size: req.file.size,
      description,
      mime_type: req.file.mimetype,
    });

    await file.save();
    res.json(file);
    console.log("file posted")
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





app.get('/files/:id', async(req, res)=>{

try {

  const find = await RandomModel.findById(req.params.id) 
  if(!find){res.json({error: 'File not found'} )
  
    console.log("sucess")
  }
  else{
res.json(find)
  }

}
catch(err){console.log("error")}

})






app.put('/files/:id', async(req, res)=>{
  try{  const file = await RandomModel.findByIdAndUpdate(req.params.id, req.body, { new: true });


  if(!file) {res.json({error:err.message})}
else{res.json(file)}}catch(error){console.log("error")}


})

app.delete('/files/:id',async(req, res)=>{
try{

  
const file = await RandomModel.findByIdAndDelete(req.params.id)
if(!file){console.log("not found")}
else{res.json(file)

console.log("file deleted")

}
}
catch(error){console.log("error")
}
})






app.get('/download/:id', async (req, res) => {
  try {
      const file = await RandomModel.findById(req.params.id);
      if (!file) {
          return res.json({ error: 'File not found' });
      }
      const filePath = path.join(__dirname, 'uploads', file.name); 
      console.log(file.name)// Modify this line
      res.download(filePath);
  } catch (err) {
      res.json({ error: err.message });
  }
});






app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});


