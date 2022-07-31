import Constants from "./Constants.js";

export class MinDate {
  private original: string;
  private check: boolean;
  private date: Date;

  constructor(inDate: string | undefined) {
    this.original = inDate ?? "";
    this.check =
      inDate !== undefined ? Constants.dateMatch.test(this.original) : false;
    if (this.check === false) {
      console.log("Date invalid");
    }
    this.date = new Date(this.original);
  }

  get isValid() {
    return this.check;
  }

  get() {
    return this.date;
  }

  // Wether the date is in the past.
  get inPast() {
    return this.date.getTime() < Date.now();
  }

  MinDateDifference(to: MinDate): number {
    return this.get().getTime() - to.get().getTime();
  }

  DateDifference(to: Date): number {
    return this.get().getTime() - to.getTime();
  }

  numberDifference(to: number): number {
    return this.get().getTime() - to;
  }

  getTime() {
    return this.date.getTime();
  }
}
