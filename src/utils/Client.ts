import { Client as DiscordClient } from "discord.js";
import { GatewayIntentBits } from "discord.js";
import Config from "../Config.js";

const Client = new DiscordClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

Client.on("ready", () => {
  Client.guilds.fetch({ guild: Config.guild, cache: true });
  Client.channels.fetch(Config.channel, { cache: true });
});

export default Client;
