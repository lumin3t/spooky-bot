//discord bot 
import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});     
client.on('messageCreate', msg => {
  if (msg.author.bot) return; // ignore bots

  // "ping" command
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  // "I'm x" or "im x"
  const match = msg.content.match(/\b(i['’]?m)\s+(.+)/i);
  if (match) {
    const name = match[2];
    msg.reply(`Hello ${name}, I'm dad!`);
  }
});
