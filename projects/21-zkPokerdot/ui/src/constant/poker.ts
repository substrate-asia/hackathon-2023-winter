// type Suit = "spades" | "hearts" | "diamonds" | "clubs" | "red" | "black";
// type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A" | "JOKER";
export interface PokerCard {
  id: number;
  suit: string;
  rank: string;
  img: string;
  isSelected: boolean;
}

const POKERS: PokerCard[] = [
  {
    id: 1,
    suit: "spades",
    rank: "3",
    img: "3_of_spades",
    isSelected: false
  },
  {
    id: 2,
    suit: "hearts",
    rank: "3",
    img: "3_of_hearts",
    isSelected: false
  },
  {
    id: 3,
    suit: "diamonds",
    rank: "3",
    img: "3_of_diamonds",
    isSelected: false
  },
  {
    id: 4,
    suit: "clubs",
    rank: "3",
    img: "3_of_clubs",
    isSelected: false
  },//3从最小开始排
  {
    id: 5,
    suit: "spades",
    rank: "4",
    img: "4_of_spades",
    isSelected: false
  },
  {
    id: 6,
    suit: "hearts",
    rank: "4",
    img: "4_of_hearts",
    isSelected: false
  },
  {
    id: 7,
    suit: "diamonds",
    rank: "4",
    img: "4_of_diamonds",
    isSelected: false
  },
  {
    id: 8,
    suit: "clubs",
    rank: "4",
    img: "4_of_clubs",
    isSelected: false
  },//4
  {
    id: 9,
    suit: "spades",
    rank: "5",
    img: "5_of_spades",
    isSelected: false
  },
  {
    id: 10,
    suit: "hearts",
    rank: "5",
    img: "5_of_hearts",
    isSelected: false
  },
  {
    id: 11,
    suit: "diamonds",
    rank: "5",
    img: "5_of_diamonds",
    isSelected: false
  },
  {
    id: 12,
    suit: "clubs",
    rank: "5",
    img: "5_of_clubs",
    isSelected: false
  },//5
  {
    id: 13,
    suit: "spades",
    rank: "6",
    img: "6_of_spades",
    isSelected: false
  },
  {
    id: 14,
    suit: "hearts",
    rank: "6",
    img: "6_of_hearts",
    isSelected: false
  },
  {
    id: 15,
    suit: "diamonds",
    rank: "6",
    img: "6_of_diamonds",
    isSelected: false
  },
  {
    id: 16,
    suit: "clubs",
    rank: "6",
    img: "6_of_clubs",
    isSelected: false
  },//6
  {
    id: 17,
    suit: "spades",
    rank: "7",
    img: "7_of_spades",
    isSelected: false
  },
  {
    id: 18,
    suit: "hearts",
    rank: "7",
    img: "7_of_hearts",
    isSelected: false
  },
  {
    id: 19,
    suit: "diamonds",
    rank: "7",
    img: "7_of_diamonds",
    isSelected: false
  },
  {
    id: 20,
    suit: "clubs",
    rank: "7",
    img: "7_of_clubs",
    isSelected: false
  },//7
  {
    id: 21,
    suit: "spades",
    rank: "8",
    img: "8_of_spades",
    isSelected: false
  },
  {
    id: 22,
    suit: "hearts",
    rank: "8",
    img: "8_of_hearts",
    isSelected: false
  },
  {
    id: 23,
    suit: "diamonds",
    rank: "8",
    img: "8_of_diamonds",
    isSelected: false
  },
  {
    id: 24,
    suit: "clubs",
    rank: "8",
    img: "8_of_clubs",
    isSelected: false
  },//8
  {
    id: 25,
    suit: "spades",
    rank: "9",
    img: "8_of_spades",
    isSelected: false
  },
  {
    id: 26,
    suit: "hearts",
    rank: "9",
    img: "9_of_hearts",
    isSelected: false
  },
  {
    id: 27,
    suit: "diamonds",
    rank: "9",
    img: "9_of_diamonds",
    isSelected: false
  },
  {
    id: 28,
    suit: "clubs",
    rank: "9",
    img: "9_of_clubs",
    isSelected: false
  },//9
  {
    id: 29,
    suit: "spades",
    rank: "10",
    img: "10_of_spades",
    isSelected: false
  },
  {
    id: 30,
    suit: "hearts",
    rank: "10",
    img: "10_of_hearts",
    isSelected: false
  },
  {
    id: 31,
    suit: "diamonds",
    rank: "10",
    img: "10_of_diamonds",
    isSelected: false
  },
  {
    id: 32,
    suit: "clubs",
    rank: "10",
    img: "10_of_clubs",
    isSelected: false
  },//10
  {
    id: 33,
    suit: "spades",
    rank: "J",
    img: "J_of_spades",
    isSelected: false
  },
  {
    id: 34,
    suit: "hearts",
    rank: "J",
    img: "J_of_hearts",
    isSelected: false
  },
  {
    id: 35,
    suit: "diamonds",
    rank: "J",
    img: "J_of_diamonds",
    isSelected: false
  },
  {
    id: 36,
    suit: "clubs",
    rank: "J",
    img: "J_of_clubs",
    isSelected: false
  },//J
  {
    id: 37,
    suit: "spades",
    rank: "Q",
    img: "Q_of_spades",
    isSelected: false
  },
  {
    id: 38,
    suit: "hearts",
    rank: "Q",
    img: "Q_of_hearts",
    isSelected: false
  },
  {
    id: 39,
    suit: "diamonds",
    rank: "Q",
    img: "Q_of_diamonds",
    isSelected: false
  },
  {
    id: 40,
    suit: "clubs",
    rank: "Q",
    img: "Q_of_clubs",
    isSelected: false
  },//Q
  {
    id: 41,
    suit: "spades",
    rank: "K",
    img: "K_of_spades",
    isSelected: false
  },
  {
    id: 42,
    suit: "hearts",
    rank: "K",
    img: "K_of_hearts",
    isSelected: false
  },
  {
    id: 43,
    suit: "diamonds",
    rank: "K",
    img: "K_of_diamonds",
    isSelected: false
  },
  {
    id: 44,
    suit: "clubs",
    rank: "K",
    img: "K_of_clubs",
    isSelected: false
  },//K
  {
    id: 45,
    suit: "spades",
    rank: "A",
    img: "A_of_spades",
    isSelected: false
  },
  {
    id: 46,
    suit: "hearts",
    rank: "A",
    img: "A_of_hearts",
    isSelected: false
  },
  {
    id: 47,
    suit: "diamonds",
    rank: "A",
    img: "A_of_diamonds",
    isSelected: false
  },
  {
    id: 48,
    suit: "clubs",
    rank: "A",
    img: "A_of_clubs",
    isSelected: false
  },//A
  {
    id: 49,
    suit: "spades",
    rank: "2",
    img: "2_of_spades",
    isSelected: false
  },
  {
    id: 50,
    suit: "hearts",
    rank: "2",
    img: "2_of_hearts",
    isSelected: false
  },
  {
    id: 51,
    suit: "diamonds",
    rank: "2",
    img: "2_of_diamonds",
    isSelected: false
  },
  {
    id: 52,
    suit: "clubs",
    rank: "2",
    img: "2_of_clubs",
    isSelected: false
  },//2
  {
    id: 53,
    suit: "black",
    rank: "JOKER",
    img: "black_joker",
    isSelected: false
  },
  {
    id: 54,
    suit: "red",
    rank: "JOKER",
    img: "red_joker",
    isSelected: false
  },
  //JOKER
]

function createPokerCard(id: number): PokerCard {
  let suit: string;
  let img: string;
  const rank:string = "2";
  const isSelected = false; // 默认值，可以根据需要调整
  // 示例逻辑：根据id确定suit和sortKey
  // 这里的逻辑应该根据你的具体需求来定制
  if (id === 1) {
    suit = 'spades';
    img = '2';
  } else if (id === 2) {
    suit = 'spades';
    img = "3";
  } else {
    // 默认值或错误处理
    suit = 'spades';
    img = '2';
  }

  return { id, suit, rank,img, isSelected };
}

// 洗牌函数
function shuffleDeck(deck: PokerCard[]): PokerCard[] {
  const shuffledDeck = [...deck]; // 创建牌组的副本以避免直接修改原数组
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

// 发牌函数
export function dealCards(): { playersCards: PokerCard[][], remainingCards: PokerCard[] } {
  const shuffledDeck = shuffleDeck(POKERS);
  const playersCards = [
    shuffledDeck.slice(0, 17),
    shuffledDeck.slice(17, 34),
    shuffledDeck.slice(34, 51)
  ];
  const remainingCards = shuffledDeck.slice(51, 54);

  return { playersCards, remainingCards };
}


export default POKERS;
