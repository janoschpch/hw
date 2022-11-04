import Homework from "./Homework";

export default class User {
    private id: number;
    private name: string;
    private email: string;
    private passwordHash: string;
    private homework: Homework[];

    added: boolean = false;

    constructor(id: number, name: string, email: string, passwordHash: string, homework: Homework[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.homework = homework;

        this.addHomework = this.addHomework.bind(this);
        this.removeHomework = this.removeHomework.bind(this);
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPasswordHash(): string {
        return this.passwordHash;
    }

    public getHomework(): Homework[] {
        return this.homework;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPasswordHash(passwordHash: string): void {
        this.passwordHash = passwordHash;
    }

    public addHomework(homework: Homework): void {
        this.homework.push(homework);
    }

    public removeHomework(homework: Homework): void {
        this.homework.splice(this.homework.indexOf(homework), 1);
    }
}