export const verboseGameStyle =  (value: string): string => {
  // turn the short abbreviation string to the verbose version
  switch(value){
    case "CTF":
      return "Capture The Flag";
    case "FFA":
      return "Free For All";
    case "OFFA":
      return "Open (Teamless) Free For All";
    case "Rabbit":
      return "Rabbit Chase";
    default:
      break;
  }

  return value;
}