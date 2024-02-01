//importing modules
 require("./database");
require("mongoose")
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors")
const dotenv = require("dotenv");
const users = require("./routes/users")
const auth = require("./routes/auth");
const post = require("./routes/post");
const path = require("path")
const multer = require("multer")
const port = process.env.PORT || 8800
const app = express();
//using middleware
app.use(cors())
dotenv.config()
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"))
//using routes
app.use("/api/users",users)
app.use("/api/auth",auth)
app.use("/api/post",post)
//uploading route
app.use("/images",express.static(path.join(__dirname,"/public/images")))


const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images");
  },
  filename: (req,file,cb)=>{
    cb(null,req.body.name)
  },
})
const upload = multer({storage})

app.post("/api/upload",upload.single("file"),(req,res)=>{
  try {
    return res.status(200).json("post posted successfully")
  } catch (error) {
    
  }
})

//listening
app.listen(process.env.PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", process.env.PORT);
});
