function DataStore(){
  this.store = null;
}

DataStore.prototype.paginate=function(skip, limit){
  return this.store.filter(function(it,i){
    return (i > skip -1 && i < (skip +limit));
  });
};

var Sequelize = require('sequelize'),
  sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    define: {
      freezeTableName:true,
      timestamps: false
    },
    storage: './db/imdb-large.sqlite3.db'
  });

//Movie model
var Movies = sequelize.define('movies', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  rank: Sequelize.FLOAT
});

var Actors = sequelize.define('actors', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  gender: Sequelize.CHAR
});

var Directors = sequelize.define('directors', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING
});

var Roles = sequelize.define('roles', {
  actor_id: Sequelize.INTEGER,
  movie_id: Sequelize.INTEGER,
  role: Sequelize.STRING
});

var Genres = sequelize.define('movies_genres', {
  movie_id:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  genre: Sequelize.STRING
});

var Favorites = sequelize.define('favorites', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  type: Sequelize.STRING,
  name: Sequelize.STRING,
  type_id: Sequelize.INTEGER
});

Movies.belongsToMany(Actors, {through: Roles, foreignKey: 'movie_id'});
Actors.belongsToMany(Movies, {through: Roles, foreignKey: 'actor_id'});
Movies.hasMany(Roles, {foreignKey: 'movie_id'});
Actors.hasMany(Roles, {foreignKey: 'actor_id'});
Movies.hasOne(Genres, {foreignKey: 'movie_id'});


var models = {Actors, Movies, Genres};

function getOtherModels(model){
  var rtn = Object.keys(models).filter(i=>i!=model).map(i=>models[i]);
  if (model === 'Actors')
    rtn.splice(rtn.indexOf(Genres, 1));
  return rtn;
}

function sanitize(obj){
  var keys = Object.keys(obj);
  keys.forEach(function(item){
    if (!obj[item])
      delete obj[item];
  });
  return obj;
}


function findById(model, id, fn){
  models[model].findById(id, {include: getOtherModels(model)}).then(function(data){
    if (data){
      return fn(null,data);
    }
    fn("Id " + id + " not found in " + model);
  });
}

function findByAttr(model, obj, fn){
  models[model].findAll({
    where: sanitize(obj),
    include: getOtherModels(model),
    limit: 100
  })
  .then(function(data){
    if (data && data.length)
      return fn(null,data);
    fn("Attribute not found in " + model);
  });
}
function exists(name){
  return !!models[name];
}

var temp = new DataStore();

var favs = {
  init: function(cb){
    Favorites.sync().then(function(){
      cb();
    });

  },
  destroy:function(cb){
    Favorites.drop().then(function(){
      cb();
    });
  },
  get: function(cb){
    Favorites.findAll().then(function(data){
      cb(data);
    });
  },
  set: function(type, id, cb){
    findById(type, id, function(err,data){
      Favorites.create({
        type: type,
        type_id: id,
        name: data.name
      })
      .then(function(){
        cb();
      });
    });
  }
};
module.exports = {findByAttr, findById, exists, temp, favs};

// console.log(getOtherModels('Movies'));
// findById('Movies', 5000, function(err,data){
//   console.log(data.name);
//
// });

// findByAttr('Actors', {first_name: 'Brad'}, function(err,data){
//   //console.log(data[0].movies_genre.genre);
//   temp.store = data;
//   console.log(temp.paginate(25,10)[0].last_name);
// } );
