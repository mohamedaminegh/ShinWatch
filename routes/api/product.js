const express = require('express');
const router = express.Router();

// @route GET api/product/test
// @description tests product route
// @access Public
router.get('/test', (req, res) => res.json({msg :"Product Work"}));   
module.exports = router;