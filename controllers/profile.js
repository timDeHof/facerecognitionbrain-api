/**
Handle the profile get request.
@param {Object} req - The request object.
@param {Object} res - The response object.
@param {Object} db - The database object.
@returns {Function} - The middleware function that handles the profile get request.
*/
const handleProfileGet = (req, res, db) => (req, res) => {
  const { id } = req.params
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0])
      } else {
        throw err
      }
    })
    .catch((err) => res.status(400).json("not found"))
}

module.exports = {
  handleProfileGet,
}
