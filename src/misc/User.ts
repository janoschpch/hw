import Homework from "./Homework";

export default class User {
    private id: number;
    private name: string;
    private email: string;
    private passwordHash: string;
    private role: string;
    private homework: Homework[];

    added: boolean = false;

    constructor(id: number, name: string, email: string, passwordHash: string, role: string, homework: Homework[]) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.homework = homework;

        this.addHomework = this.addHomework.bind(this);
        this.removeHomework = this.removeHomework.bind(this);
        this.setName = this.setName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPasswordHash = this.setPasswordHash.bind(this);
        this.setRole = this.setRole.bind(this);
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

    public getRole(): string {
        return this.role;
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

    public setRole(role: string): void {
        this.role = role;
    }

    public addHomework(homework: Homework): void {
        this.homework.push(homework);
    }

    public removeHomework(homework: Homework): void {
        this.homework.splice(this.homework.indexOf(homework), 1);
    }
}