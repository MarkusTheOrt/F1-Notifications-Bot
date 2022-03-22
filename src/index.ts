import { TextChannel } from "discord.js";
import Config from "./Config";
import Client from "./utils/Client";
import Database from "./utils/Database";
import Deleter from "./utils/Deleter";
import Watcher from "./utils/Watcher";

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
