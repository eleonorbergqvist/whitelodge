const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

jest.setTimeout(60000);

const COLLECTIONS = ["users"];

class DBManager {
  constructor() {
    this.server = new MongoMemoryServer();
  }

  async start() {
    const url = await this.server.getConnectionString();
    await mongoose.connect(url, { useNewUrlParser: true });
  }

  async stop() {
    await mongoose.connection.close()
    return this.server.stop();
  }

  cleanup() {
    return Promise.all(
      COLLECTIONS.map(c => mongoose.connection.collection(c).deleteMany({}))
    );
  }
}

const dbmanager = new DBManager();

const startDB = () => dbmanager.start();
const stopDB = () => dbmanager.stop();
const cleanupDB = () => dbmanager.cleanup();

module.exports = {
  startDB,
  stopDB,
  cleanupDB,
}
