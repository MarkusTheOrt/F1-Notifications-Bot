import { TextChannel } from "discord.js";
import Config from "./Config.js";
import Client from "./utils/Client.js";
import Database from "./utils/Database.js";
import Deleter from "./utils/Deleter.js";
import Watcher from "./utils/Watcher.js";

Client.on("ready", () => {
  console.log("Bot is connected as " + Client.user!.tag);
  // Make sure the Channel we post in is cached!
  Client.channels.fetch(Config.channel, { cache: true });
});

// Activate both the watcher and deleter functions.
[Watcher, Deleter];
(async () => {
  await Database.Connect();
  await Client.login(Config.token);
  // Just a default Presence to make it look nicer.
  Client.user?.setPresence({
    status: "dnd",
    activities: [
      {
        name: "for a new Session",
        type: "LISTENING",
      },
    ],
  });
})().catch((e) => console.error(e));
