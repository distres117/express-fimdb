var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app');
var db = require('../db/db');

before(function(done){
  db.favs.init(function(){
    done();
  });
});
after(function(done){
  db.favs.destroy(function(){
    done();
  });
});
describe('Saving favorites:', function(){

  it('Saves to the favorites table', function(done){
    db.favs.set('Movies', 5000, function(data){
      done();
    });
  });
  it('Gets the favorites table', function(done){
    db.favs.get(function(data){
      expect(data.length).to.equal(1);
      expect(data[0].name).to.equal("Aborto: Canta a la vida");
      done();
    });
  });
});
describe('Testing routes', function(){
  it('Saves favorite via route', function(done){
    request(app)
      .get('/Movies/5000?method=post')
      .end(function(){
        done();
      });
  });
  it('Gets via route', function(done){
    request(app)
      .get('/Movies')
      .end(function(err, res){
        expect(res.text).to.include("Aborto: Canta a la vida");
        done();

      });
  });
  it('Correctly displays button', function(done){
    request(app)
      .get('/Movies/5000')
      .end(function(err,res){
        if (err)
          console.log(err.message);
        else{
          expect(res.text).to.include("Add to Favorites");
        }
        done();

      });
  });
});
