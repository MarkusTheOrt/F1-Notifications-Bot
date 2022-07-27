import { ObjectId } from "mongodb";

export type SessionType =
  | "FP1"
  | "FP2"
  | "FP3"
  | "Quali"
  | "Sprint"
  | "Race"
  | "Pre-Season Test";

export default interface Session {
  date: string;
  type: SessionType | string;
  year: number;
  notified?: boolean;
}

export interface Message {
  for: ObjectId;
  messageId: string;
  date: string;
}

export interface Weekend {
  name: string;
  start: string;
  prefix?: string; // For the :flag_hu: emote. This way it is easier to filter.
  sessions: Session[];
  current?: boolean;
  done?: boolean;
}
