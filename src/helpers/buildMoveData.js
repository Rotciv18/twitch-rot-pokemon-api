import axios from 'axios';
import MoveData from '../app/models/MoveData';

const baseUrl = 'https://pokeapi.co/api/v2';
const machineCount = 1688;

export default async function buildTMData() {
  const indexArray = [];
  for (let i = 1; i <= machineCount; i++) {
    indexArray.push(i);
  }

  const promises = indexArray.map(async (index) => {
    let machineResponse;
    try {
      machineResponse = await axios.get(`${baseUrl}/machine/${index}`);
    } catch (e) {
      machineResponse = await axios.get(`${baseUrl}/machine/${index}/`);
    }
    const machineData = machineResponse.data;

    if (machineData.version_group.name === 'red-blue') {
      await MoveData.create({
        name: machineData.item.name,
        move_name: machineData.move.name,
      });
    }
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }

  console.log('cabou');
}
