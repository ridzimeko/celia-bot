import { connect } from 'mongoose';
import constants from '../config';

async function startMongo() {
  console.log('Connecting to database...');
  await connect(constants.MONGODB_URL)
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.error('Error: failed to connect database \n', err.message);
      process.exit(1);
    });
}

export default startMongo;
