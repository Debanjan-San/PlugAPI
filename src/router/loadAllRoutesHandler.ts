import { Router } from 'express';
import { readdirSync } from 'fs';
import { Plugin } from '../types/index';
import { join } from 'path';

const omit = (obj: Plugin, omitKey: keyof Plugin): Omit<Plugin, 'run'> => {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== omitKey)) as Omit<Plugin, 'run'>;
};

export default () => {
    const apis: Omit<Plugin, 'run'>[] = [];
    const router = Router();

    const commandFiles = readdirSync(join(__dirname, '..', 'plugins'));

    for (const file of commandFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const plugin: Plugin = require(join(__dirname, '..', 'plugins', file)).default();
        plugin.run(router);
        apis.push(omit(plugin, 'run'));
        console.log('Loaded ' + file);
    }

    return { apis, router };
}


