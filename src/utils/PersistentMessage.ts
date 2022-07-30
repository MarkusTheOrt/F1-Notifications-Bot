import { Snowflake, TextChannel } from "discord.js";
import Config from "../Config.js";
import Client from "./Client.js";
import Database from "./Database.js";
import { MinDate } from "./DateTool.js";
import MakeTimestamp from "./DiscordTimeStamp.js";
import Try from "./Try.js";
import { Weekend } from "./Types.js";
import { findBestWeekend } from "./Watcher.js";

export const init = async () => {
  const setting = await Database.Settings?.findOne({ name: "infoMessage" });
  const channel = Client.channels.cache.get(Config.channel) as TextChannel;
  let msg = undefined;
  if (setting !== null && setting !== undefined) {
    try {
      msg = await channel.messages.fetch(setting.value as Snowflake);
    } catch {
      await Database.Settings?.deleteOne({ name: "infoMessage" });
    }
  }

  const message =
    msg ??
    (await channel.send(
      "*New Infomessage is being created. Please wait.* \n\n \
*this message is being reused, please **Do not delete it!***"
    ));

  await Database.Settings?.updateOne(
    {
      name: "infoMessage",
    },
    {
      $set: {
        value: message.id,
      },
    },
    { upsert: true }
  );
};

export const UpdateMessage = async (weekend: Weekend) => {
  const info = await Database.Settings?.findOne({ name: "infoMessage" });
  if (info === null) {
    console.log("Couldn't find infoMessage Settings Value.");
    await init();
    return;
  }

  const channel = Client.channels.cache.get(Config.channel) as TextChannel;
  if (channel === undefined) {
    console.log("Couldn't find Channel.");
    return;
  }

  const infoMessage = await Try(
    channel.messages.fetch(info?.value as Snowflake)
  );
  if (infoMessage === null) {
    console.log("Couldn't find Infomessage.");
    return;
  }
  let message = "";
  for (const session of weekend.sessions) {
    const sessionDate = new MinDate(session.start);
    message += "\n";
    const inPast =
      sessionDate.inPast &&
      sessionDate.numberDifference(Date.now()) < -2 * 60 * 60 * 1000;
    if (inPast) message += "~~";
    message += `**${session.type}:** ${MakeTimestamp(
      session.start
    )} - ${MakeTimestamp(session.start, "R")}`;
    if (inPast) message += "~~";
  }
  await infoMessage.edit(
    `Click 📣 in <#887772313565659226> to get a notification when a session is live.\n\nNext race:\n**${weekend.prefix} ${weekend.name}**${message}`
  );
};

Client.on("messageDelete", async (message) => {
  const infoMessage = await Database.Settings?.findOne({ name: "infoMessage" });
  if (infoMessage === null) return;
  if (message.id === infoMessage?.value) {
    console.log("Deleted Infomessage");
    await init();
    const weekend = await findBestWeekend();
    if (weekend === null) return;
    await UpdateMessage(weekend);
  }
});
