const express = require('express');
const router = express.Router();
const VisitorCount = require('../models/Visitor'); 
const verifyUser = require('../middlewares/token.js');

router.get('/saveVisitor', async (req, res) => {
  try {  
    const visitorCount = await VisitorCount.findOne();
    if (!visitorCount) {
      const newVisitorCount = new VisitorCount();
      newVisitorCount.count = 1;
      await newVisitorCount.save();
      res.status(200).send(newVisitorCount);
    } else {
      visitorCount.count++;
      await visitorCount.save();
      res.status(200).send(visitorCount);
    }
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/removeVisitor', async (req, res) => {
  try {  
    const visitorCount = await VisitorCount.findOne();
    if (!visitorCount) {
      const newVisitorCount = new VisitorCount();
      newVisitorCount.count = 0;
      await newVisitorCount.save();
      res.status(200).send(newVisitorCount);
    } else {
      visitorCount.count--;
      await visitorCount.save();
      res.status(200).send(visitorCount);
    }
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getVisitor',verifyUser, async (req, res) => {
  try {  
    const visitorCount = await VisitorCount.findOne();
    if (!visitorCount) {
      res.status(200).send(0);
    } else {
      res.status(200).send(visitorCount);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;