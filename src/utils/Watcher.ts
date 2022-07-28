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
    const now = Date.now();

    const weekends =
      Database.Weekends?.find({ done: { $exists: false } }) ?? null;
    if (weekends === null) {
      console.log("No eligible Weekends found!");
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }

    let weekendDifference = Constants.defTimeApart;
    let bestMatch: Weekend | null = null;
    while (await weekends.hasNext()) {
      const weekend = await weekends.next();

      const weekendStart = new MinDate(weekend?.start).get().getTime();
      const tempApart = Math.abs(now - weekendStart);
      if (tempApart < weekendDifference) {
        weekendDifference = tempApart;
        bestMatch = weekend;
      }
    }

    if (bestMatch === null) {
      console.log("Couldn't find next Weekend.");
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }
    // This time is set 5 minutes into the future so we can notify a little ahead.
    const projectedTime = Date.now() + Constants.futureProjection;
    let bestSessionIndex = -1;
    let sessionDifference = Constants.defTimeApart;
    for (let i = 0; i < bestMatch.sessions.length; i++) {
      const session = bestMatch.sessions[i];
      if (session.notified) continue;
      const sessionTime = new MinDate(session.start).get().getTime();
      const timeBetween = projectedTime - sessionTime;

      if (bestSessionIndex === -1 && timeBetween < -Constants.futureProjection)
        bestSessionIndex = -2;

      if (
        Math.abs(timeBetween) < sessionDifference &&
        Math.abs(timeBetween) < 100 * 1000
      ) {
        sessionDifference = timeBetween;
        bestSessionIndex = i;
      }
    }

    if (bestSessionIndex === -1) {
      console.log("Couldn't find next Session, Marking Weekend as done.");
      await Database.Weekends?.updateOne(
        {
          _id: bestMatch._id,
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
      await UpdateMessage(bestMatch);
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
      continue;
    }

    const channel = (await Client.channels.cache.get(
      Config.channel
    )) as TextChannel;

    const message = await channel.send(
      MessageParser(Config.role, bestMatch, bestSessionIndex)
    );

    if (message === null) {
      console.log("Couldn't Send Message. Skipping as to not spam.");
    }
    bestMatch.sessions[bestSessionIndex].notified = true;
    await Database.Weekends?.updateOne(
      {
        _id: bestMatch._id,
      },
      {
        $set: {
          sessions: bestMatch.sessions,
        },
      }
    );
    await Database.Messages?.insertOne({
      weekend: bestMatch._id,
      session: bestSessionIndex,
      date: bestMatch.sessions[bestSessionIndex].start,
      messageId: message.id,
    });

    await UpdateMessage(bestMatch);

    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});

export default null;
