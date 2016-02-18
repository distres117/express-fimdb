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
    db.favs.init(function(){
      db.favs.get(function(data){
        res.render(type, {selected: type, favs: data || []});
      });
    });

  })
  .post(function(req,res){
    db.findByAttr(req.type, req.body, function(err,data){
      if (!err){
        db.temp.store = data;
        res.render(req.type.toLowerCase(),{data: db.temp.paginate(0,20), showResults: true});
      }
      else{
        res.render('error', {message: err});
      }
    });
  });

router.route('/:type/:id')
  .get(function(req,res){
    db.findById(req.type, Number(req.params.id), function(err,data){
      if (!err)
        res.render('partials/'+ req.type.toLowerCase() + '_detail', {data: data}, function(err,html){
            if (req.query.link)
              db.temp.store = data;
            db.favs.get(function(favs){
              res.render(req.type.toLowerCase(), {
                template: html,
                data: db.temp.store,
                showResults:true,
                id: Number(req.params.id),
                favs:favs,
                path: '/'+ req.type + '/' + req.params.id
              });
            });


      });
    });

  })
  .post(function(req,res){
    db.favs.set(req.type, Number(req.params.id), function(){
      res.redirect('/' + req.type + '/' + req.params.id);
    });
  })
  .delete(function(req,res){
    db.favs.remove(Number(req.params.id), function(){
      res.redirect('/' + req.type);
    });
  });




// router.get('/Actors/:id', function(req,res){
//   db.findById('Actors', req.params.id, function(err,data){
//     if (!err)
//       res.render('actors', {data: data, showResults:true} );
//   });
// });



module.exports = router;
