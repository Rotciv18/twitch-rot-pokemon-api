import 'dotenv/config';
import '../src/database';
import fillUsers from '../src/jobs/fillUsers';

fillUsers();
