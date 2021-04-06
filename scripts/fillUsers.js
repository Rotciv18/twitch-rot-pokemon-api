import 'dotenv/config';
import '../src/database';
import fillUsers from '../src/jobs/fillUsers';

setTimeout(() => fillUsers(), 1000);
