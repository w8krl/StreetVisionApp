const POI = require("../models/poiModel");
// const { producer } = require("../kafkaProducer");

exports.createPOI = async (req, res) => {
  try {
    const newPOI = new POI(req.body);
    const savedPOI = await newPOI.save();
    res.status(201).json({
      message: "POI created successfully",
      data: savedPOI,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating POI",
      error: error.message,
    });
  }
};

exports.getPOIs = async (req, res) => {
  try {
    const pois = await POI.find();
    res.json(pois);
  } catch (error) {
    console.error("Error fetching POIs", error);
    res.status(500).send("Error fetching POIs");
  }
};
