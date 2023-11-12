// Import the framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import toDoModel from './src/models/todo.js';

const fastify = Fastify({
  logger: true,
});
await fastify.register(cors, {
  domain: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todos');

// Declare a route
fastify.get('/', async (req, res) => {
  const toDos = await toDoModel.find();
  res.send(toDos);
});

fastify.get('/:shortUrl', async (req, res) => {
  const shortUrl = await toDoModel.findOne({ shortURL: req.params.shortUrl });

  if (shortUrl === null) return res.code(404).send();
  res.redirect(shortUrl.originalURL);
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
