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
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.SSL,
  },
})

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send(db.users)
})
app.post("/signin", signin.handleSignin(db, bcrypt))
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt)
})
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db)
})
app.put("/image", (req, res) => image.handleImage(req, res, db))
app.post("/imageurl", (req, res) => image.handleApiCall(req, res))

const PORT = process.env.DB_PORT || 3000
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
