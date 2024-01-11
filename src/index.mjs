// import "./styles.css";

const StartNewGameCard = document.querySelector("#start-new-game")
const LeaderboardCard = document.querySelector("#show-leaderboard")
let nameDialog = document.querySelector(".name-dialog")
let leaderboardDialog = document.querySelector(".leaderboard-dialog")
let newgameDialog = document.querySelector(".newgame-dialog")
let saveName = document.querySelector("#save-name")
let guest = document.querySelector("#guest")
let nameInput = document.querySelector(".name-input")
let name = document.querySelector(".name")
let updateNameSpan = document.querySelector(".update-name")
let cancelBtn = document.querySelector(".cancelbtn")
let container = document.querySelector(".container")
let h1 = document.querySelector(".h1-animation")
let info = document.querySelector(".info")
let h2 = document.querySelector(".h2")
let introDialog = document.querySelector(".dialog")

let ParsedScores;
let score;
let highestScore;

info.addEventListener("click", () => {
  introDialog.showModal();
})

let closeIntro = introDialog.querySelector(".cancel-btn");
closeIntro.addEventListener('click', () => {
  introDialog.close()
})

cancelBtn.addEventListener("click", () => {
  const dialog = introDialog.querySelector('dialog')
  dialog.close();
})

setInterval(() => {
  h2.style.color = getRandomColor();
}, 500);

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Game {

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  async start() {
    await this.checkName();
    this.displayMenu();
  }

  async checkName() {
    if (localStorage.getItem("name")) {
      this.name = localStorage.getItem("name");
    } else {
      await this.updateName();
      localStorage.setItem('name', this.name);
    }
  }

  async updateName() {
    return new Promise((resolve) => {
      nameDialog.showModal();

      if (!localStorage.getItem("name")) {
        h1.style.opacity = "0"
        h1.style.animation = "none"
        const h4Element = nameDialog.querySelector("h4")
        const inputElement = nameDialog.querySelector("input")
        h4Element.textContent = "Enter Name"
        inputElement.placeholder = "your name pls"
        cancelBtn.removeEventListener('click', () => {
          const dialog = info.querySelector('dialog')
          dialog.close();
        })
      } else {
        h1.style.opacity = "1"
        h1.style.animation = "slideAnimation 4s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      }

      cancelBtn.addEventListener('click', () => {
        if (!localStorage.getItem("name")) {
          window.location.reload()
          this.name = "Guest"
        }
        nameDialog.close();
        resolve()
      })

      guest.addEventListener('click', () => {
        this.name = "Guest";
        if (!localStorage.getItem("name")) {
          window.location.reload()
        }
        localStorage.setItem("name", this.name)
        nameDialog.close();
        resolve();
      });

      saveName.addEventListener('click', () => {
        this.name = nameInput.value;
        if (!localStorage.getItem("name")) {
          window.location.reload()
        }
        localStorage.setItem("name", this.name)
        nameDialog.close();
        resolve();
      });
    });
  }

  startNewGame = () => {
    this.updateLevel(1);
    this.gameLoop();
  }

  showLeaderBoard = () => {
    leaderboardDialog.showModal()

    const highScore = leaderboardDialog.querySelector('span')
    const scoreslist = leaderboardDialog.querySelector('ul')
    const closeBtn = leaderboardDialog.querySelector("img")
    closeBtn.addEventListener('click', () => {
      leaderboardDialog.close()
    })
    ParsedScores = localStorage.getItem("scores")
    score = JSON.parse(ParsedScores)
    scoreslist.innerHTML = "No Scores to show"
    scoreslist.style.padding = "0px"
    leaderboardDialog.style.height = "fit-content"
    scoreslist.innerHTML = "No Scores to Show"
    if (score.length > 0) {
      scoreslist.innerHTML = ""
      score.map((item) => {
        scoreslist.innerHTML += `<li>${item.score} on ${item.time}</li>`
      })
    }
    highestScore = score.reduce((maxScore, currentScore) => {
      return currentScore.score > maxScore ? currentScore.score : maxScore;
    }, 0);
    highScore.innerText = `Highest Score = ${score && score.length > 0 ? highestScore : "Get a Score Nigga"}`

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    setInterval(() => {
      highScore.style.color = getRandomColor();
    }, 500);
  }



  displayMenu() {
    name.innerText = `Welcome ${this.name}`;
  }
  updateLevel(level = 0) {
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = level;
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  displayNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      alert(`${this.generatedNumbers[i]}`)
    }
  }

  getNumbersFromUser() {
    for (let i = 0; i < this.level; i++) {
      let enteredValue = prompt(
        "Enter values in order one at a time: (press enter after every value)",
      );
      if (enteredValue === "" || enteredValue === null) {
        enteredValue = NaN;
      }
      this.enteredNumbers.push(Number(enteredValue));
    }
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) return false;
    }
    return true;
  }

  gameLoop() {
    this.generateNumbersForLevel();
    this.displayNumbersForLevel();
    this.getNumbersFromUser();
    if (this.verifyLevel()) {
      this.updateLevel(this.level + 1);
      this.gameLoop();
    } else {
      const currentTime = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: "2-digit",
        hour12: true
      })
      newgameDialog.showModal()
      const closeBtn = newgameDialog.querySelector("img")
      const h3 = newgameDialog.querySelector("h3")
      const span = newgameDialog.querySelector("span")
      closeBtn.addEventListener('click', () => {
        newgameDialog.close()
      })
      h3.innerText = "Game Over"
      span.innerText = `Your score is: ${this.level}`
      const newScore = {
        score: this.level,
        time: currentTime
      };
      const existingScores = JSON.parse(localStorage.getItem("scores")) || [];
      existingScores.push(newScore);
      localStorage.setItem("scores", JSON.stringify(existingScores));
    }
  }
}

let myGameInstance = new Game(container);
myGameInstance.start();

StartNewGameCard.addEventListener('click', () => myGameInstance.startNewGame());
LeaderboardCard.addEventListener('click', () => myGameInstance.showLeaderBoard());
updateNameSpan.addEventListener('click', async () => {
  await myGameInstance.updateName();
  myGameInstance.displayMenu();
});


// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 50)
      const end = start + Math.floor(Math.random() * 50)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    const isInMidAnimation = this.frame >= Math.floor(0.50 * this.queue.length);

    if (isInMidAnimation) {
      el.innerHTML = output;
    }

    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrase = [
  'The Vinci Code.'
]

const el = document.querySelector('.h1-animation')
const fx = new TextScramble(el)

let counter = 0
const next = () => {
  fx.setText(phrase[counter]).then(() => {
    setTimeout(next, 5000)
  })
  counter = (counter + 1) % phrase.length
}

setTimeout(() => {
  next();
}, 1400);

container.style.opacity = "0%";

if (localStorage.getItem('name')) {
  setInterval(() => {
    container.style.opacity = "100%";
  }, 4000);
}
