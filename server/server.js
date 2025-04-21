const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const connectDB = require("./db")
const userModel = require("./models/user")
const uuid4 = require("uuid4")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("src")
})

const startServer = async () => {
  await connectDB()

  app.post("/save-user", async (req, res) => {
    const { name, email } = req.body
    const findUser = await userModel.findOne({ email: email })
    if (findUser) {
      return res
        .status(200)
        .send(JSON.stringify({ status: "200", player: findUser }))
    }
    const newUser = await userModel.create({
      name,
      email,
      highscore: 0,
      uuid4: uuid4(),
    })
    res.send(JSON.stringify({ status: "200", player: newUser }))
  })

  app.post("/get-user", async (req, res) => {
    const { uuid4 } = req.body
    const findUser = await userModel.findOne({ uuid4: uuid4 })
    if (findUser) {
      return res
        .status(200)
        .send(JSON.stringify({ status: "200", player: findUser }))
    }
    res.send(JSON.stringify({ status: "404" }))
  })

  app.post("/UpdateScore", async (req, res) => {
    await userModel.updateOne(
      { email: req.body.email },
      { highscore: req.body.score }
    )
    res.send("100")
  })

  app.get("/leaderboard", async (req, res) => {
    let userData = await userModel.find({})
    userData.sort((a, b) => b.highscore - a.highscore)
    userData = userData.slice(0, 3)
    res.send(JSON.stringify(userData))
  })

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

startServer()
