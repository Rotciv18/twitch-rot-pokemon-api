import buildPokedexDB from '../src/helpers/buildPokedexDB';
import 'dotenv/config';

import('../src/database/index');

setTimeout(() => buildPokedexDB(), 1000);
