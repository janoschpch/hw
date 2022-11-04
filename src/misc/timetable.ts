export default class Timetable {
    entries: TimetableEntry[];

    constructor(entries: TimetableEntry[]) {
        this.entries = entries;
    }
}

class TimetableEntry {
    name: string;
    day: number;
    time: number;

    constructor(name: string, day: number, time: number) {
        this.name = name;
        this.day = day;
        this.time = time;
    }
}