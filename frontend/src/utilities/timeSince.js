// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export default function timeSince(date) {

    let seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval >= 1) {
      return formatInterval(interval, 'year');
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
      return formatInterval(interval, 'month');
    }
    interval = seconds / 86400;
    if (interval >= 1) {
      return formatInterval(interval, 'day');
    }
    interval = seconds / 3600;
    if (interval >= 1) {
      return formatInterval(interval, 'hour');
    }
    interval = seconds / 60;
    if (interval >= 1) {
      return formatInterval(interval, 'minute');
    }
    return formatInterval(interval, 'second');
  }


  function formatInterval(interval, intervalType) {
      const timeValue = Math.floor(interval);
      if (timeValue > 1 || interval === 0) {
        intervalType += 's';
      }
      return timeValue + ' ' + intervalType;
  }