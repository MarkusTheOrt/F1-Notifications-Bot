import { Snowflake, TextChannel } from "discord.js";
import Config from "../Config.js";
import Client from "./Client.js";
import Database from "./Database.js";
import { MinDate } from "./DateTool.js";
import MakeTimestamp from "./DiscordTimeStamp.js";
import { isNone, none, unwrap, wrap } from "./Optional.js";
import Try from "./Try.js";
import { Weekend } from "./Types.js";
import { findBestWeekend } from "./Watcher.js";

export const init = async () => {
  const setting = await Try(Database.Settings.findOne({ name: "infoMessage" }));
  const channel = wrap(
    Client.channels.cache.get(Config.permChannel) as TextChannel
  );
  if (isNone(channel)) {
    throw new Error("Couldn't fetch channel. exiting...");
  }
  if (isNone(setting)) {
    await SendMessage();
  }
};

export const SendMessage = async () => {
  const channel = wrap(
    Client.channels.cache.get(Config.permChannel) as TextChannel
  );
  if (isNone(channel)) {
    throw new Error("Couldn't find #when-is-f1-on channel.");
  }
  const message = await Try(
    unwrap(channel).send(
      "*New Infomessage is being created. Please wait.* \n\n \
  *this message is being reused, please **Do not delete it!***"
    )
  );

  if (isNone(message)) {
    throw new Error("Couldn't send persistent Infomessage.");
  }

  const setting = await Try(
    Database.Settings.updateOne(
      { name: "infoMessage" },
      { $set: { value: unwrap(message).id } }
    )
  );

  if (isNone(setting)) {
    throw new Error("Couldn't insert new message into settings.");
  }

  return message;
};

export const DeleteMessage = async () => {
  const message = await GetMessage();
  if (isNone(message)) {
    return none;
  }
  return await Try(unwrap(message).delete());
};

export const GetMessage = async () => {
  const messageId = await Database.Settings.findOne({ name: "infoMessage" });
  if (messageId === null) {
    console.log("Couldn't find infoMessage Settings Value.");
    return none;
  }
  const channel = Client.channels.cache.get(Config.permChannel) as TextChannel;
  if (channel === undefined) {
    console.log("Couldn't find #when-is-f1-on channel.");
    return none;
  }

  const infoMessage = await Try(
    channel.messages.fetch(messageId?.value as Snowflake)
  );
  return infoMessage;
};

export const UpdateMessage = async (weekend: Weekend) => {
  let message = await GetMessage();
  if (isNone(message)) {
    message = await SendMessage();
    if (isNone(message)) {
      throw new Error("Couldn't send message.");
    }
  }

  let content = "";
  for (const session of weekend.sessions) {
    const sessionDate = new MinDate(session.start);
    content += "\n";
    const inPast =
      sessionDate.inPast &&
      sessionDate.numberDifference(Date.now()) < -2 * 60 * 60 * 1000;
    if (inPast) content += "~~";
    content += `**${session.type}:** ${MakeTimestamp(
      session.start
    )} - ${MakeTimestamp(session.start, "R")}`;
    if (inPast) content += "~~";
  }
  await unwrap(message).edit(
    `Click 📣 in <#913752470293991424> to get a notification when a session is live.\n\nNext race:\n**${weekend.prefix} ${weekend.name}**${content}`
  );
};

const PersistentMessage = () => {
  Client.on("messageDelete", async (message) => {
    const infoMessage = await Database.Settings?.findOne({
      name: "infoMessage",
    });
    if (infoMessage === null) return;
    if (message.id === infoMessage?.value) {
      console.log("Deleted Infomessage");
      await init();
      const weekend = await findBestWeekend();
      if (weekend === null) return;
      await UpdateMessage(unwrap(weekend));
    }
  });

  Client.on("ready", async () => {
    console.log("Persistent Message initialized.");
    await init();
  });
};

export default PersistentMessage;
