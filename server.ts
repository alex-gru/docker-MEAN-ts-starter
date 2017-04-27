import * as express from "express";
import * as http from "http";
import * as reload from "reload";
import * as mongoose from "mongoose";
import * as path from "path";

// Constants
const port = 8080;

// App
const app = express();

// provide paths to static files
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/views", express.static(__dirname + '/views'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

let Greeting;
app.get('/', (req, res) => {
  Greeting.findOne((err, greeting) => {
    res.render('index', {title: "Dockerized MEAN Greeter", greeting: greeting.text});
  })
});

const server = http.createServer(app);

reload(server, app);

server.listen(port, () => {
  const host = server.address().address;
  console.log("Webapp listening at http://%s:%s", host, port)
});


if (mongoose.connection.readyState === 0) {
  /* 0 = disconnected, 1 = connected,  2 = connecting,  3 = disconnecting  */
  mongoose.connect('mongodb://mongodb:27017/db');
  mongoose.connection.on('connected', () => {
    log("Connection to MongoDB established.");
    Greeting = mongoose.model('Greeting',
        new mongoose.Schema({text: String}),
        'greetings');     // collection name
  });
}

function log(message:any) {
  const date = new Date();
  console.log(date.toISOString() + " - ",message);
}
