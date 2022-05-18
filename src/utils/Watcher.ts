import moment from "moment";
import Client from "./Client";
import Database from "./Database";
import {MessageAttachment, TextChannel} from "discord.js";
import Config from "../Config";

Client.on("ready", async () => {
  while (true) {
    const events = Database.Events!.find({
      notified: { $exists: false },
    });
    // Go five minutes into the future, so we can notify a bit before.
    const now = moment().utc().add(5, "minutes");

    let difference = 100000000;
    let session = null;

    // Iterate through events.
    while (await events?.hasNext()) {
      const event = await events.next();
      if (event === null) continue;

      const parsed = moment(event.date);
      const diff = now.diff(parsed) / 1000;
      // Check if the Difference is smaller than 100 seconds to post.
      if (Math.abs(diff) < difference && Math.abs(diff) < 100) {
        difference = Math.abs(diff);
        session = event;
        events.close();
        break;
      }
    }
    if (session !== null) {
      const time = parseInt(moment(session.date).format("x")) / 1000;
      session.notified = true;
      Database.Events?.updateOne(
        { _id: session._id },
        { $set: { notified: true } }
      );
      // txt `** <@&${Config.role}> ${session.name} ${session.type} is about to start** <t:${time}:R>`
      let attach = new MessageAttachment("https://fia.ort.dev/F1themecats.mp4", 'f1themecats.mp4');
      const msg = await (
        Client.channels.cache.get(Config.channel) as TextChannel
      ).send(
          { content: `** <@&${Config.role}> ${session.name} ${session.type} is about to start** <t:${time}:R>`, files: [attach] }
      );

      if (msg === null) continue;
      await Database.Messages?.insertOne({
        for: session._id,
        date: session.date,
        messageId: msg.id,
      });
    }

    // Wait another (default 60) seconds until next try.
    await new Promise((resolve) => setTimeout(resolve, Config.interval * 1000));
  }
});

export default null;
