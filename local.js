const fs = require("fs");
fs.existsSync(".env") || fs.writeFileSync(".env", fs.readFileSync(".env.example"));
require("dotenv").config();
const log = (msg, nl) => console.log(`\x1b[34m${nl ? '\n' : ''}[Local Lambda] ${msg}\x1b[0m`);
let handlers = {};
require("http").createServer((request, response) => {
    log("----- Received request -----", true);
    log("* method: " + request.method);
    log("* path: " + request.url);
    log("* headers: " + request.rawHeaders);
    if (request.method !== "POST") {
        response.writeHeader(405, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ "error": "Method Not Allowed" }));
        response.end();
        return;
    };
    const handler = Object.keys(handlers).length === 1 ? handlers[Object.keys(handlers)[0]] : handlers[request.url];
    if (!handler) {
        response.writeHeader(404, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ "error": "Not Found" }));
        response.end();
        return;
    }
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', _ => {
        const data = process.env.MIMICK_APIGW === "true" ? { "body": "" + Buffer.concat(chunks) } : JSON.parse(Buffer.concat(chunks));
        log(`* data: ${JSON.stringify(data)}`);
        log("----- Invoking handler -----\n");
        handler(data).then((res) => {
            response.writeHeader(res.statusCode, { "Content-Type": "application/json" });
            response.write(JSON.stringify(res.body));
            response.end();
            log("----- Request complete -----\n", true);
        }).catch((err) => {
            log("Error from handler: " + err)
            response.writeHeader(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ "error": "Internal Server Error" }));
            response.end();
            log("----- Request complete -----\n", true);
        })
    });
}).listen(process.env.PORT).on("listening", () => {
    log(`Listening on http://localhost:${process.env.PORT}, handlers:`, true);
    process.env.HANDLERS.split(",").forEach(handler => {
        log(` * http://localhost:${process.env.PORT}/${handler}`);
    });
    log(`----- Starting handlers (${process.env.HANDLERS}) -----\n`, true);
    process.env.HANDLERS.split(",").forEach(handler => {
        handlers[`/${handler}`] = require(`./${handler.split(".")[0]}.js`)[handler.split(".")[1]];
    });
});
