import { ObjectId } from "mongodb";

export type SessionType = "FP1" | "FP2" | "FP3" | "Quali" | "Sprint" | "Race";
export default interface Session {
  name: string;
  date: string;
  type: SessionType;
  year: number;
  notified?: boolean;
}

export interface Message {
  for: ObjectId;
  messageId: string;
  date: string;
}
