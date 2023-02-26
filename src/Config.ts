import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import HwBackend from "./HwBackend";
import WebUtil from "./WebUtil";

export default class Webserver {
    instance: HwBackend;
    configuration: Map<string, any>;

    constructor(instance: HwBackend) {
        this.instance = instance;
        this.configuration = new Map<string, any>();
    }

    async get(key: string, defaultValue: any): Promise<any> {
        if (!this.configuration.has(key)) {
            let result = await this.instance.getPrismaClient().config.findUnique({
                where: {
                    key: key
                }
            });
            if (result) {
                this.configuration.set(key, result.value);
            } else {
                this.configuration.set(key, defaultValue);

                await this.instance.getPrismaClient().config.create({
                    data: {
                        key: key,
                        value: defaultValue
                    }
                });
            }
        }
        return this.configuration.get(key);
    }

    async set(key: string, value: any): Promise<void> {
        this.configuration.set(key, value);

        await this.instance.getPrismaClient().config.upsert({
            where: {
                key: key
            },
            update: {
                value: value
            },
            create: {
                key: key,
                value: value
            }
        });
    }
}