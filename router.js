var router = require('express').Router();
var db = require('./db/db.js');

router.param('type', function(req,res,next,type){
  if (db.exists(type)){
    req.type = type;
    next();
  }
  else
    res.redirect('/error');

});

router.get('/', function(req,res){
  res.redirect('/Movies');
});
router.get('/error', function(req,res){
  res.status(404).send("Page not found");
});

router.route('/:type')
  .get(function(req,res){
    var type = req.type.toLowerCase();
    res.render(type, {selected: type });
  })
  .post(function(req,res){
    db.findByAttr(req.type, req.body, function(err,data){
      if (data)
        res.json(data);
    });
  })


module.exports = router;
