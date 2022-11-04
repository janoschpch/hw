import Homework from "./homework";
import Timetable from "./timetable";

export default class User {
    id: number;
    username: string;
    displayname: string;
    email: string;
    passwordHash: string;
    homework: Homework[];
    timetable: Timetable;

    constructor(id: number, username: string, displayname: string, email: string, passwordHash: string, homework: Homework[], timetable: Timetable) {
        this.id = id;
        this.username = username;
        this.displayname = displayname;
        this.email = email;
        this.passwordHash = passwordHash;
        this.timetable = timetable;
    }
}