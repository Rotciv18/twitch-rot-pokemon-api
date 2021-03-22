import fs from 'fs';
import util from 'util';

export default async () => {
  const readFile = util.promisify(fs.readFile);
  const data = await readFile(process.env.STREAM_AVATARS_DATA);
  const jsonData = JSON.parse(data);
  return jsonData.userData;
};
