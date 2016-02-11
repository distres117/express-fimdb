var temp;
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
})
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


module.exports = {findByAttr, findById, exists, temp};

//console.log(getOtherModels('Movies'));
// findById('Actors', 347256, function(err,data){
//   console.log(err || data);
// });

// findByAttr('Movies', {name: 'Braveheart'}, function(err,data){
//   console.log(data[0].movies_genre.genre);
// } );
