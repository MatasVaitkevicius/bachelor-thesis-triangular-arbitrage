const express = require('express');
const dexRoute = express.Router();

// Model
let DexModel = require('../models/Dex');

// Post Dex
dexRoute.route('/dexs').post((req, res, next) => {
  DexModel.create(req.body, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
});

// Get Tokens
dexRoute.route('/dexs').get((req, res, next) => {
    DexModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

 // Get Dex
dexRoute.route('/dexs/:id').get((req, res, next) => {
   DexModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
dexRoute.route('/dexs/:id').put((req, res, next) => {
  DexModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('dex successfully updated!')
    }
  })
})

// Delete
dexRoute.route('/dexs/:id').delete((req, res, next) => {
  DexModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = dexRoute;