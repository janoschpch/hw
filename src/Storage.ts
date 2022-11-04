import NodeCache from "node-cache";
import HwBackend from "./HwBackend";
import Homework from "./misc/Homework";
import User from "./misc/User";

export default class Storage {
    users: NodeCache;
    instance: HwBackend;

    constructor(instance: HwBackend) {
        this.users = new NodeCache();
        this.instance = instance;

        this.users.on("del", (key, value) => {
            this.onRemoveCachedUser(value);
        });
    }

    public async getUser(id: number): Promise<User | undefined> {
        if (this.users.get(id) != undefined) {
            return this.users.get(id);
        }
        this.instance.getLogger().info(`User with id ${id} not found in cache, trying to fetch from database...`);
        const user = await this.instance.getPrismaClient().user.findUnique({
            where: {
                id: id
            }
        });
        if (user == null) {
            this.instance.getLogger().info(`User with id ${id} not found in database.`);
            return undefined;
        }
        const homework = await this.instance.getPrismaClient().homework.findMany({
            where: {
                userId: id
            }
        });
        this.instance.getLogger().info(`User with id ${id} found in database, adding to cache...`);

        const homeworkArray: Homework[] = [];
        homework.forEach((hw) => {
            homeworkArray.push(new Homework(hw.id, hw.subject, hw.description, hw.createdAt, hw.done));
        });

        const userObject = new User(user.id, user.name ? user.name : user.email, user.email, user.passwordHash, homeworkArray);

        this.users.set(id, userObject, 60 * 60 * 1);
        return userObject;
    }

    public async createUser(name: string, email: string, passwordHash: string): Promise<User> {
        const user = await this.instance.getPrismaClient().user.create({
            data: {
                name: name,
                email: email,
                passwordHash: passwordHash
            }
        });

        const userObject = new User(user.id, user.name ? user.name : user.email, user.email, user.passwordHash, []);
        this.users.set(user.id, userObject, 60 * 60 * 1);
        return userObject;
    }

    public async deleteUser(user: User): Promise<void> {
        this.users.del(user.getId());

        this.instance.getPrismaClient().user.delete({
            where: {
                id: user.getId()
            }
        });
    }

    public async createHomework(user: User, subject: string, description: string): Promise<Homework> {
        const homework = await this.instance.getPrismaClient().homework.create({
            data: {
                subject: subject,
                description: description,
                userId: user.getId()
            }
        });

        const homeworkObject = new Homework(homework.id, homework.subject, homework.description, homework.createdAt, homework.done);
        user.addHomework(homeworkObject);
        return homeworkObject;
    }

    public async deleteHomework(user: User, homework: Homework): Promise<void> {
        user.removeHomework(homework);

        this.instance.getPrismaClient().homework.delete({
            where: {
                id: homework.getId()
            }
        });
    }

    private onRemoveCachedUser(user: User) {
        this.instance.getLogger().info(`Saving user ${user.getId()} to database...`);

        this.instance.getPrismaClient().user.update({
            where: {
                id: user.getId()
            },
            data: {
                name: user.getName(),
                email: user.getEmail(),
                passwordHash: user.getPasswordHash()
            }
        });

        user.getHomework().forEach((hw) => {
            this.instance.getPrismaClient().homework.update({
                where: {
                    id: hw.getId()
                },
                data: {
                    subject: hw.getSubject(),
                    description: hw.getDescription(),
                    createdAt: hw.getCreated(),
                    done: hw.isDone()
                }
            });
        });


        this.instance.getLogger().info(`User with id ${user.getId()} removed from cache.`);
    }
}