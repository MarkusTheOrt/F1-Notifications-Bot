import Client from "./utils/Client";
import Commands from "./utils/Commands";
import DataStore from "./utils/DataStore";

Client.on("ready", () => {
  console.log("Bot is connected as " + Client.user!.tag);
});

(async () => {
  Commands.Register();
  await Client.login(
    "OTQyMTIxOTUwNzc4NjM0MjQw.Ygf5cA.XbyFcWKzu_RmilAYZYmS8YfZVzs"
  );
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
