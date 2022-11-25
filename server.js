const express = require("express")
require("dotenv").config()

const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
// const { Pool } = require("pg")
const register = require("./controllers/register")
const signin = require("./controllers/signin")
const image = require("./controllers/image")
const profile = require("./controllers/profile")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const knex = require("knex")
const db = knex({
  client: "pg",
  connection: {
    host: "dpg-cdvu5io2i3mkucbpgdf0-a.oregon-postgres.render.com",
    user: "smartbrain_hycf_user",
    database: "smartbrain_hycf",
    password: "oThegcGoKHzElfwvnE7ktcd9BLXw8fTh",
    port: 5432,
    ssl: true,
  },
})

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data)
  })

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send(db.users)
})
app.post("/signin", signin.handleSignin(db, bcrypt))
app.post("/register", (req, res) => {
  const { email, name, password } = req.body
  db("users")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then(console.log)
  res.json(users[users.length - 1])
  // register.handleRegister(req, res, db, bcrypt)
})
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db)
})
app.put("/image", (req, res) => image.handleImage(req, res, db))
app.post("/imageurl", (req, res) => image.handleApiCall(req, res))

const PORT = 5432 || 3000
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
