
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
var util = require('util');    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
 
  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
      console.log(listing)
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  
    var listing = req.listing;
    var bodylist = new Listing(req.body);
    var query = {code : listing.code};
    var update = {

          name : bodylist.name,
          code : bodylist.code,
          address : bodylist.address

        };
      
    if(req.results) {
          bodylist.coordinates = {

           latitude: req.results.lat, 
            longitude: req.results.lng
    
         };


          update.coordinates = bodylist.coordinates;
        }
      
        Listing.updateOne(query,update, 
          function (err, result) {
              if (err) throw err;
          });
      

        Listing.findOne({code: bodylist.code})
        .then(result => { 

          res.send(result);

        }).catch(err => {

          res.status(400).send({

              message: err.message || "Update location failed"
          });
        });

};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

    Listing.deleteOne({


          code: listing.code
        }, function (err, result) {
          if (err)

              res.send(err);

          res.json({

              status: "Success",
              message: 'Listing deleted'

          });
        });

};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {

    Listing.find({}, function(err, locations) {
          if (err) throw err;
          
          


          locations.sort( (a,b) => (a.code > b.code) ? 1 : -1);
      
  


          
        }).then(locations => { 


          res.send(locations);
        }).catch(err => {

          res.status(400).send({

              message: err.message || "Error occurred retrieving locations"

          });
        });
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};