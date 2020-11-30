const { MongoClient } = require("mongodb");
const crypto = require('crypto');
const { nanoid } = require('nanoid');

async function initialize(){

	const mongoClient = new MongoClient(process.env.DB_CONNECT, { useUnifiedTopology: true });

	const client = await mongoClient.connect();

	db = client.db(process.env.DB_NAME);

	const dbNames = await db.listCollections({}).map(e => e.name).toArray();

	if(!dbNames.includes('words')){
		const collection = await db.createCollection('words');

		collection.createIndex({'time': -1});
	}

	return db;
}

let db = null;

module.exports = async function getDB(collection){

	if(!db) 
		await initialize();

	if(collection)
		return db.collection(collection);
	else
		return db;

};
