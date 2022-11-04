export default class Homework {
    subject: string;
    description: string;
    until: number;
    created: number;
    done: boolean;

    constructor(subject: string, description: string, until: number, created: number, done: boolean) {
        this.subject = subject;
        this.description = description;
        this.until = until;
        this.created = created;
        this.done = done;
    }
}