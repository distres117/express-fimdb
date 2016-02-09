var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  router = require('./router');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views')
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


app.listen(3000, function(){
  console.log("Server started...");
});
