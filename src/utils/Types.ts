import { ObjectId } from "mongodb";

export interface Session {
  start: string;
  type: string;
  year: number;
  notified?: boolean;
}

export interface Message {
  weekend: ObjectId;
  session: number;
  messageId: string;
  channeldId: string;
  date: string;
}

export interface Setting {
  name: string;
  value: string | number | object;
}

export interface Weekend {
  _id: ObjectId;
  name: string;
  start: string;
  prefix?: string; // For the :flag_hu: emote. This way it is easier to filter.
  sessions: Session[];
  current?: boolean;
  done?: boolean;
}
