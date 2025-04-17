const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const db = require("./db")
const userModel = require("./models/user")
const uuid4 = require("uuid4")

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
        highscore: 0,
        uuid4: uuid4()
    })
    res.send("User Saved")
})

app.get("/leaderboard", async(req, res)=> {
    let userData = await userModel.find({});
    userData.sort((a, b) => b.highscore - a.highscore)
    userData = userData.slice(0, 10)
    res.send(JSON.stringify(userData));
})

app.listen(process.env.PORT, ()=> {
    console.log(`Server started on port ${process.env.PORT}`)
})
