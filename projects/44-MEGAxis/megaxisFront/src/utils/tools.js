export function transType(num) {
    const types = [
        'general', 'academic', 'marketing', 'software development', 'business', 'others'
    ]
    return types[num];
}
export function formatPrice(num) {
    if(num <=0) {
        return 'free';
    } else {
        return '$' + num;
    }
}

export function generateLikes() {
    return parseInt(Math.random()*(999-50)+50);
}
export function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}