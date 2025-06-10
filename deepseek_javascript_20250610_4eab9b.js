const express = require('express');
const multer = require('multer');
const { Client, Intents } = require('discord.js');
const app = express();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Discord bot setup
bot.login('YOUR_BOT_TOKEN');
const CHANNEL_ID = 'YOUR_STORAGE_CHANNEL_ID';

// File upload handling
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  const channel = bot.channels.cache.get(CHANNEL_ID);
  
  try {
    const msg = await channel.send({
      files: [{
        attachment: req.file.buffer,
        name: req.file.originalname
      }]
    });
    
    // Save metadata (filename, message ID, etc.)
    res.json({ 
      url: `https://yourdomain.com/download/${msg.id}` 
    });
  } catch (err) {
    res.status(500).send('Upload failed');
  }
});

app.get('/download/:id', async (req, res) => {
  const msg = await bot.channels.cache.get(CHANNEL_ID).messages.fetch(req.params.id);
  res.redirect(msg.attachments.first().url);
});

app.listen(3000, () => console.log('Server running'));