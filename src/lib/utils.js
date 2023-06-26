export const arrObjColumn = (array, column) => {
  const values = [];
  Object.keys(array).map((index) => {
    const itemObj = array[index];
    values.push(itemObj[column]);
  });
  return values;
};

export const truncateText = (text, maxWords) => {
  const words = text?.split(" ");
  if (words?.length > maxWords) {
    return words?.slice(0, maxWords)?.join(" ") + " ...";
  }
  return text;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const getLastUpdatedDateTimeFrmArr = (dataArr) => {
  let lastUpdated = null;

  dataArr.forEach((data) => {
    const updatedAt = new Date(data.updated_at);
    if (!lastUpdated || updatedAt > lastUpdated) {
      lastUpdated = updatedAt;
    }
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (lastUpdated) {
    if (isSameDay(lastUpdated, today)) {
      return 'Today';
    } else if (isSameDay(lastUpdated, yesterday)) {
      return 'Yesterday';
    } else {
      return formatDate(lastUpdated);
    }
  } else {
    return '-'
  }
};