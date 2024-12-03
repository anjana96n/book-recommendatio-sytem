const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Connect to MongoDB (remove deprecated options)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/book-recommendation';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  // Login to Discord
client.login(process.env.DISCORD_TOKEN)
.catch(err => console.error('Error logging in to Discord:', err));

  // Link Account Command
  if (message.content.startsWith('!linkaccount')) {
    const userId = message.author.id;
    // Logic to link account (e.g., save userId to the database)
    message.channel.send(`Account linked for ${message.author.username}`);
  }

  // Add Book Command
  if (message.content.startsWith('!addbook')) {
    const bookDetails = message.content.split(' ').slice(1).join(' ');
    // Logic to add book to the database
    message.channel.send(`Book added: ${bookDetails}`);
  }

  // List Books Command
  if (message.content.startsWith('!listbooks')) {
    // Logic to fetch and list books from the database
    message.channel.send('List of books...');
  }

  // Edit Book Command
  if (message.content.startsWith('!editbook')) {
    const [bookId, ...newDetails] = message.content.split(' ').slice(1);
    // Logic to update book in the database
    message.channel.send(`Book ${bookId} updated.`);
  }

  // Delete Book Command
  if (message.content.startsWith('!deletebook')) {
    const bookId = message.content.split(' ')[1];
    // Logic to delete book from the database
    message.channel.send(`Book ${bookId} deleted.`);
  }

  // Add Review Command
  if (message.content.startsWith('!addreview')) {
    const [bookId, ...reviewDetails] = message.content.split(' ').slice(1);
    // Logic to add review to the database
    message.channel.send(`Review added for book ${bookId}`);
  }

  // List Reviews Command
  if (message.content.startsWith('!listreviews')) {
    const bookId = message.content.split(' ')[1];
    // Logic to fetch and list reviews for the book
    message.channel.send(`Reviews for book ${bookId}...`);
  }

  // Delete Review Command
  if (message.content.startsWith('!deletereview')) {
    const reviewId = message.content.split(' ')[1];
    // Logic to delete review from the database
    message.channel.send(`Review ${reviewId} deleted.`);
  }

  // Search Book Command
  if (message.content.startsWith('!searchbook')) {
    const query = message.content.split(' ').slice(1).join(' ');
    // Logic to search for books in the database
    message.channel.send(`Search results for: ${query}`);
  }
});

client.login(process.env.DISCORD_TOKEN);