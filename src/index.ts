import Config from "./Config";
import Client from "./utils/Client";
import Database from "./utils/Database";
import Deleter from "./utils/Deleter";
import Watcher from "./utils/Watcher";

Client.on("ready", () => {
  console.log("Bot is connected as " + Client.user!.tag);
});

[Watcher];
[Deleter];
(async () => {
  await Database.Connect();
  await Client.login(Config.token);
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
