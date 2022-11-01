// const Clarifai = require("clarifai")

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc")

const stub = ClarifaiStub.grpc()

const metadata = new grpc.Metadata()
metadata.set("authorization", "Key 6e4384214c4f4cdaad62e4675139df7e")
const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      model_id: "a403429f2ddf4b49b307e318f00e528b",
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err)
        return
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " + response.status.description + "\n" + response.status.details
        )
        return
      }

      console.log(`Found ${response.outputs[0].data.regions.length} faces!`)
      // for (const c of response.outputs[0].data.regions) {
      //   console.log(c.name + ": " + c.value)
      // }
      res.json(response)
    }
  )
}
const handleImage = (db) => (req, res) => {
  const { id } = req.body
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        return res.json(entries[0])
      } else {
        throw err
      }
    })
    .catch((err) => res.status(400).json("unable to get entries"))
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
}
