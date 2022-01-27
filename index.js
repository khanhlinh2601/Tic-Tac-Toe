const boardElements = Array.from(document.querySelectorAll("#board div"));

const currentPlayer = document.getElementById("current-player");
const winMessage = document.getElementById("win-message");
const winMessageText = document.getElementById("text-win-message");
const btnRestart = document.getElementById("btn-restart");
const X_CLASS = "x-turn";
const O_CLASS = "o-turn";
const WIN_CASES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let circleTurn;
const state = ()=>{
  return Array(9).fill(null)
}
let historyState = [];
historyState.push(state())
let currentState

//start game
const startGame = () => {
  
  boardElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.addEventListener("click", handleTurn, { once: true });
  });

 
  winMessage.classList.remove("show");
};

//handle click on cell
const handleTurn = (e) => {
  
  const cell = e.target;
  const currentClass = circleTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWinner(currentClass)) {
    endGame(false);
    //false trả về O or X win
  } else if (isDraw()) {
    endGame(true);
    //true trả về tie
  } else {
    changeTurn();
  }
  
  //history
  currentState = historyState[historyState.length-1].slice()
  currentState[cell.getAttribute("data-id")] = currentClass == "x-turn" ? "x" : "o"
  historyState.push(currentState)

  //div step ui
  const div = document.createElement("div")
  div.className = "step"
  div.setAttribute("data-id", historyState.length - 1)
  div.textContent = 'step #' + (historyState.length - 1);
  document.querySelector("#history").appendChild(div)
};
//handle check x o on cell
const placeMark = (cell, currentClass) => {
  cell.classList.add(currentClass);
};

const endGame = (draw) => {
  if (draw) {
    winMessageText.innerText = "Tie!";
  } else {
    winMessageText.innerText = `${circleTurn ? "O" : "X"} Win !`;
  }
  winMessage.classList.add("show");
};

//handle tie, full cell->tie->true
const isDraw = () => {
  return boardElements.every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
};

//change x and o
const changeTurn = () => {
  circleTurn = !circleTurn;

  if (!circleTurn) {
    currentPlayer.textContent = "X";
    currentPlayer.classList.remove(O_CLASS);
    currentPlayer.classList.add(X_CLASS);
  } else {
    currentPlayer.textContent = "O";
    currentPlayer.classList.add(O_CLASS);
  }
};

const checkWinner = (currentClass) => {
  return WIN_CASES.some((winCase) => {
    return winCase.every((index) => {
      return boardElements[index].classList.contains(currentClass);
    });
  });
};
//kiểm tra từng trường hợp win -> từng case check từng ô xem có class ("x-turn" or "o-turn") đó ko

startGame();
btnRestart.addEventListener("click", startGame);
