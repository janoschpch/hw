import NodeCache from "node-cache";
import HwBackend from "./HwBackend";
import Homework from "./misc/Homework";
import User from "./misc/User";
import share from "./routes/api/v1/homework/share";

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

    public async getUserByMail(email: string): Promise<User | undefined> {
        const user = await this.instance.getPrismaClient().user.findUnique({
            where: {
                email: email
            }
        });

        if (user == null) {
            return undefined;
        }

        return await this.getUser(user.id);
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

    public async createHomework(user: User, subject: string, description: string, done: boolean): Promise<Homework> {
        const homework = await this.instance.getPrismaClient().homework.create({
            data: {
                subject: subject,
                description: description,
                done: done,
                userId: user.getId()
            }
        });

        const homeworkObject = new Homework(homework.id, homework.subject, homework.description, homework.createdAt, homework.done);
        user.addHomework(homeworkObject);
        this.users.set(user.getId(), user, 60 * 60 * 1);
        return homeworkObject;
    }

    public async updateHomework(user: User, homework: Homework): Promise<void> {
        await this.instance.getPrismaClient().homework.update({
            where: {
                id: homework.getId()
            },
            data: {
                subject: homework.getSubject(),
                description: homework.getDescription(),
                done: homework.isDone()
            }
        });

        this.users.set(user.getId(), user, 60 * 60 * 1);
    }

    public async updateUser(user: User): Promise<void> {
        await this.instance.getPrismaClient().user.update({
            where: {
                id: user.getId()
            },
            data: {
                name: user.getName(),
                email: user.getEmail(),
                passwordHash: user.getPasswordHash()
            }
        });

        this.users.set(user.getId(), user, 60 * 60 * 1);
    }

    public async deleteHomework(user: User, homework: Homework): Promise<void> {
        user.removeHomework(homework);
        this.users.set(user.getId(), user, 60 * 60 * 1);

        await this.instance.getPrismaClient().shared.deleteMany({
            where: {
                homeworkId: homework.getId()
            }
        });

        await this.instance.getPrismaClient().homework.delete({
            where: {
                id: homework.getId()
            }
        });
    }

    public async hasBeenSharedBefore(user: User, homework: Homework): Promise<boolean> {
        const shared = await this.instance.getPrismaClient().shared.findFirst({
            where: {
                homeworkId: homework.getId(),
                userId: user.getId()
            }
        });

        if (shared == null) {
            return false;
        }
        return true;
    }

    public async isShared(user: User, homework: Homework): Promise<any> {
        const shared = await this.instance.getPrismaClient().shared.findFirst({
            where: {
                homeworkId: homework.getId(),
                userId: user.getId()
            }
        });

        if (shared == null) {
            return {
                shared: false,
                accessToken: null
            };
        }
        return {
            shared: shared.isShared,
            accessToken: shared.accessToken
        }
    }

    public async setShared(user: User, homework: Homework, shared: boolean): Promise<string> {
        const sharedObject = await this.instance.getPrismaClient().shared.findFirst({
            where: {
                homeworkId: homework.getId(),
                userId: user.getId()
            }
        });

        if (sharedObject == null) {
            const data = await this.instance.getPrismaClient().shared.create({
                data: {
                    homeworkId: homework.getId(),
                    userId: user.getId(),
                    isShared: shared,
                    accessToken: this.generateToken()
                }
            });
            return data.accessToken;
        } else {
            const data = await this.instance.getPrismaClient().shared.update({
                where: {
                    id: sharedObject.id
                },
                data: {
                    isShared: shared
                }
            });
            return data.accessToken;
        }
    }

    public async getSharedHomework(token: string): Promise<any | undefined> {
        const shared = await this.instance.getPrismaClient().shared.findFirst({
            where: {
                accessToken: token
            }
        });

        if (shared == null || !shared.isShared) {
            return undefined;
        }

        const homework = await this.instance.getPrismaClient().homework.findUnique({
            where: {
                id: shared.homeworkId
            }
        });

        if (homework == null) {
            return undefined;
        }

        await this.instance.getPrismaClient().shared.update({
            where: {
                id: shared.id
            },
            data: {
                views: shared.views + 1
            }
        });

        return {
            subject: homework.subject,
            description: homework.description,
            createdAt: homework.createdAt,
            user: await this.getUser(shared.userId)
        };
    }

    public async userExists(email: string): Promise<boolean> {
        const user = await this.instance.getPrismaClient().user.findUnique({
            where: {
                email: email
            }
        });

        return user != null;
    }

    public async createSession(user: User, expires: Date, deviceInfo: string): Promise<string> {
        const session = await this.instance.getPrismaClient().session.create({
            data: {
                userId: user.getId(),
                expiresAt: expires,
                token: this.generateToken(),
                deviceInfo: deviceInfo
            }
        });

        return session.token;
    }

    public async getSession(token: string): Promise<User | undefined> {
        const session = await this.instance.getPrismaClient().session.findFirst({
            where: {
                token: token
            }
        });

        if (session == null) {
            return undefined;
        }

        if (session.expiresAt < new Date()) {
            this.instance.getPrismaClient().session.delete({
                where: {
                    id: session.id
                }
            });
            return undefined;
        }

        const date = new Date();
        date.setHours(date.getHours() + 1);

        await this.instance.getPrismaClient().session.update({
            where: {
                id: session.id
            },
            data: {
                lastUsed: date
            }
        });

        return await this.getUser(session.userId);
    }

    public async deleteSession(token: string): Promise<void> {
        await this.instance.getPrismaClient().session.deleteMany({
            where: {
                token: token
            }
        });
        return;
    }

    private generateToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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