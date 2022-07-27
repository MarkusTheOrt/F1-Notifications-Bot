import Client from "./Client.js";
import Database from "./Database.js";
import { MessageAttachment, TextChannel } from "discord.js";
import Config from "../Config.js";
import MessageParser from "./MessageParser.js";
import Constants from "./Constants.js";
import { MinDate } from "./DateTool.js";
import { ObjectID } from "bson";

Client.on("ready", async () => {
  while (true) {
    const events = Database.Events!.find({
      notified: { $exists: false },
    });

    // This time is set 5 minutes into the future so we can notify a little ahead.
    const projectedTime = Date.now() + Constants.futureProjection;
    let difference = Constants.defTimeApart;
    let session = null;

    // Iterate through events.
    while (await events?.hasNext()) {
      const event = await events.next();
      if (event === null) continue;

      // DELETE PLEASE
      const msg = {
        id: "1245",
      };
      const session = {
        _id: new ObjectID(),
        date: "124",
        messageId: "124",
      };
      // END OF DELETE BLOCK

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
