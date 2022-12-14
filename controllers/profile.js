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
