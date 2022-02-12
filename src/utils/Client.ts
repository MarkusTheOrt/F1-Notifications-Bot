import { Intents, Client as DiscordClient } from "discord.js";

const Client = new DiscordClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

export default Client;
