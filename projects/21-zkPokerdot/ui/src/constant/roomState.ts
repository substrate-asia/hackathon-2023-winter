import type { PokerCard } from './poker';

export interface Player {
  name: string;
  hands: PokerCard[];
  isLandlord: boolean;
  isReady: boolean;
  hitedHands:PokerCard[];
}

export interface RoomState {
  players: Player[];
  currentPlayerIndex: number;
  roomState: 'waiting' | 'inProgress'| 'called' | 'finished';
  roomName: string;
  remainingCards: PokerCard[];
}

export class Room {
  //创建游戏
  public static createGame(roomName: string): void {
    const roomState: RoomState = {
      players: [
        { name: 'Alice', hands: [], isLandlord: false, isReady: false,hitedHands:[] }
      ],
      currentPlayerIndex: 0,
      roomState: 'waiting',
      roomName: roomName,
      remainingCards: []
    };
    localStorage.setItem(roomName, JSON.stringify(roomState));
  }

  //更新玩家状态
  public static updatePlayerStatus(
    roomName: string,
    playerName: string,
    isReady?: boolean,
    isLandlord?: boolean,
    hands?: PokerCard[]
  ){
    const roomState = Room.getRoomState(roomName);
    const player = roomState.players.find(p => p.name === playerName);
    if (player) {
      if (typeof isReady !== 'undefined') {
        player.isReady = isReady;
      }
      if (typeof isLandlord !== 'undefined') {
        player.isLandlord = isLandlord;
      }
      if (hands) {
        player.hands = hands.sort((a,b)=>b.id-a.id);
      }

      localStorage.setItem(roomName, JSON.stringify(roomState));
    }
  }
  //设置打的手牌
  public static setHitedHands(
    roomName: string,
    playerName: string,
    hitedHands:PokerCard[])
  {
    const roomState = Room.getRoomState(roomName);
    const player = roomState.players.find(p => p.name === playerName);
    if (player) {
      player.hitedHands = hitedHands;
    }
    localStorage.setItem(roomName, JSON.stringify(roomState));
  }

  //获取整个游戏状态
  public static getRoomState(roomName: string): RoomState {
    return JSON.parse(localStorage.getItem(roomName) || '{}') as RoomState;
  }
  //加入游戏
  public static joinGame(roomName: string): void {
    const roomState = Room.getRoomState(roomName);
    const playNum = roomState.players.length;
    if (playNum < 3) {
      if (playNum === 1) {
        roomState.players.push({ name: 'Bob', hands: [], isLandlord: false, isReady: false ,hitedHands:[]});
      }
      if (playNum === 2) {
        roomState.players.push({ name: 'Carol', hands: [], isLandlord: false, isReady: false ,hitedHands:[]});
      }
      localStorage.setItem(roomName, JSON.stringify(roomState));
    }
  }

  //判断所有玩家都准备
  public static areThreePlayersReady(roomName: string): boolean {
    const roomState = Room.getRoomState(roomName);
    return roomState.players.length === 3 && roomState.players.every(player => player.isReady);
  }

  // 房间索引
  public static setCurrentPlayerIndex(roomName: string, index: number): void {
    const roomState = Room.getRoomState(roomName);
    roomState.currentPlayerIndex = index;
    localStorage.setItem(roomName, JSON.stringify(roomState));
  }

  // 更新房间状态
  public static setRoomState(roomName: string, newState: 'waiting' | 'inProgress' | 'called' |'finished'): void {
    const roomState = Room.getRoomState(roomName);
    roomState.roomState = newState;
    localStorage.setItem(roomName, JSON.stringify(roomState));
  }

  // 分发牌给玩家
  public static distributeCards(roomName: string, playersCards: PokerCard[][], remainingCards: PokerCard[]): void {
    const roomState = Room.getRoomState(roomName);
    if (roomState.players.length === 3) {
      // 将牌分发给玩家
      for (let i = 0; i < roomState.players.length; i++) {
        roomState.players[i].hands = playersCards[i].sort((a, b) => b.id - a.id);
      }
      // 可以选择将底牌保存到 roomState 中，如果需要
      roomState.remainingCards = remainingCards;
      // 更新房间状态
      localStorage.setItem(roomName, JSON.stringify(roomState));
    }
  }
}
