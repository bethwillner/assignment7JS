
const router = require('express').Router();

const { get } = require('http');
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URL || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
    await client.connect()
    return client.db(dbName).collection(collectionName)
}



// GET /api/todos

router.get('/', async (_, response) => {
    const collection = await getCollection('todo-api', 'todos')
    const todos = await collection.find().toArray();
	response.json(todos);
})

// POST /api/todos

router.post('/', async (request, response) => {
	const {item} = request.body;
    const collection = await getCollection('todo-api', 'todos')

	const complete = false
	//const id = todos.length + 1;	
	await collection.insertOne({ item, complete:complete })
	response.json({message: "New task added!"});
})

// PUT /api/todos/:id

router.put('/:id', async (request, response) => {
	const { id } = request.params;
	const collection = await getCollection('todo-api', 'todos')

	const todo = await collection.findOne({_id: new ObjectId(id)});
	const complete = !todo.complete;
	await collection.updateOne({_id: new ObjectId(id)}, {$set: {complete:complete}});
	response.json({message: "Task Completion Updated!"})


	//const task = todos.find(todo => todo.id.toString() === id)
	//task.complete = !task.complete // toggle the complete property
	//response.json({id, item: task.item, complete: task.complete})
})

module.exports = router;

