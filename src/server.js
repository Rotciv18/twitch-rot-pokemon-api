import app from './app';
import twitchClientEvents from './twitchClientEvents';

try {
  app.listen(3333);
  twitchClientEvents
    .connect()
    .then(() => console.log('Twitch client now connected'));
  console.log('App listening at port 3333.');
  // buildPokedexDB();
} catch (error) {
  console.log(error);
}
