import Client from "./Client.js";
import Database from "./Database.js";
import Config from "../Config.js";
import Constants from "./Constants.js";
import { MinDate } from "./DateTool.js";
import { Weekend } from "./Types.js";
import { TextChannel } from "discord.js";
import { init, UpdateMessage } from "./PersistentMessage.js";
import MessageParser from "./MessageParser.js";

Client.on("ready", async () => {
  await init();

  for (;;) {
    const weekend = await findBestWeekend();

    if (weekend === null) {
      console.log("Couldn't find next Weekend.");
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }
    const bestSessionIndex = findBestSession(weekend);

    if (bestSessionIndex === -1) {
      console.log("Couldn't find next Session, Marking Weekend as done.");
      await Database.Weekends?.updateOne(
        {
          _id: weekend._id,
        },
        {
          $set: {
            done: true,
          },
        }
      );
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }

    if (bestSessionIndex === -2) {
      console.log("There are current events, but none are close.");
      await UpdateMessage(weekend);
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }

    const channel = Client.channels.cache.get(Config.channel) as TextChannel;

    let message = null;
    try {
      message = await channel.send(
        MessageParser(Config.role, weekend, bestSessionIndex)
      );
    } catch (e) {
      console.log("Couldn't Send Message. Skipping as to not spam.");
      console.log(e);
    }

    weekend.sessions[bestSessionIndex].notified = true;
    await Database.Weekends?.updateOne(
      {
        _id: weekend._id,
      },
      {
        $set: {
          sessions: weekend.sessions,
        },
      }
    );
    if (message !== null) {
      await Database.Messages?.insertOne({
        weekend: weekend._id,
        session: bestSessionIndex,
        date: weekend.sessions[bestSessionIndex].start,
        messageId: message.id,
      });
    }

    await UpdateMessage(weekend);
    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});

export const findBestWeekend = async (): Promise<Weekend | null> => {
  let weekendDifference = Constants.defTimeApart;
  let bestMatch: Weekend | null = null;
  const now = Date.now();

  const weekends =
    Database.Weekends?.find({ done: { $exists: false } }) ?? null;
  if (weekends === null) {
    console.log("No eligible Weekends found!");
    return bestMatch;
  }

  while (await weekends.hasNext()) {
    const weekend = await weekends.next();
    const weekendStart = new MinDate(weekend?.start).get().getTime();
    const tempApart = Math.abs(now - weekendStart);

    if (tempApart < weekendDifference) {
      weekendDifference = tempApart;
      bestMatch = weekend;
    }
  }
  return bestMatch;
};

export const findBestSession = (weekend: Weekend): number => {
  const now = Date.now() + Constants.futureProjection;
  let bestIndex = -1;
  let timeApart = Constants.defTimeApart;
  for (let i = 0; i < weekend.sessions.length; i++) {
    const session = weekend.sessions[i];
    if (session.notified) continue;
    const sessionTime = new MinDate(session.start).get().getTime();
    const timeBetween = now - sessionTime;

    if (bestIndex === -1 && timeBetween < -Constants.futureProjection)
      bestIndex = -2;

    if (
      Math.abs(timeBetween) < timeApart &&
      Math.abs(timeBetween) < 100 * 1000
    ) {
      timeApart = timeBetween;
      bestIndex = i;
    }
  }
  return bestIndex;
};

export default null;
