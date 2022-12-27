require("dotenv").config() // need to put right at the top
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const port = 3000

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

// setup server
mongoose.set("strictQuery", true)
mongoose.connect('mongodb://127.0.0.1:27017/useDB')

// create schema with right one from mongoose schema class

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})
// need place it before user model and only encrypt password

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})
// user model

const User = new mongoose.model("User", userSchema)




app.get("/", (req, res)=>{
    res.render("home")
})
app.get("/login", (req, res)=>{
    res.render("login")
})
app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if(err) console.log(err);
        else res.render("secrets")
    })
})

app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    // check to see username and password from database matchs user input

    User.findOne({email: username}, function(err, foundUser){
        if (err) console.log(err);
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })

})


app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})


// level 1: create usrename and password
//level 2: encryption database password

