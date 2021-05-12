//dependencies
//get .env variables
require("dotenv").config()
//pull PORT from the .env, defaulting the value
const { PORT = 3000, MONGODB_URL } = process.env
//imnport express
const express = require("express")
//our express app object
const app = express()
//import mongoose
const mongoose = require("mongoose")
//import middleware
const cors = require("cors")
const morgan = require("morgan")

//database connection
//establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//connection events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from mongo"))
.on("error", (error) => console.log(error))

//models
const PeopleSchema = new mongoose.Schema({
    name: String, 
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

//middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

//routes
//create a test route
app.get("/", (req, res)=>{
    res.send("Hello World")
})

//people index route - displays all people
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//People create route
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//People update route
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch(error) {
        res.status(400).json(error)
    }
})

//People Delete route
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (errors) {
        res.status(400).json(error)
    }
})

//listener
app.listen(PORT, () => console.log(`listening on port: ${PORT}`))