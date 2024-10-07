import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems, initializeItems } from '../models/item.model.js';

// 게임 시작
export const gameStart = (uuid, payload) => {
  // 게임의 전체 스테이지 데이터 로드
  const { stages } = getGameAssets();
  clearStage(uuid);
  initializeItems(uuid);
  // 유저의 첫 번째 스테이지 설정, 타임스템프 기록
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

// 게임 종료
export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;

  // 유저가 플레이한 스테이지 데이터 불러오기
  const stages = getStage(uuid);

  // 유저가 획득한 아이템 정보 불러오기
  const userItems = getUserItems(uuid);

  // 유저의 스테이지 데이터 정보가 없다면 에러 메세지 반환
  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 총 점수 계산
  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);

  // 점수와 타임스탬프 검증 (예: 클라이언트가 보낸 총점과 계산된 총점 비교)
  if (Math.abs(totalScore - score) > 1) {
    return { status: 'fail', message: 'Score verification failed' };
  }
  console.log(`totalScore: ${totalScore}`);
  console.log(`score: ${score}`);

  // 검증이 통과되면 게임 종료 처리
  return { status: 'success', message: 'Game ended successfully', score, handler: 3 };
};
