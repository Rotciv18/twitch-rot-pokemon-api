import app from './app';
import buildPokedexDB from './helpers/buildPokedexDB';

try {
  app.listen(3333);
  console.log('App listening at port 3333.');
  // buildPokedexDB();
} catch (error) {
  console.log(error);
}
