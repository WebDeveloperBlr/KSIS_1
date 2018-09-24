const net = require('net');

/*const server = net.createServer((socket) => {
    socket.write('Hello server');
    socket.pipe(socket);
});*/
const port = 2000;
const clients = [];

const server = new net.createServer((socket) => {

    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    clients[socket.name] = socket;

    broadcast(`${socket.name} connected`, socket.name);
    socket.write(`Hello, your name is ${socket.name}!`);
    socket.pipe(socket);

    socket.on('data', data => broadcast(data, socket.name));
    socket.on('end', () => {
        clients[socket.name] = undefined;
        broadcast(`${socket.name} left the channel!`);
    })
});

function broadcast(message, sender_name) {

    process.stdout.write(`\n`);
    process.stdout.write(`\nMessage is ${message};\nОтправитель: ${sender_name};\nПолучатели: `);

    for (const key in clients) {
        if(((key !== sender_name) && clients[key])) {
            process.stdout.write(` ${key}`);
            clients[key].write(`\n${sender_name} - ${message}`);
        }
    }
    process.stdout.write(`\n`);
}

server.listen(port, () => {
    console.log(`Server is listening on port ${port}!`)
});