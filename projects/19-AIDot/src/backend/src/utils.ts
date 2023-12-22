export function clog(content: string) {
    console.log(`\x1b[32mLOG\x1b[0m [${(new Date()).toISOString()}] ${content}`);
}

export function cerror(content: string) {
    console.log(`\x1b[31mERROR\x1b[0m [${(new Date()).toISOString()}] ${content}`);
}
