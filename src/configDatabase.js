import mongoose from 'mongoose';
import config from './config.js';

const { dbConfig } = config;
async function connectToDatabase() {
    try {
        const uri = `mongodb+srv://${dbConfig.userName}:${dbConfig.password}@cluster0.vmaoxjo.mongodb.net/${dbConfig.dbName}?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log('Connected to Database');
    } catch (error) {
        console.log("Can't connect to database", error);
    }
}

export default connectToDatabase;
