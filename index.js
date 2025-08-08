import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { commands } from "./command.js"; // Importing the commands array from the commands.js file.

const discordToken = process.env.DISCORD_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!discordToken || !geminiApiKey) {
  console.error(
    "ERROR: Missing DISCORD_TOKEN, GEMINI_API_KEY, or DISCORD_CLIENT_ID environment variables."
  );
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(geminiApiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

client.on("ready", () => {
  console.log(`Bot is logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!ask")) return;

  await message.channel.sendTyping();
  const prompt = message.content.replace("!ask", "").trim();

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let reply = response.text();

    // 💡 Truncate the message if it's too long to fit in a single Discord message.
    const maxMessageLength = 1900; // Using a safe length to leave room for markdown and ellipsis.
    if (reply.length > maxMessageLength) {
      reply = reply.substring(0, maxMessageLength) + "... (message truncated)";
    }

    // Send the Gemini response back to the Discord channel.
    await message.channel.send(reply);
  } catch (err) {
    console.error("Gemini API Error:", err);
    await message.channel.send(
      "Sorry, there was an error getting the response from Gemini AI. Please check the console for details."
    );
  }
});

// Event listener for slash command interactions.
client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "create") {
    interaction.reply({ content: `Handling the /create command...` });
  } else {
    console.log(interaction);
    interaction.reply("Pong!!");
  }
});



// Log in to Discord using your bot token from the environment variables.
client.login(discordToken);
