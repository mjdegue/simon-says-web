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

function setupButtons() {
  buttonMap.forEach((value, key, map) => {
    setupHoverAnimation(key, value);
    setupClickEvent(key, value);
  });
}

function setupHoverAnimation(color, button) {
  button.hover(hoverIn, hoverOut);
}

function setupClickEvent(color, button) {
  button.click((event) => {
    onButtonPressed(color, event);
  });
}

function hoverIn(event) {
  $(event.currentTarget).addClass("hovered");
}

function hoverOut(event) {
  $(event.currentTarget).removeClass("hovered");
}

function onButtonPressed(color, event) {
  $(event.currentTarget).addClass("pressed");
  setTimeout(() => {
    $(event.currentTarget).removeClass("pressed");
  }, 50);

  // TODO: Play sound only if it's correct:
  playSound(color);
}

function indicateColor(color) {
  buttonMap.get(color).fadeOut(100).fadeIn(100);
  playSound(color);
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
