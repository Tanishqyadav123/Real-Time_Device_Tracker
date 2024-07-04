const express = require("express")
require("dotenv").config()
const socketio = require("socket.io")
const http = require("http");
const path = require("path");

const app = express();
let port = process.env.PORT


// Pass the express server app into the createServer()

const server = http.createServer(app)

const io = socketio(server)

// Setting up the ejs :-
app.set("view engine" , "ejs")

// Setting up the public folder
app.use(express.static(path.join(__dirname , "public")))


io.on("connection" , (socket) =>{
      console.log("connected" , socket.id)
       
      socket.on("send-location" , (LocationData) =>{
           
           //  emit the event of receive the location to update the location to new Location :-
           io.emit("receive-location" , {id : socket.id , ...LocationData})
      })

      socket.on("disconnect" , () =>{
           console.log("Disconnected")
           io.emit("remove-marker" , {id : socket.id})
      })
})

app.get("/" , function(req , res) {
      res.render("index")
})

server.listen(port , () => {
    console.log(`Server is running on the port ${port}`)
})



