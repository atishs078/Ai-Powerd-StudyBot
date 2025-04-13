const express = require('express')
const app = express()
const port = 5000
const userRoutes=require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes');
const suggestRoute = require('./routes/suggestContent')
const cahatDataRoutes = require ('./routes/chatDataRoutes')
const studyPlannerRoute = require('./routes/studyPlanner')
const cors = require('cors');
app.use(cors());

// const summarize= require ('./routes/summarizeController')
const mongoose = require('mongoose')
const connectDB = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/StudyMaterial?directConnection=true", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };
  connectDB()
  app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/user',userRoutes)
app.use('/api/chat', chatRoutes);
app.use('/api/chat', suggestRoute);
app.use('/api/chat', studyPlannerRoute);
app.use('api/chat', cahatDataRoutes);

// app.use('/api/summarize',summarize)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})