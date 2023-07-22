/**
 * Handles the signin process.
 *
 * @param {object} db - The database connection object.
 * @param {object} bcrypt - The bcrypt library for password hashing.
 * @returns {function} - The signin handler function.
 */
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json("incorrect form submission")
  }
  // Select email and hash from the "login" table where email matches
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash)

      if (isValid) {
        // Select all columns from the "users" table where email matches
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0])
          })
          .catch((err) => res.status(400).json("unable to get user"))
      } else {
        res.status(400).json("wrong credentials")
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"))
}

module.exports = {
  /**
   * Exports the handleSignin function.
   *
   * @type {function}
   */
  handleSignin: handleSignin,
}
