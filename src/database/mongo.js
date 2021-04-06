import mongoose from 'mongoose';
import mongoConfig from '../config/mongo';

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.mongoConnection = mongoose.connect(mongoConfig.url, {
      dbName: mongoConfig.dbname,
      user: mongoConfig.username,
      pass: mongoConfig.password,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    mongoose.connection.on('connected', () => {
      console.log('Successfully connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.log(error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Successfully disconnected from MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit();
    });
  }
}

export default new Database();
