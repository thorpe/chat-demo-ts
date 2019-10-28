import * as express from 'express';
import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as SocketIO from "socket.io";
import * as redis from 'redis'
import * as util from "util";

const cors = require('cors');

export interface ChatMessage {
  author: string;
  message: string;
}

export enum ChatEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message'
}


export class ChatServer {
  public static readonly PORT: number = 8080;
  private readonly _app: express.Application;
  private readonly server: Server;
  private io: SocketIO.Server;
  private readonly port: string | number;

  constructor() {
    this._app = express();

    this._app.get('/', function(req, res) {
      const publisher: redis.RedisClient = redis.createClient(6379, 'localhost')
      const user = {
        id : req.query.id,
        message : req.query.message
      }
      publisher.publish("user-notify",JSON.stringify(user))

      res.send(user);
    });

    this.port = ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    ChatServer.initRedis();
    this.listen();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private static initRedis(): void {
    const subscriber: redis.RedisClient = redis.createClient(6379, 'localhost')
    subscriber.on("message",(channel,message) => {
      console.log("Received data :"+message);
    })
    const sub = subscriber.subscribe("user-notify")
    console.log('Redis 4====================================');
    console.log(sub);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(ChatEvent.CONNECT, (socket: any) => {
      console.log('Connected client on port %s.', this.port);

      socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on(ChatEvent.DISCONNECT, () => {
        console.log('Client disconnected');
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
