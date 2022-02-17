import NodeCache from "node-cache";
import { getUsers } from "../dao/userDao.js";
import { log } from "../utils/logger.js";

let cache = null;

export async function cacheInitialization () {
    if ( cache ) {
        return cache;
    }
    cache = new NodeCache();
    const users = await getUsers();

    users.forEach( user => {
        const userData = JSON.parse( user.metadata );
        cache.set(`user[${userData.id}]`, userData);
    });

    log.info(`Cache Initialized w/ ${cache.keys().length} users.`);
    log.info(`Keys`, cache.keys());

}

export function cacheProvider () {
    return cache;
}

export const putCachedUser = ( user ) => {
    cache.set(`user[${user.id}]`, user);
}

export const getCachedUser = ( id ) => {
    return cache.get(`user[${id}]`);
}