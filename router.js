var router = require('express').Router();
var db = require('./db/db.js');

router.param('type', function(req,res,next,type){
  if (db.models[type]){
    req.type = type;
    next();
  }
  else
    res.redirect('/error');

});
router.get('/error', function(req,res){
  res.status(404).send("Page not found");
});

router.get('/:type', function(req,res){
  res.send("You got:" + req.type);
});


module.exports = router;
