const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "This is Shawn Batons Node and express API sprint",
    });
});

module.exports = router;
