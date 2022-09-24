import Client from "./Client.js";
import Database from "./Database.js";
import Config from "../Config.js";
import Constants from "./Constants.js";
import { MinDate } from "./DateTool.js";
import { Weekend } from "./Types.js";
import { TextChannel } from "discord.js";
import { DeleteMessage, UpdateMessage } from "./PersistentMessage.js";
import MessageParser from "./MessageParser.js";
import { Option, isSome, isNone, none, unwrap } from "./Optional.js";
import Try from "./Try.js";
import { WithId } from "mongodb";

const Watcher = () => {
  Client.on("ready", async () => {
    console.log("Watcher initialized.");
    for (;;) {
      const weekend = await findBestWeekend();

      if (isNone(weekend)) {
        console.log("Couldn't find next Weekend.");
        await new Promise((resolve) =>
          setTimeout(resolve, Config.interval * 1000)
        );
        continue;
      }
      await UpdateMessage(unwrap(weekend));
      const found_session = findBestSession(unwrap(weekend));

      // Weekend has no sessions left.
      if (is_no_session(found_session)) {
        console.log("Trying to mark as bs");

        if (
          isNone(
            await Try(
              Database.Weekends.updateOne(
                {
                  _id: unwrap(weekend)._id,
                },
                {
                  $set: {
                    done: true,
                  },
                }
              )
            )
          )
        ) {
          console.error("Couldn't mark weekend as done.");
        }
        await DeleteMessage();
        await new Promise((resolve) =>
          setTimeout(resolve, Config.interval * 1000)
        );
        continue;
      }

      // Weekend has sessions in the future but now now.
      if (is_future_session(found_session)) {
        await new Promise((resolve) =>
          setTimeout(resolve, Config.interval * 1000)
        );
        continue;
      }

      // Weekend has a current session.
      const channel = Client.channels.cache.get(Config.channel) as TextChannel;
      const message = await Try(
        channel.send(
          MessageParser(Config.role, unwrap(weekend), found_session.index)
        )
      );
      if (isNone(message)) {
        console.error("Couldn't send Message. Skipping as not to spam.");
      }

      unwrap(weekend).sessions[found_session.index].notified = true;
      if (
        isNone(
          await Try(
            Database.Weekends.updateOne(
              {
                _id: unwrap(weekend)._id,
              },
              {
                $set: {
                  sessions: unwrap(weekend).sessions,
                },
              }
            )
          )
        )
      ) {
        console.error("Couldn't update sessions in weekend structure.");
      }
      if (isSome(message)) {
        await Try(
          Database.Messages?.insertOne({
            weekend: unwrap(weekend)._id,
            session: found_session.index,
            date: unwrap(weekend).sessions[found_session.index].start,
            messageId: unwrap(message).id,
          })
        );
      }

      await UpdateMessage(unwrap(weekend));
      await new Promise((resolve) =>
        setTimeout(resolve, Config.interval * 1000)
      );
    }
  });
};

export const findBestWeekend = async () => {
  let weekendDifference = Constants.defTimeApart;
  let bestMatch: Option<WithId<Weekend>> = none;
  const now = Date.now();

  const weekends = Database.Weekends.find({ done: { $exists: false } });
  if (weekends === null) {
    console.log("No eligible Weekends found!");
    return none;
  }

  while (await weekends.hasNext()) {
    const weekend = await Try(weekends.next());
    if (isNone(weekend)) continue;
    const weekendStart = new MinDate(unwrap(weekend).start).get().getTime();
    const tempApart = Math.abs(now - weekendStart);

    if (tempApart < weekendDifference) {
      weekendDifference = tempApart;
      bestMatch = weekend;
    }
  }
  return bestMatch;
};

interface NoSession {
  readonly _tag: "no_session";
}

interface FutureSession {
  readonly _tag: "future_session";
}

interface NextSession {
  readonly _tag: "next";
  readonly index: number;
}

type AvailableSession = NoSession | FutureSession | NextSession;

const no_session: NoSession = { _tag: "no_session" };
const future_session: FutureSession = { _tag: "future_session" };
const next_session = (a: number): NextSession => ({ _tag: "next", index: a });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const has_session = (a: AvailableSession): a is NextSession =>
  a._tag === "next";
const is_future_session = (a: AvailableSession): a is FutureSession =>
  a._tag === "future_session";
const is_no_session = (a: AvailableSession): a is NoSession =>
  a._tag === "no_session";

/**
 * Finds the best session available.
 * @param weekend The Weekend in which to search for.
 * @returns `AvailableSession` - a type which might hold a session or not.
 */
export const findBestSession = (weekend: Weekend): AvailableSession => {
  const now = Date.now() + Constants.futureProjection;
  let bestIndex = -1;
  let ret: AvailableSession = no_session;
  let timeApart = Constants.defTimeApart;
  for (let i = 0; i < weekend.sessions.length; i++) {
    const session = weekend.sessions[i];
    if (session.notified) continue;
    const sessionTime = new MinDate(session.start).get().getTime();
    const timeBetween = now - sessionTime;

    // Date is in the future, mark as such and skip.
    if (
      bestIndex < 0 &&
      timeBetween < -Constants.futureProjection + 200 * 1000
    ) {
      bestIndex = -2;
      ret = future_session;
      continue;
    }

    if (Math.abs(timeBetween) < timeApart) {
      timeApart = timeBetween;

      if (Math.abs(timeBetween) < 200 * 1000) {
        bestIndex = i;
        ret = next_session(i);
      }
    }
  }
  return ret;
};

export default Watcher;
