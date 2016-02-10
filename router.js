var router = require('express').Router();
var db = require('./db/db.js');

router.param('type', function(req,res,next,type){
  if (db.exists(type)){
    req.type = type;
    next();
  }
  else
    res.render('error');

});
//Home route
router.get('/', function(req,res){
  res.redirect('/Movies');
});

//Base routes for the type
router.route('/:type')
  .get(function(req,res){
    var type = req.type.toLowerCase();
    res.render(type, {selected: type });
  })
  .post(function(req,res){
    db.findByAttr(req.type, req.body, function(err,data){
      if (!err){
        db.temp = data;
        res.render(req.type.toLowerCase(),{data: data, showResults: true});
      }
      else{
        console.log(err);
        res.render('error', {message: err});
      }
    });
  });

router.get('/Movies/:id', function(req,res){
  db.findById('Movies', req.params.id, function(err,data){
    if (!err)
      res.render('partials/movies_detail', {data: data}, function(err,html){
        res.render('movies', {template: html, data: db.temp, showResults:true, id: Number(req.params.id)});
      });
  });

});

router.get('/Actors/:id', function(req,res){
  db.findById('Actors', req.params.id, function(err,data){
    if (!err)
      res.render('actors', {data: data, showResults:true} );
  });
});



module.exports = router;
