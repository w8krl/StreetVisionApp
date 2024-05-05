const express = require("express");
const cors = require("cors");

// Import routes
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json()); 
app.use("/media-store", express.static("/media-store"));  
app.use("/api", applicationRoutes);

module.exports = app;
