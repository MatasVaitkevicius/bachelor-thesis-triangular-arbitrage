const express = require('express');
const trioRoute = express.Router();

// Model
let TrioModel = require('../models/Trio');

// Post Trio
trioRoute.route('/trios').post((req, res, next) => {
  TrioModel.create(req.body, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
});

// Get Tokens
trioRoute.route('/trios').get((req, res, next) => {
    TrioModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

 // Get Trio
trioRoute.route('/trios/:id').get((req, res, next) => {
   TrioModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
trioRoute.route('/trios/:id').put((req, res, next) => {
  TrioModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('token successfully updated!')
    }
  })
})

// Delete
trioRoute.route('/trios/:id').delete((req, res, next) => {
  TrioModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = trioRoute;