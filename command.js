import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "create",
    description: "Creates a new short URL",
  },
];

const rest = new REST({ version: "10" }).setToken(
  "MTQwMTk3MTU1NzE4NTg4NDIwMA.G2ahvI.3Sk0UKpKy4yDgWSvyQNk4CVbzimlFwPTViE0-0"
);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands("1401971557185884200"), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

export { commands };
