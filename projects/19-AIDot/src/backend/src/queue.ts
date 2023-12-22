export class MessageQueue {
    public queue: Function[] = [];
    public syncing: boolean = false;

    constructor () {
        this.queue = [];
    }

    async add(handler: Function) {
        this.queue.push(handler);

        if (!this.syncing) {
            this.syncing = true;
            await this.sync();
        }
    }

    async sync() {
        while (this.queue.length !== 0) {
            const handler = this.queue.shift();

            try {
                if (handler) await handler();
            } catch (e) { continue; }
        }

        this.syncing = false;
    }
}
