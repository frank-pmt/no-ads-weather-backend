const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatTime(time:string):string {
    const d = new Date(time);
    let amPm = d.getHours() >= 12 ? "pm" : "am";
    return (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + amPm;
}

export function formatDayName(time:string):string {
    const d = new Date(time);
    return DAYS[d.getDay()];
}

export function formatDay(time:string):string {
    const d = new Date(time);
    return d.getDate() + "/" + d.getMonth();
}

export function formatWindSpeed(speed: number): string {
    return Math.round(speed).toString();
}