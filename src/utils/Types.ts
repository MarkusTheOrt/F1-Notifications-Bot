export interface Sessions {
  FP1: string;
  FP2: string;
  FP3?: string;
  Quali: string;
  SprintQuali?: string;
  Race: string;
}

export type Race = {
  name: string;
  sessions: Sessions;
};
