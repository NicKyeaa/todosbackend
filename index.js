// Import the framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import toDoModel from './src/models/todo.js';

const fastify = Fastify({
  logger: false,
});
await fastify.register(cors, {
  domain: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todos');

// Declare a route
fastify.get('/todos', async (req, res) => {
  const toDos = await toDoModel.find();
  res.send(toDos);
});

fastify.post('/todos/post', async (req, res) => {
  const { title, longDescription, done } = req.body;

  if (!title) {
    return res.code(400).send({ error: 'Todo is required' });
  }

  const newToDo = new toDoModel({
    title,
    longDescription,
    done,
  });

  // Save the short url and send back all of the urls to update the list
  await newToDo.save();
  const toDos = await toDoModel.find();
  res.code(201).send(toDos);
});

fastify.delete('todos/:id', async (req, res) => {
  const { toDoID } = req.params;
  console.log(req);
  console.log(toDoID);
});

// Run the server!
try {
  await fastify.listen({ port: 3500 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
