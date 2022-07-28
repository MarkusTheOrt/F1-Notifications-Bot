import { MessageAttachment } from "discord.js";
import Constants from "./Constants";
import MakeTimestamp from "./DiscordTimeStamp";
import { Weekend } from "./Types";

export interface messageContent {
  content: string;
  files: MessageAttachment[];
}

export default (
  role: string,
  weekend: Weekend,
  session: number
): messageContent => {
  const attachmentId = parseInt(
    "" + Math.random() * Constants.attachments.length
  );
  const attachment = new MessageAttachment(
    Constants.attachments[attachmentId].url,
    Constants.attachments[attachmentId].name
  );

  const fullSession = weekend.sessions[session];
  return {
    content: `** <@&${role}> ${weekend.prefix ?? ""} ${weekend.name} ${
      fullSession.type
    } is about to start** ${MakeTimestamp(fullSession.date, "R")}`,
    files: [attachment],
  };
};
