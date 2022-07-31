import { TextChannel } from "discord.js";
import Config from "../Config.js";
import Client from "./Client.js";
import Database from "./Database.js";
import { MinDate } from "./DateTool.js";
import MakeTimestamp from "./DiscordTimeStamp.js";
import Try from "./Try.js";
import { Weekend } from "./Types.js";

export const ParseCalendar = async () => {
  const weekends = Database.Weekends?.find();
  if (weekends === null) {
    await NoCalData();
    return [];
  }
  const sorted = (await weekends?.toArray()) ?? [];
  sorted?.sort((a, b) => {
    return new MinDate(a.start).getTime() - new MinDate(b.start).getTime();
  });
  return sorted;
};

export const Calendar = async () => {
  const cal = await ParseCalendar();

  const msgs: string[] = [];
  msgs.push("**F1 2022 Calendar:**");

  let i = 0;
  for (const weekend of cal) {
    msgs[i] += messageContent(weekend);
    if (msgs[i].length > 1800) {
      i++;
      msgs.push(" \n\n");
    }
  }
  return msgs;
};

export const NoCalData = async () => {
  const msgs = [];
  for (const msg of await Calendar()) {
    msgs.push(
      await (Client.channels.cache.get(Config.channel) as TextChannel).send(msg)
    );
  }
  await Database.Settings?.insertOne({
    name: "calendar",
    value: msgs.map((msg) => {
      return msg.id;
    }),
  });
};

export const messageContent = (weekend: Weekend): string => {
  let message = "";
  for (const session of weekend.sessions) {
    message += `\n**${session.type}:** ${MakeTimestamp(
      session.start,
      "f"
    )} - ${MakeTimestamp(session.start, "R")}`;
  }
  return `\n\n**${weekend.prefix} ${weekend.name}**${message}`;
};

export const GetMessages = async () => {
  const msgs = await Database.Settings?.findOne({ name: "calendar" });
  const fetched = [];
  for (const msg of msgs?.value as string[]) {
    const data = await Try(
      (Client.channels.cache.get(Config.channel) as TextChannel).messages.fetch(
        msg
      )
    );
    fetched.push(data);
  }
};
