const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertMovieDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};
const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    
    directorId: dbObject.director_id,
    directorName: dbObject.director_name
    
  };
};
app.get("/movies/",async(request,response)=>{
    const moviesQuery = `SELECT movie_name FROM movie;`;
    cont moviesArray = await database.all(moviesQuery);
    response.send(
    moviesArray.map((eachMovie) =>
      ({movieName:eachMovie.movieName})
    )
    );
});
app.get("/movies/:movieId/",async(request,response)=>{
    const {movieId} = request.params;
    const movieQuery = `SELECT * FROM movie WHERE  movie_id = ${movieId};`;
    const result = await database.get(movieQuery);
    response.send(convertMovieDbObjectToResponseObject(result));
});
app.post("/movies/".async(request,response)=>{
    const{directorId,movieName,leadActor} = request.body;
    const addQuery = `INSERT INTO movie(director_id,movie_name,lead_actor) VALUES(${direcorId},'${movieName}','${leadActor}');`;
    const movie = await database.run(addQuery);
    send.response("Movie Successfully Added");
});
app.put("/movies/:movieId/",(request,response)=>{
    const {movieId} = request.params;
    const{directorId,movieName,leadActor} = request.body;
    const updateQuery = `UPDATE
    movie
  SET
    director_id = ${directorId},
    movie_name = '${movieName}',
     lead_actor= '${leadActor}'
  WHERE
    movie_id = ${movieId};`;
    await database.run(updateQuery);
    response.send("Movie Details Updated");
});
app.delete("/movies/:movieId/",(request,response)=>{
    const {movieId} = request.params;
    
    const deleteQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
    await database.run(deleteQuery);
    response.send("Movie Removed");
});
app.get("/directors/",async(request,response)=>{
    const directorsQuery = `SELECT * FROM director;`;
    const directors = await database.all(directorsQuery); 
    response.send(
         directorsArray.map((eachDirector) =>
      convertDirectorDbObjectToResponseObject(eachDirector)
    )
    );
});
app.get("/directors/:directorId/movies/",(request,response)=>{
    const {directorId} = request.params;
    const getDirectorMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id='${directorId}';`;
  const moviesArray = await database.all(getDirectorMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});
module.exports = app;
