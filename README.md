# Typescript Live Chat Demo
### * Express, React, Socket.io and RxJS + Redis(Pub/Sub).
### * 문리적 서버가 분리되어있을때는 각 서버가 소켓 포트를 각기 열고 있고 서로같에 공유가 안될때를 사용목적.


### Redis Required
````
localhost
6379
````

### Setup
````

cd server
yarn install

cd client
yarn install
````

### Web 체팅 화면 Demo URL
````
http://localhost:3000/
````
* 채팅화면에서 메세지를 보낼경우 해당 서버에 소켓으로 연결된 사람에게만 받아진다..  

### API 호출 Sample URL
````
http://localhost:8080?author=홍길1&message=33331212
````
* API로 호출시에는 레디스에 PUB(레디스에 전송을 하기때문에) 각각 다른 서버가 다시 레디스를 통해  실행되면서 SUB 하고있어서 
* chat_procdess.jpeg 참조



