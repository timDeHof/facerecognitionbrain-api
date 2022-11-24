const handleProfileGet = (pool) => (req, res) => {
  const { id } = req.params
  pool
    .select("*")
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
