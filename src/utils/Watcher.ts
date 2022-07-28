import Client from "./Client.js";
import Database from "./Database.js";
import Config from "../Config.js";
import Constants from "./Constants.js";
import { ObjectID } from "bson";

Client.on("ready", async () => {
  for (;;) {
    const events = Database.Events?.find({
      notified: { $exists: false },
    });

    // This time is set 5 minutes into the future so we can notify a little ahead.
    const projectedTime = Date.now() + Constants.futureProjection;
    const difference = Constants.defTimeApart;
    const session = null;

    console.log(projectedTime, difference, session);
    if (events === undefined) continue;
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
