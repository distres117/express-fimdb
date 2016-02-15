var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  router = require('./router'),
  methodOverride = require('method-override');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(function(req,res,next){
  if (req.query.method)
    req.method = req.query.method;
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req,res,next){
  res.on('finish', function(){
    console.log(req.method, req.path, res.statusCode);
  });
  next();
});
app.use(express.static('node_modules'));
app.use(router);


module.exports = app;
