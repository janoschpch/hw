export default class Homework {
    private id: number;
    private subject: string;
    private description: string;
    private created: Date;
    private done: boolean;

    constructor(id: number, subject: string, description: string, created: Date, done: boolean) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.created = created;
        this.done = done;
    }

    public getId(): number {
        return this.id;
    }

    public getSubject(): string {
        return this.subject;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCreated(): Date {
        return this.created;
    }

    public isDone(): boolean {
        return this.done;
    }

    public setDone(done: boolean): void {
        this.done = done;
    }

    public setSubject(subject: string): void {
        this.subject = subject;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
}