"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class Show {
    constructor(dongle) {
        this.isRunning = false;
        this.dongle = dongle;
    }
    start() {
        const now = moment();
        console.log(`Starting the Show! ${now.toISOString()}`);
        this.scheduledCommands = [];
        this.isRunning = true;
        this.scheduleCommand(this.seconds(5), () => {
            this.dongle.bedDown();
        });
        this.scheduleCommand(this.seconds(20), () => {
            this.dongle.backHalfUp();
        });
        this.scheduleCommand(this.seconds(40), () => {
            this.dongle.fullUp();
        });
        this.scheduleCommand(this.seconds(70), () => {
            this.dongle.backHalfDown();
        });
        this.timer = setInterval(() => {
            this.tick();
        }, 1000);

    }
    stop() {
        console.log(`The Show is over...${now.toISOString()}`);
        this.isRunning = false;
        clearTimeout(this.restartTimer);
        clearInterval(this.timer);
        this.timer = undefined;
    }
    scheduleCommand(date, command) {
        this.scheduledCommands.push({
            executionDate: date,
            command: command
        });
    }
    tick() {
        const now = moment();
        console.log(`tick ${now.toISOString()}`);
        this.scheduledCommands = this.scheduledCommands.filter((command) => {
            console.log(`diff: ${command.executionDate.diff(now, "milliseconds")}`);
            if (command.executionDate.diff(now, "milliseconds") <= 500) {
                // Execute it
                command.command();
                return false; // Remove it
            }
            return true; // Keep it for the future
        });
    }
    seconds(seconds) {
        return moment().add(seconds, "seconds");
    }
}
exports.Show = Show;
//# sourceMappingURL=Show.js.map