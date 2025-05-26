// Notes:
// Of course I'd love to split this file into pieces.
// I'm just not there yet as I'm following a structure course and didn't get into separation of responsabilities in js :)

const ButtonColor = {
  GREEN: 0,
  RED: 1,
  YELLOW: 2,
  BLUE: 3,
  WRONG: 4,
};

const GameState = {
  WaitingToStart: 0,
  ShowingSequence: 1,
  WaitingForInput: 2,
  CheckingSequence: 3,
};

var buttonMap = new Map();
buttonMap.set(ButtonColor.GREEN, $("#green-button"));
buttonMap.set(ButtonColor.RED, $("#red-button"));
buttonMap.set(ButtonColor.YELLOW, $("#yellow-button"));
buttonMap.set(ButtonColor.BLUE, $("#blue-button"));

var soundMap = new Map();
soundMap.set(ButtonColor.GREEN, new Audio("./sounds/green.mp3"));
soundMap.set(ButtonColor.RED, new Audio("./sounds/red.mp3"));
soundMap.set(ButtonColor.YELLOW, new Audio("./sounds/blue.mp3"));
soundMap.set(ButtonColor.BLUE, new Audio("./sounds/yellow.mp3"));
soundMap.set(ButtonColor.WRONG, new Audio("./sounds/wrong.mp3"));

soundMap.forEach((value, key, map) => {
  value.load();
});

var titleText = $("#title-text");
var startButton = $("#start-button");

class GameLogic {
  constructor() {
    titleText.text("Press Start!");
    this.clearGame();
  }

  clearGame() {
    this.colorSequence = new Array();
    this.currentPlayerGuess = -1;
    this.gameState = GameState.WaitingToStart;
  }

  startGame() {
    this.clearGame();
    startButton.fadeOut();
    this.createNewColor();
  }

  onColorHoveredByUser(color) {
    if (this.gameState != GameState.WaitingForInput) {
      return;
    }
    buttonMap.get(color).addClass("hovered");
  }

  onColorUnhoveredByUser(color) {
    buttonMap.get(color).removeClass("hovered");
  }

  onColorSelectedByUser(color) {
    if (this.gameState != GameState.WaitingForInput) {
      return;
    }
    this.gameState = GameState.CheckingSequence;

    this.currentPlayerGuess++;
    if (this.colorSequence[this.currentPlayerGuess] == color) {
      this.indicateCorrectColor(color);
      this.checkFullSequenceComplete();
    } else {
      this.indicateWrongColor(color);
      this.gameOver();
    }
  }

  indicateCorrectColor(color) {
    buttonMap.get(color).remove("hovered");
    buttonMap.get(color).addClass("pressed");
    setTimeout(() => {
      buttonMap.get(color).removeClass("pressed");
    }, 50);

    // TODO: Play sound only if it's correct:
    playSound(color);
  }

  indicateWrongColor(color) {
    buttonMap.get(color).remove("hovered");
    playSound(ButtonColor.WRONG);
  }

  checkFullSequenceComplete() {
    if (this.currentPlayerGuess == this.colorSequence.length - 1) {
      this.currentPlayerGuess = -1;
      setTimeout(this.createNewColor.bind(this), 200);
    } else {
      this.gameState = GameState.WaitingForInput;
    }
  }

  createNewColor() {
    titleText.text("Current streak: " + this.colorSequence.length);
    this.colorSequence.push(Math.floor(Math.random() * 4));
    this.gameState = GameState.ShowingSequence;
    this.showFullSequence(0);
  }

  showFullSequence(currentNumber) {
    if (currentNumber >= this.colorSequence.length) {
      this.gameState = GameState.WaitingForInput;
      return;
    }

    var color = this.colorSequence.at(currentNumber);
    buttonMap.get(color).fadeOut(100).fadeIn(100);
    playSound(color);

    setTimeout(this.showFullSequence.bind(this), 400, currentNumber + 1);
  }

  gameOver() {
    titleText.text("You lost. Press start again!");
    startButton.fadeIn();
    this.gameState = GameState.WaitingToStart;
  }
}

var gameLogic = new GameLogic();

function setupButtons() {
  buttonMap.forEach((value, key, map) => {
    setupHoverAnimation(key, value);
    setupClickEvent(key, value);
  });

  startButton.click(() => {
    gameLogic.startGame();
  });
}

function setupHoverAnimation(color, button) {
  button.hover(
    () => {
      gameLogic.onColorHoveredByUser(color);
    },
    () => {
      gameLogic.onColorUnhoveredByUser(color);
    }
  );
}

function setupClickEvent(color, button) {
  button.click(() => {
    gameLogic.onColorSelectedByUser(color);
  });
}

function playSound(color) {
  if (soundMap.has(color)) {
    var audio = soundMap.get(color);
    if (audio.paused) {
      audio.play();
    } else {
      audio.currentTime = 0;
    }
  }
}

setupButtons();
