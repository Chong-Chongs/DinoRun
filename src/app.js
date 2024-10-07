import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server); // 소켓 초기화

app.get('/', (req, res) => {
  res.send('Hello');
});

server.listen(PORT, async () => {
  console.log(`서버가 ${PORT} 포트로 정상적으로 실행 되었습니다.`);

  // 이 곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log('Assets loaded successfully');
    if (!redisClient.status || redisClient.status !== 'connect') {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Failed to initialize game', error);
  }
});
