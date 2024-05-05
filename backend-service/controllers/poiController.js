const POI = require("../models/poiModel");
const Job = require("../models/survJobModel");
// const { producer } = require("../kafkaProducer");

exports.createPOI = async (req, res) => {
  try {
    console.log(req.body);
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
    const pois = await POI.find().sort({ createdAt: -1 });
    res.json(pois);
  } catch (error) {
    console.error("Error fetching POIs", error);
    res.status(500).send("Error fetching POIs");
  }
};

// Fetch all POIs - FIXME: add pagination
exports.getPOIJobSummary = async (req, res) => {
  try {
    const pois = await POI.find({});
    let summary = await Promise.all(
      pois.map(async (poi) => {
        const jobs = await Job.find({ poi: poi._id })
          .select("_id createdAt status")
          .lean()
          .exec();
        return {
          ...poi.toObject(),
          jobs: jobs.length > 0 ? jobs : [],
        };
      })
    );

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching POI summary" });
  }
};
