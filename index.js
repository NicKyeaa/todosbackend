// Import the framework and instantiate it
import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import URLModel from './src/models/url.js';

const fastify = Fastify({
  logger: true,
});
await fastify.register(cors, {
  domain: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Declare a route
fastify.get('/', async (req, res) => {
  const URLs = await URLModel.find();
  res.send(URLs);
});

fastify.post('/shorten', async (req, res) => {
  const { URL } = req.body;

  if (!URL) {
    return res.code(400).send({ error: 'URL is required' });
  }
  const shortURL = nanoid();

  const newURL = new URLModel({
    shortURL,
    originalURL: URL,
  });

  // Save the short url and send back all of the urls to update the list
  await newURL.save();
  const URLs = await URLModel.find();
  res.code(201).send(URLs);
});

fastify.get('/:shortUrl', async (req, res) => {
  const shortUrl = await URLModel.findOne({ shortURL: req.params.shortUrl });

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
