const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const db = require("./db")
const userModel = require("./models/user")

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res)=> {
    res.send("src")
})


app.post("/save-user", async (req, res)=>{
    const {name, email} = req.body
    const findUser = await userModel.findOne({email:email})
    if(findUser){
        return res.status(200).send("100");
    }
    const newUser = await userModel.create({
        name,
        email,
        highscore: 0
    })
    res.send("User Saved")
})

app.listen(process.env.PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT}`)
})
