var Sequelize = require('sequelize'),
  sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    define: {
      freezeTableName:true,
      timestamps: false
    },
    storage: './imdb-large.sqlite3.db'
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
Movies.belongsToMany(Actors, {through: Roles, foreignKey: 'movie_id'});
Actors.belongsToMany(Movies, {through: Roles, foreignKey: 'actor_id'});
Movies.hasMany(Roles, {foreignKey: 'movie_id'});
Actors.hasMany(Roles, {foreignKey: 'actor_id'});

var models = {Actors, Roles, Movies};

function getOtherModels(model){
  return Object.keys(models).filter(i=>i!=model).map(i=>models[i]);
}

function findById(model, id, fn){
  models[model].findById(id, {include: getOtherModels(model)}).then(function(data){
    if (data)
      return fn(null,data);
    fn("Id " + id + " not found in " + model);
  });
}

function findByAttr(model, obj, fn){
  models[model].findAll({
    where: obj,
    include: getOtherModels(model)
  })
  .then(function(data){
    if (data)
      return fn(null,data);
    fn("Attribute not found in " + model);
  });
}

module.exports = {findByAttr, findById, models};

// findById('Actors', 347256, function(err,data){
//   console.log(err || data.roles[0].role);
// })
