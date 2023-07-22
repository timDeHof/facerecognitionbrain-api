/**
 * @fileoverview This file contains functions for handling image recognition using the Clarifai API.
 * @module clarifai
 */

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc")
/**
 * The Clarifai stub.
 * @type {ClarifaiStub}
 */
const stub = ClarifaiStub.grpc()
/**
 * The metadata for the API call.
 * @type {grpc.Metadata}
 */
const metadata = new grpc.Metadata()
/**
 * Sets the authorization header in the metadata.
 * @param {string} token - The API token.
 */
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`)
/**
 * Handles the API call for image recognition.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      model_id: "face-detection",
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
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details,
        )
        return
      }

      console.log(`Found ${response.outputs[0].data.regions.length} faces!`)

      res.json(response)
    },
  )
}
/**
 * Handles the image processing.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} db - The database object.
 */
const handleImage = (req, res, db) => {
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
