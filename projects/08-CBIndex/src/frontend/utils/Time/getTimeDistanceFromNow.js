export function getTimeDistanceFromNow(timestamp) {
    const now = new Date();
    const pastDate = new Date(timestamp);

    const timeDiff = now.getTime() - pastDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} Years Ago`;
    }
    if (months > 0) {
        return `${months} Months Ago`;
    }
    if (days > 0) {
        return `${days} Days Ago`;
    }
    if (hours > 0) {
        return `${hours} Hours Ago`;
    }
    if (minutes > 0) {
        return `${minutes} Minutes Ago`;
    }
    if (seconds > 0) {
        return `${seconds} Seconds Ago`;
    }
    
    return 'just now';
}
