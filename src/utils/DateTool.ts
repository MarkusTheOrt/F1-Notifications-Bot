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
}
