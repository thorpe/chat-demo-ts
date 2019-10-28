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
  public static readonly PORT: number = 8081;
  private readonly _app: express.Application;
  private readonly server: Server;
  private io: SocketIO.Server;
  private readonly port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
    ChatServer.initRedis();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private static initRedis(): void {
    const subscriber: redis.RedisClient = redis.createClient(6379, 'localhost')
    subscriber.on("message",(channel,message) => {
      console.log("Received data :"+message);
    })
    subscriber.subscribe("user-notify")
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
