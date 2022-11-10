const express = require('express');
const tokenRoute = express.Router();

// Model
let TokenModel = require('../models/Token');

// Post Token
tokenRoute.route('/tokens').post((req, res, next) => {
  TokenModel.create(req.body, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
});

// Get Tokens
tokenRoute.route('/tokens').get((req, res, next) => {
    TokenModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

 // Get Token
tokenRoute.route('/tokens/:id').get((req, res, next) => {
   TokenModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
tokenRoute.route('/tokens/:id').put((req, res, next) => {
  TokenModel.findByIdAndUpdate(req.params.id, {
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
tokenRoute.route('/tokens/:id').delete((req, res, next) => {
  TokenModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = tokenRoute;