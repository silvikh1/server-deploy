const{ createServer } = require('http')
const{ Server } = require('socket.io');

let allCounts = {};

const PORT = Number(process.env.PORT);
const ORIGIN = 'http://tumo-silvikh1-client.vercel.app';



const httpserver = createServer();
const io = new Server (httpserver, { cors: { origin: ORIGIN }});


io.on('connection',(socket) => {
 console.log(socket.id, 'client server connection');

 socket.join('room');

 if (!allCounts[socket.id]){
    allCounts[socket.id] = 0;
 }
      
 
 socket.emit('update-count', allCounts);

 socket.on('increase-count',() => {
    console.log(allCounts[socket.id], 'increase-count');
    allCounts[socket.id]++;
     if (allCounts[socket.id] >= 30) {
         io.to('room').emit('winner', socket.id);
         io.socketsLeave("room");
      }

    io.to('room').emit('update-count', allCounts);
   });

   socket.on('disconnect', () => {
    delete allCounts[socket.id];
    socket.leave('room');
   });
});

httpserver.listen(PORT);