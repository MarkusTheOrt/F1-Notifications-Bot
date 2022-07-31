import { Intents, Client as DiscordClient } from "discord.js";
import Config from "../Config.js";
import { Calendar, NoCalData, ParseCalendar } from "./Calendar.js";

const Client = new DiscordClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

Client.on("ready", () => {
  Client.guilds.fetch({ guild: Config.guild, cache: true });
  Client.channels.fetch(Config.channel, { cache: true });
});

export default Client;
