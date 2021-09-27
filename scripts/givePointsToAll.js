import '../src/database';
import User from '../src/app/models/User';
import { addPoints } from '../src/app/services/StreamElements/Points';

async function run() {
  const users = await User.findAll();

  const promises = users.map(async (user) => {
    await addPoints(user.username, 40000);
  });

  await Promise.all(promises);
}

run();
