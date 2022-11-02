const express = require("express")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require("knex")
const register = require("./controllers/register")
const signin = require("./controllers/signin")
const image = require("./controllers/image")
const profile = require("./controllers/profile")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
})

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("success")
})
app.post("/signin", signin.handleSignin(db, bcrypt))
app.post("/register", register.handleRegister(db, bcrypt))
app.get("/profile/:id", profile.handleProfileGet(db))
app.put("/image", image.handleImage(db))
app.post("/imageurl", (req, res) => image.handleApiCall(req, res))
// for heroku
app.listen(process.env.PORT || 3000, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})
