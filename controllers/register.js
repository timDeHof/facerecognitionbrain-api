/**
 * Handles the registration process.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} db - The database object.
 * @param {Object} bcrypt - The bcrypt object for password hashing.
 * @returns {void}
 */
const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body
  if (!email || !password || !name) {
    return res.status(400).json("incorrect form submission")
  }
  const hash = bcrypt.hashSync(password)
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }).catch((err) => res.status(400).json("unable to register"))
}

module.exports = {
  /**
   * Exports the handleRegister function.
   *
   * @type {Function}
   */
  handleRegister: handleRegister,
}
