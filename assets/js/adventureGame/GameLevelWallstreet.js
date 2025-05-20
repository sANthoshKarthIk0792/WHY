import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';

class GameLevelWallstreet {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_city = path + "/images/gamify/city.png";
    const image_data_city = {
      name: 'city',
      greeting: "Welcome to the city! It is like paradise, bustling and vast so enjoy your stay!",
      src: image_src_city,
      pixels: { height: 966, width: 654 }
    };


    // const decorStatue = new Npc({
    //   id: 'Statue',
    //   src: image_src_statue,
    //   SCALE_FACTOR: 4,
    //   ANIMATION_RATE: 0,
    //   pixels: { height: 300, width: 200 },
    //   INIT_POSITION: { x: width * 0.4, y: height * 0.6 },
    //   orientation: { rows: 1, columns: 1 },
    //   down: { row: 0, start: 0, columns: 1 },
    //   hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 }
    //   // No 'reaction' or 'interact' functions
    // });

    // gameEnv.addObject(decorStatue);


    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
      id: 'Chill Guy',
      greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_chillguy,
      SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / CHILLGUY_SCALE_FACTOR) },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_casino = path + "/images/gamify/frankSinatra.png";
    const sprite_data_casino = {
      id: 'Casino-NPC',
      greeting: "Hey, kid. I'm Frank Sinatra — welcome to the bright lights and wild nights of Las Vegas.",
      src: sprite_src_casino,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: { height: 281, width: 280 },
      INIT_POSITION: { x: width * 0.28, y: height * 0.82 },
      orientation: { rows: 1, columns: 1 }, 
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          showDialogBox(
            "Frank Sinatra",
            "Hey, kid. I'm Frank Sinatra — welcome to the bright lights and wild nights of Las Vegas.\nHere, you can test your luck on Blackjack, Poker, or the Minefield Challenge.\nBut remember: in gambling, the swing of fortune can be swift and brutal.\nWant a tip before you step in?",
            [
              { label: "Yes, give me advice", action: () => giveAdvice(), keepOpen: true },
              { label: "Take me to the Casino", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/casinohomepage" },
              { label: "No thanks", action: () => {} }
            ]
          );
        }
        function giveAdvice() {
          const adviceList = [
            "The house always has an edge, so play smart and know when to walk away.",
            "Set a budget before you play, and never chase your losses.",
            "Luck be a lady tonight, but skill keeps you in the game.",
            "Sometimes the best bet is the one you don't make.",
            "Enjoy the thrill, but remember: it's just a game."
          ];
          const advice = adviceList[Math.floor(Math.random() * adviceList.length)];
          showDialogBox(
            "Frank's Advice",
            advice + "\nWant to answer a question before you go in?",
            [
              { label: "Sure, ask me!", action: () => askQuestion(), keepOpen: true },
              { label: "Take me to the Casino", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/casinohomepage" },
              { label: "Another tip", action: () => giveAdvice(), keepOpen: true },
              { label: "Maybe later", action: () => {} }
            ]
          );
        }
        function askQuestion() {
          showDialogBox(
            "Frank's Question",
            "If you won a big jackpot tonight, what would you do with the money?",
            [
              { label: "Save it", action: () => frankResponse("Smart move, kid. Saving is always classy.") },
              { label: "Spend it all!", action: () => frankResponse("Ha! Just don't spend it all in one place, capisce?") },
              { label: "Invest it", action: () => frankResponse("Now that's the spirit of a true high roller!") },
              { label: "Back", action: () => giveAdvice(), keepOpen: true }
            ]
          );
        }
        function frankResponse(response) {
          showDialogBox(
            "Frank Sinatra",
            response + "\nReady to try your luck?",
            [
              { label: "Take me to the Casino", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/casinohomepage" },
              { label: "Back to advice", action: () => giveAdvice(), keepOpen: true },
              { label: "Maybe later", action: () => {} }
            ]
          );
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    const sprite_src_stocks = path + "/images/gamify/stockguy.png";
    const sprite_data_stocks = {
      id: 'Stock-NPC',
      greeting: "Good day, I am J.P. Morgan, financier of industry and architect of American banking.",
      src: sprite_src_stocks,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 441, width: 339 },
      INIT_POSITION: { x: width / 3, y: height / 3 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          showDialogBox(
            "J.P. Morgan",
            "Good day, I am J.P. Morgan, financier of industry and architect of American banking.\nAre you ready to test your skills in the stock market?",
            [
              { label: "Yes", action: () => explainStocks(), keepOpen: true },
              { label: "No", action: () => {} }
            ]
          );
        }
        function explainStocks() {
          showDialogBox(
            "J.P. Morgan",
            "The stock market is a place of opportunity and risk. You can buy shares in companies and watch your investments grow—or shrink.\nWould you like to proceed to the Stock Exchange and begin your investment journey?",
            [
              { label: "Take me to the Stock Exchange", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/stocks/viewer" },
              { label: "Remind me what stocks are", action: () => whatAreStocks(), keepOpen: true },
              { label: "Back", action: () => intro(), keepOpen: true }
            ]
          );
        }
        function whatAreStocks() {
          showDialogBox(
            "J.P. Morgan",
            "Stocks represent ownership in a company. When you buy a stock, you become a partial owner and can benefit from its success.\nWould you like to try investing now?",
            [
              { label: "Yes, let's invest", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/stocks/viewer" },
              { label: "Back", action: () => explainStocks(), keepOpen: true }
            ]
          );
        }
        intro();
      },
      interact: function () { this.reaction(); }
    };

    const sprite_src_crypto = path + "/images/gamify/satoshiNakamoto.png";
    const sprite_data_crypto = {
      id: 'Crypto-NPC',
      greeting: "Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.",
      src: sprite_src_crypto,
      SCALE_FACTOR: 10,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 282 },
      INIT_POSITION: { x: width * 0.75, y: height * 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          showDialogBox(
            "Satoshi Nakamoto",
            "Greetings, seeker. I am Satoshi Nakamoto, architect of decentralized currency.\nAre you curious about Bitcoin or ready to explore the Crypto Hub?",
            [
              { label: "Tell me about Bitcoin", action: () => aboutBitcoin(), keepOpen: true },
              { label: "Go to Crypto Hub", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/crypto/portfolio" },
              { label: "Goodbye", action: () => {} }
            ]
          );
        }
        function aboutBitcoin() {
          showDialogBox(
            "Satoshi Nakamoto",
            "Bitcoin is a decentralized digital currency, born from a desire for freedom and transparency. It operates without banks or governments.\nWould you like to know how to buy or mine Bitcoin?",
            [
              { label: "How do I buy Bitcoin?", action: () => howToBuy(), keepOpen: true },
              { label: "How do I mine Bitcoin?", action: () => howToMine(), keepOpen: true },
              { label: "Back", action: () => intro(), keepOpen: true }
            ]
          );
        }
        function howToBuy() {
          showDialogBox(
            "Satoshi Nakamoto",
            "To buy Bitcoin, you need a digital wallet and access to a crypto exchange. You can purchase fractions of a Bitcoin.\nWould you like to visit the Crypto Hub to start your journey?",
            [
              { label: "Yes, take me there", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/crypto/portfolio" },
              { label: "Back", action: () => aboutBitcoin(), keepOpen: true }
            ]
          );
        }
        function howToMine() {
          showDialogBox(
            "Satoshi Nakamoto",
            "Mining Bitcoin requires powerful computers to solve complex puzzles. Miners are rewarded with Bitcoin for verifying transactions.\nWould you like to try mining or learn more?",
            [
              { label: "Try Mining", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/crypto/mining" },
              { label: "Back", action: () => aboutBitcoin(), keepOpen: true }
            ]
          );
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    const image_src_bank = path + "/images/gamify/bank.png";

    const spriteBank = {
      id: 'bank',
      src: image_src_bank,
      SCALE_FACTOR: 4,
      pixels: {height: 270, width: 377},
      INIT_POSITION: { x: width * 0.6, y: height * 0.41 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      orientation: { rows: 1, columns: 1 },
    }

    // === Fixed Bank NPC ===
    const sprite_src_bank = path + "/images/gamify/janetYellen.png";
    const sprite_data_bank = {
      id: 'Bank-NPC',
      greeting: "Welcome, I'm Janet Yellen, Secretary of the Treasury.",
      src: sprite_src_bank,
      SCALE_FACTOR: 6,
      ANIMATION_RATE: 50,
      pixels: { height: 282, width: 268 },
      INIT_POSITION: { x: width * 0.6, y: height * 0.41 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        function intro() {
          showDialogBox(
            "Janet Yellen",
            "Welcome, I'm Janet Yellen, Secretary of the Treasury.\nToday, you have just been entrusted with an initial sum of $100,000 to shape your financial future.\nWould you like to learn about the bank, review your analytics, or get financial tips?",
            [
              { label: "What does the Bank do?", action: () => explainBank(), keepOpen: true },
              { label: "Show me Bank Analytics", action: () => analyticsIntro(), keepOpen: true },
              { label: "Give me a financial tip", action: () => financialTip(), keepOpen: true },
              { label: "Goodbye", action: () => {} }
            ]
          );
        }
        function explainBank() {
          showDialogBox(
            "Janet Yellen",
            "The Bank keeps track of your every transaction, monitors your balance, and helps you plan for the future.\nWould you like to see your analytics or hear a tip?",
            [
              { label: "Show Analytics", action: () => analyticsIntro(), keepOpen: true },
              { label: "Financial Tip", action: () => financialTip(), keepOpen: true },
              { label: "Back", action: () => intro(), keepOpen: true }
            ]
          );
        }
        function analyticsIntro() {
          showDialogBox(
            "Janet Yellen",
            "Bank Analytics provides a detailed overview of your spending, investments, and savings.\nWould you like to proceed to the analytics dashboard?",
            [
              { label: "Yes, show me", action: () => window.location.href = "https://nighthawkcoders.github.io/portfolio_2025/gamify/bankanalytics" },
              { label: "Back", action: () => intro(), keepOpen: true }
            ]
          );
        }
        function financialTip() {
          const tips = [
            "Diversify your investments to reduce risk.",
            "Always keep an emergency fund.",
            "Track your spending to find savings opportunities.",
            "Invest for the long term, not quick gains.",
            "Review your financial goals regularly."
          ];
          const tip = tips[Math.floor(Math.random() * tips.length)];
          showDialogBox(
            "Janet Yellen - Financial Tip",
            tip,
            [
              { label: "Another Tip", action: () => financialTip(), keepOpen: true },
              { label: "Back", action: () => intro(), keepOpen: true }
            ]
          );
        }
        intro();
      },
      interact: function () {
        this.reaction();
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_city },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_casino },
      { class: Npc, data: sprite_data_stocks },
      { class: Npc, data: sprite_data_crypto },
      { class: Npc, data: sprite_data_bank },
      // {class: Npc, data: spriteBank},
    ];
  }
}

// Utility function for a modern, dark dialog box 
function showDialogBox(title, message, options = []) {
  // Remove any existing dialog
  const oldDialog = document.getElementById('custom-dialog-box');
  if (oldDialog) oldDialog.remove();

  const dialogContainer = document.createElement('div');
  dialogContainer.id = 'custom-dialog-box';
  dialogContainer.style.position = 'fixed';
  dialogContainer.style.top = '50%';
  dialogContainer.style.left = '50%';
  dialogContainer.style.transform = 'translate(-50%, -50%)';
  dialogContainer.style.backgroundColor = '#181a20';
  dialogContainer.style.padding = '28px';
  dialogContainer.style.border = '2px solid #333';
  dialogContainer.style.borderRadius = '14px';
  dialogContainer.style.boxShadow = '0 4px 32px rgba(0,0,0,0.7)';
  dialogContainer.style.zIndex = '1000';
  dialogContainer.style.textAlign = 'center';
  dialogContainer.style.width = '370px';
  dialogContainer.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
  dialogContainer.style.color = '#f3f3f3';

  const titleElement = document.createElement('h2');
  titleElement.innerText = title;
  titleElement.style.marginBottom = '14px';
  titleElement.style.color = '#ffd700';
  titleElement.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
  dialogContainer.appendChild(titleElement);

  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.style.marginBottom = '20px';
  messageElement.style.whiteSpace = 'pre-line';
  messageElement.style.fontSize = '1.08em';
  dialogContainer.appendChild(messageElement);

  options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option.label;
    button.style.margin = '8px';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.backgroundColor = '#444cf7';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.fontSize = '15px';
    button.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
    button.onmouseover = () => button.style.backgroundColor = '#222a7a';
    button.onmouseout = () => button.style.backgroundColor = '#444cf7';
    button.onclick = () => {
      option.action();
      if (!option.keepOpen) document.body.removeChild(dialogContainer);
    };
    dialogContainer.appendChild(button);
  });

  document.body.appendChild(dialogContainer);
}

export default GameLevelWallstreet;
