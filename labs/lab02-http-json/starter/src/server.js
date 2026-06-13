import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {

    const isOperationValid = typeof body.operation === 'string';
    const isAValid = typeof body.a === 'number';
    const isBValid = typeof body.b === 'number';

    if (isOperationValid && isAValid && isBValid) {
        if (body.operation === "add") {
            const addResult = body.a + body.b;
            return {
                statusCode: 200,
                response: {
                result: addResult
                }
            };
        }
        if (body.operation === "subtract") {
            const subtractResult = body.a - body.b;
            return {
                statusCode: 200,
                response: {
                result: subtractResult
                }
            };
        }
        if (body.operation === "multiply") {
            const multiplyResult = body.a * body.b;
            return {
                statusCode: 200,
                response: {
                result: multiplyResult
                }
            };
        }
        if (body.operation === "divide") {
            if (body.b === 0) {
                return {
                    statusCode: 400,
                    response: {
                    error: "Division by zero"
                    }
                };
            }
            const divideResult = body.a / body.b;
            return {
                statusCode: 200,
                response: {
                result: divideResult
                }
            };

        }

        return {
            statusCode: 400,
            response: {
                error: "Unsupported Operation"
            }
        };
    }

    return {
        statusCode: 400,
        response: {
            error: "Invalid JSON"
        }
    };
}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "GET" && url === "/time") {
        const time = new Date();
        sendJson(res, 200, { time: time.toString() });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);
            sendJson(res, 200, { message: body.message });
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

// if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
// }