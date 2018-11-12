"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Direction_1 = require("./types/Direction");
const CBU_1 = require("./types/CBU");
const FINGERPRINTSET = [
    "97:56:5C:BF:F5:1B:CC:D8:DD:2D:37:83:4E:E3:02:05:66:41:82:F1"
];
class Dongle {
    constructor() {
        this.dongleIP = "192.168.178.31";
        // private dongleIP = "192.168.42.146";
        this.dongleKey = "tkdbkfhz";
        console.log(`Dongle constructor`);
        this.agent = new http.Agent({
            rejectUnauthorized: false,
            keepAlive: true,
        });
    }
    toStartState() {
        const path = `/api/cbu/motor?move=${Direction_1.Direction.Up}&cbu=${CBU_1.CBU.Both}&motor=0`;
        this.repeatRequests(path, 3);
    }
    bedDown() {
        const path = `/api/cbu/motor?move=${Direction_1.Direction.Down}&cbu=${CBU_1.CBU.Both}&motor=0`;
        this.repeatRequests(path, 5);
    }
    backHalfUp() {
        const path = `/api/cbu/motor?move=${Direction_1.Direction.Up}&cbu=${CBU_1.CBU.Both}&motor=2`;
        this.repeatRequests(path, 3);
    }
    fullUp() {
        const path = `/api/cbu/motor?move=${Direction_1.Direction.Up}&cbu=${CBU_1.CBU.Both}&motor=0`;
        this.repeatRequests(path, 3);
    }
    backHalfDown() {
        const path = `/api/cbu/motor?move=${Direction_1.Direction.Down}&cbu=${CBU_1.CBU.Both}&motor=0`;
        this.repeatRequests(path, 3);
    }
    repeatRequests(path, count) {
        this.sendRequest(path)
            .then(() => {
            if (count > 1) {
                const newCount = count - 1;
                setTimeout(() => {
                    this.repeatRequests(path, newCount);
                }, 1800);
            }
        })
            .catch(e => {
            console.log(e);
            if (count > 1) {
                const newCount = count - 1;
                setTimeout(() => {
                    this.repeatRequests(path, newCount);
                }, 1800);
            }
        });
    }
    sendRequest(path) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.dongleIP,
                port: 80,
                path: path,
                method: "GET",
                headers: {
                    "X-Key": this.dongleKey
                },
                agent: this.agent
            };
            console.log(`start req ${options.method} ${options.path}`);
            const req = http.request(options, res => {
                res.setEncoding("utf8");
                res.on("data", d => {
                    console.log(`BODY: ${d}`);
                    console.log(`end req ${options.method} ${options.path}`);
                    resolve();
                });
            });
            req.on("error", e => {
                console.log(`dongle error`, e);
                reject(e);
            });
            req.on("socket", (socket) => {
                console.log(`socket`);
                socket.on("secureConnect", () => {
                    const fingerprint = socket.getPeerCertificate().fingerprint;
                    console.log(`fingerprint ${fingerprint}`);
                    if (FINGERPRINTSET.indexOf(fingerprint) === -1) {
                        req.emit("error", new Error("Fingerprint doesn't match: " + fingerprint));
                        return req.abort();
                    }
                });
            });
            req.end();
        });
    }
}
exports.Dongle = Dongle;
//# sourceMappingURL=Dongle.js.map