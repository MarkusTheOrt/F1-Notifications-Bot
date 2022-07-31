const MakeTimestamp = (
  dateString: string,
  format = "f"
): string | undefined => {
  try {
    return `<t:${new Date(dateString).getTime() / 1000}:${format}>`;
  } catch (e) {
    console.log("Error Parsing Date: ");
  }
  return undefined;
};

export default MakeTimestamp;
