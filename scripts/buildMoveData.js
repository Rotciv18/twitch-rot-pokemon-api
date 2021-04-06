import 'dotenv/config';
import buildMoveData from '../src/helpers/buildMoveData';

import('../src/database/index');

setTimeout(() => buildMoveData(), 2000);
