import getStreamAvatarsUserData from './src/helpers/getStreamAvatarsUserData';
import 'dotenv/config';

const printae = async () => {
  const userData = await getStreamAvatarsUserData();

  const arrayzin = Object.keys(userData.factordonald.ownedObjects.avatars);

  arrayzin.forEach((element) => console.log(element));
  // console.log(userData.factordonald);
};

printae();
