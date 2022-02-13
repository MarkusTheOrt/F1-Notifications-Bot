import moment from "moment";
import Client from "./Client";
import Database from "./Database";
import { ObjectId, WithId } from "mongodb";
import Session from "../utils/Types";
import { TextChannel } from "discord.js";
import Config from "../Config";

Client.on("ready", async () => {
  while (true) {
    // Update once a minute

    const events = Database.Events!.find({
      notified: { $exists: false },
    });
    const now = moment().utc();
    let difference = 100000000;
    let session = null;
    while (await events?.hasNext()) {
      const event: WithId<Session> | null = await events.next();
      if (event === null) continue;
      const parsed = moment(event.date);
      const diff = now.diff(parsed) / 1000;
      if (Math.abs(diff) < difference && Math.abs(diff) < 100) {
        difference = Math.abs(diff);
        session = event;
      }
    }
    if (session !== null) {
      const time = parseInt(moment(session.date).format("x")) / 1000;
      session.notified = true;
      Database.Events?.updateOne(
        { _id: session._id },
        { $set: { notified: true } }
      );
      (Client.channels.cache.get(Config.channel) as TextChannel).send(
        `** <@&${Config.role}> ${session.name} ${session.type} is about to start** <t:${time}:R>`
      );
    }
    console.log("Pingus Butus!");
    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});

export default null;
