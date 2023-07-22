/**
 * Express is a fast, unopinionated, minimalist web framework for Node.js.
 * @see {@link https://expressjs.com/}
 */
const express = require("express")
/**
 * HTTP request logger middleware for Node.js.
 * @see {@link https://www.npmjs.com/package/morgan}
 */
const morgan = require("morgan")
/**
 * Loads environment variables from a .env file into process.env.
 * @see {@link https://www.npmjs.com/package/dotenv}
 */
require("dotenv").config()
/**
 * Library for hashing passwords using bcrypt algorithm.
 * @see {@link https://www.npmjs.com/package/bcrypt-nodejs}
 */
const bcrypt = require("bcrypt-nodejs")
/**
 * Cross-origin resource sharing (CORS) middleware.
 * @see {@link https://www.npmjs.com/package/cors}
 */
const cors = require("cors")
/**
 * Controller for user registration.
 * @see {@link ./controllers/register}
 */
const register = require("./controllers/register")
/**
 * Controller for user sign in.
 * @see {@link ./controllers/signin}
 */
const signin = require("./controllers/signin")
/**
 * Controller for handling images.
 * @see {@link ./controllers/image}
 */
const image = require("./controllers/image")
/**
 * Controller for user profile.
 * @see {@link ./controllers/profile}
 */
const profile = require("./controllers/profile")
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
/**
 * PostgreSQL client library.
 * @see {@link https://www.npmjs.com/package/knex}
 */
const knex = require("knex")
/**
 * PostgreSQL database connection configuration.
 */
const db = knex({
  client: "pg",
  connection: {
    host: "dpg-cdvu5io2i3mkucbpgdf0-a.oregon-postgres.render.com",
    user: "smartbrain_hycf_user",
    database: "smartbrain_hycf",
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true,
  },
})

const app = express()
app.use(morgan("tiny"))
/**
 * Enable Cross-Origin Resource Sharing (CORS) for all routes.
 */
app.use(cors({ origin: "*", methods: "*" }))
/**
 * Parse JSON bodies for incoming requests.
 */
app.use(express.json())
/**
 * Default route that returns the list of users in the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/", (req, res) => {
  res.json(db.users)
})
/**
 * Route for user sign in.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.post("/signin", signin.handleSignin(db, bcrypt))
/**
 * Route for user registration.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt)
})
/**
 * Route for retrieving user profile.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db)
})
/**
 * Route for updating user image.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.put("/image", (req, res) => image.handleImage(req, res, db))
/**
 * Route for handling image URL and making API call.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.post("/imageurl", (req, res) => image.handleApiCall(req, res))
/**
 * The port on which the server listens for incoming requests.
 * @type {number}
 */
const PORT = 5432 || 3000
/**
 * Start the server and listen on the specified port.
 */
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
