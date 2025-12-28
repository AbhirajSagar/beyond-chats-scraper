import mongoose from 'mongoose';

async function getDb()
{
    try
    {
        const db = await mongoose.connect(process.env.MONGO_URI, {dbName: 'public'});
        return db;
    }
    catch(err)
    {
        console.error('Error while connecting to database', err);
        throw new Error(err);
    }
}