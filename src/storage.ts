import NodeCache from "node-cache";
import HwBackend from ".";
import Homework from "./misc/homework";
import User from "./misc/user";

export default class Storage {
    users: NodeCache;
    instance: HwBackend;

    constructor(instance: HwBackend) {
        this.users = new NodeCache();
        this.instance = instance;
    }

    async getUser(id: number): Promise<User | undefined> {
        if (this.users.get(id) != undefined) {
            return this.users.get(id);
        }
        this.instance.database?.pool.query(`SELECT * FROM users WHERE id = ${id}; SELECT * FROM timetable WHERE userId = ${id}; SELECT * FROM homework WHERE userId = ${id}`, (error, results, fields) => {
            if (results[0] != undefined) {
                let userData = results[0];
                let timetable = results[1];
                let homework: Homework[];
                
                let next: boolean = true;
                let step: number = 0;
                while (next) {
                    if (results[2 + step] != undefined) {
                        
                    }
                }
            }
        });
    }
}