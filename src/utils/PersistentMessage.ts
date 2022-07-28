import { Snowflake, TextChannel } from "discord.js";
import Config from "../Config.js";
import Client from "./Client.js";
import Database from "./Database.js";
import MakeTimestamp from "./DiscordTimeStamp.js";
import { Weekend } from "./Types.js";

export const init = async () => {
  const setting = await Database.Settings?.findOne({ name: "infoMessage" });
  const channel = Client.channels.cache.get(Config.channel) as TextChannel;
  if (setting !== null && setting !== undefined) {
    try {
      const msg = await channel.messages.fetch(setting.value as Snowflake);
      await msg.delete();
    } catch {
      await Database.Settings?.deleteOne({ name: "infoMessage" });
    }
  }

  const message = await channel.send(
    "*Bot is initializing, please wait one second* \n\n \
*this message is being reused, please **Do not delete it!***"
  );
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
  if (info !== null) {
    const infoMessage = await (
      Client.channels.cache.get(Config.channel) as TextChannel
    ).messages.fetch(info?.value as Snowflake);
    let message = "";
    for (const session of weekend.sessions) {
      message += `\n**${session.type}:** ${MakeTimestamp(
        session.start
      )} - ${MakeTimestamp(session.start, "R")}`;
    }
    await infoMessage.edit(
      `Click 📣 in <#887772313565659226> to get a notification when a session is live.\n\nNext Race:\n**${weekend.prefix} ${weekend.name}**${message}`
    );
  }
};
