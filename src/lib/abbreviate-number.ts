export const getAbbreviatedNumber = (num: number) => {
  if (num < 1000) {
    return Number(num.toFixed()).toLocaleString();
  } else if (num < 1000000) {
    return Number((num / 1000).toFixed()).toLocaleString() + "K";
  } else if (num < 1000000000) {
    return Number((num / 1000000).toFixed()).toLocaleString() + "M";
  }
  return Number((num / 1000000000).toFixed()).toLocaleString() + "B";
};
