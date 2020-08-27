const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { start } = require('./public/snake/main.js');
const {
  pushPlayer,
  deletePlayer,
  changeDirectionHandler,
  snakes,
  players,
} = require('./public/snake/players');
const { getRandomFoodPosition } = require('./public/snake/food');

const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('game');
});

io.on('connection', (socket) => {
  const ID = uuidv4();
  pushPlayer(ID, {
    socket,
  });

  socket.join('game');
  socket.emit('id', ID);

  socket.to('game').emit('player-connected');

  socket.on('change-direction', (direction) => {
    snakes.has(ID) && changeDirectionHandler(ID, direction);
  });

  socket.on('start-game', () => {
    snakes.set(ID, {
      dir: { x: 0, y: 0 },
      snakeBody: [getRandomFoodPosition()],
      newSegments: { nr: 0 },
    });
    socket.emit('game-started');
  });

  socket.on('disconnect', function () {
    deletePlayer(ID);
  });
});

start(io);
server.listen(process.env.PORT || '3000', (port) => {
  console.log(`Server started on ${port}`);
});
