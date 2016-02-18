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
      db.favs.set('Movies', 5001, function(){
        done();
      });
    });
  });
  it('Gets the favorites table', function(done){
    db.favs.get(function(data){
      expect(data.length).to.equal(2);
      expect(data[0].name).to.equal("Aborto: Canta a la vida");
      done();
    });
  });
  it('Deletes the record', function(done){
    this.timeout(5000);
    db.favs.remove(1, function(){
      db.favs.get(function(data){
        done();
      });
    });
  });
});
describe('Testing routes', function(){
  this.timeout(5000);
  it('Saves favorite via route', function(done){
    request(app)
      .get('/Movies/46169?method=post')
      .end(function(){
        done();
      });
  });
  it('Gets via route', function(done){
    request(app)
      .get('/Movies')
      .end(function(err, res){
        expect(res.text).to.include("Braveheart");
        done();

      });
  });
  it('Correctly displays button', function(done){
    request(app)
      .get('/Movies/5002')
      .end(function(err,res){
        expect(res.text).to.include("Add to Favorites");
        done();

      });
  });
  it('Correctly displays delete favs button', function(done){
    request(app)
      .get('/Movies/46169?link=true')
      .end(function(err,res){
        if (err)
          console.log(err.message);
        else{
          expect(res.text).to.include("Remove from Favorites");
        }
        done();

      });
  });
  it("Delete via route", function(done){
    request(app)
      .get('/Movies/46169?method=delete')
      .expect(302, done);
  });
  it('Deletion is reflected', function(done){
    request(app)
      .get('/Movies')
      .end(function(err,res){
        expect(res.text).to.not.include("Braveheart");
        done();
      });
  });
});
