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


function findActorMovies(id, fn){
  Actors.findById(id, {include: [Movies]}).then(function(data){
    if (data.movies)
      fn(data.movies);
  });
}
function findMovieActors(id, fn){
  Movies.findById(id, {include: [Actors]}).then(function(data){
    if (data.actors)
      fn(data.actors);
  });
}
findActorMovies(376249, function(data){
  console.log(data[10].name);
});
