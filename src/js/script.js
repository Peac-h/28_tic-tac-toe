import $ from "jquery";

class App {
  _xTurn;
  _winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  _winningLine;
  _scoreAI = 0;
  _scoreHuman = 0;

  constructor() {
    $(document).ready(this._startGame.bind(this));

    $("#gameBoard").on("click", this._clickHandler.bind(this));

    $(".new-game").on("click", this._newGame.bind(this));

    $("#bgVideoControl").on("click", this._stopVideo);
  }

  _startGame() {
    $("#gameBoard").addClass("x");

    this._xTurn = true;
  }

  _clickHandler(event) {
    if (!$(event.target).hasClass("game-board-square")) return;

    if ($(event.target).hasClass("x") || $(event.target).hasClass("o")) return;

    if (this._xTurn) {
      $(event.target).addClass("x");

      // check the gameover
      if (this._checkTie() || this._checkWin()) {
        this._endGame();
        return;
      }

      this._switchTurn();

      this._AIMove();
    }
  }

  _AIMove() {
    const $squares = $(".game-board-square");
    const $oSquares = $(".game-board-square.o");
    const $xSquares = $(".game-board-square.x");

    const sec = Math.ceil(Math.random() * 4000);

    setTimeout(() => {
      // First move
      if (!$squares.hasClass("o")) {
        // fill the center or if taken the very last square
        const $centerSquare = $("#4");
        if (!$centerSquare.hasClass("x") && !$centerSquare.hasClass("o")) {
          $centerSquare.addClass("o");
        } else {
          $("#8").addClass("o");
        }
      }

      // Second move
      if ($oSquares.length === 1 && $xSquares.length === 2) {
        // check for winning lines
        const xIndex = this._checkLines("x");

        // if two squares from any of winning lines are filled with 'x', fill the third square
        if (xIndex !== null) {
          $(`#${xIndex}`).addClass("o");
        }
        // else if the 0 and 4th squares are filled with x-s fill the 6th square
        else if ($("#4").hasClass("x") && $("#0").hasClass("x")) {
          $("#6").addClass("o");
        }
        // else fill 7, or 0 or 6
        else {
          switch (true) {
            case !$("#7").hasClass("x") && !$("#7").hasClass("o"):
              $("#7").addClass("o");
              break;
            case !$("#0").hasClass("x") && !$("#0").hasClass("o"):
              $("#0").addClass("o");
              break;
            default:
              $("#6").addClass("o");
          }
        }
      }

      // Third move (shortly: check my winning lines, then check opponent's winning lines)
      if ($oSquares.length >= 2 && $xSquares.length >= 3) {
        // check for my winning lines
        const oIndex = this._checkLines("o");

        // if two squares from any of winning lines are filled with 'o', fill the third square
        if (oIndex !== null) {
          $(`#${oIndex}`).addClass("o");
        }
        // else if two squares from any of winning lines are filled with 'x', fill the third square
        else {
          // check for opponent's winning lines
          const xIndex = this._checkLines("x");

          if (xIndex !== null) {
            $(`#${xIndex}`).addClass("o");
          }
          // else fill randomly
          else {
            const randomIndex = this._getRandomCell();
            $(`#${randomIndex}`).addClass("o");
          }
        }

        // check for the 'gameover'
        if (this._checkTie() || this._checkWin()) {
          this._endGame();
          return;
        }
      }

      // Run always
      this._switchTurn();
    }, sec);
  }

  _checkLines(player) {
    // go through winning lines and check for two filled cells and if so return the third free cell (so I could use it) or return null (so I could ignore it)
    for (let i = 0; i < this._winningLines.length; i++) {
      const line = this._winningLines[i];
      let count = 0;
      let emptySquareIndex = -1;

      for (let j = 0; j < line.length; j++) {
        const index = line[j];

        if ($(".game-board-square").eq(index).hasClass(player)) {
          count++;
        } else if (
          !$(".game-board-square").eq(index).hasClass("x") &&
          !$(".game-board-square").eq(index).hasClass("o")
        ) {
          emptySquareIndex = index;
        }
      }

      if (count === 2 && emptySquareIndex !== -1) {
        return emptySquareIndex;
      }
    }

    return null;
  }

  _getRandomCell() {
    const emptyCellIndices = [];

    for (let i = 0; i < $(".game-board-square").length; i++) {
      if (
        // $(".game-board-square").eq(i).hasClass(currPlayer)
        !$(".game-board-square").eq(i).hasClass("o") &&
        !$(".game-board-square").eq(i).hasClass("x")
      ) {
        emptyCellIndices.push(i);
      }
    }

    if (emptyCellIndices.length > 0) {
      return emptyCellIndices[
        Math.floor(Math.random() * emptyCellIndices.length)
      ];
    } else {
      return null;
    }
  }

  _switchTurn() {
    $("#gameBoard").toggleClass("x");

    // if x's turn, xTurn = false, else xTurn = true
    this._xTurn = !this._xTurn;

    if (this._xTurn) {
      $(".player-turn-message").text("Your turn!");
      $(".AI-thinking-message__text").fadeOut();
    } else {
      $(".player-turn-message").text("My turn!");
      $(".AI-thinking-message").removeClass("hide");
      $(".AI-thinking-message__text").fadeIn(1000);
    }
  }

  _checkWin() {
    let currPlayer;
    this._xTurn === true ? (currPlayer = "x") : (currPlayer = "o");

    this._winningLine = this._winningLines.find((line) =>
      line.every((index) =>
        $(".game-board-square").eq(index).hasClass(currPlayer)
      )
    );

    return this._winningLine ? true : false;
  }

  _checkTie() {
    const squares = $(".game-board-square");
    for (let i = 0; i < squares.length; i++) {
      if (!$(squares[i]).hasClass("x") && !$(squares[i]).hasClass("o")) {
        return false;
      }
    }
    return true;
  }

  _endGame() {
    $("#gameBoard").removeClass("x");
    $(".AI-thinking-message").addClass("hide");

    $.each(this._winningLine, (_, line) => {
      $($(".game-board-square")[line]).addClass("animation");
    });

    this._renderModal();
  }

  _renderModal() {
    setTimeout(() => {
      if ($(".game-board-square").eq(this._winningLine?.at(0)).hasClass("o")) {
        $("#modalWin").removeClass("hide");
      } else if (this._checkTie()) {
        $("#modalTie").removeClass("hide");
      } else {
        $("#modalLose").removeClass("hide");
      }
    }, 1000);
  }

  _updateAIScore() {
    this._scoreAI++;
    $("#scoreAI").text(this._scoreAI);
  }

  _updateHumanScore() {
    this._scoreHuman++;
    $("#scoreHuman").text(this._scoreHuman);
  }

  _newGame() {
    // if 'o' is the winner, update AI score
    if ($(".game-board-square").eq(this._winningLine?.at(0)).hasClass("o")) {
      this._updateAIScore();
    }

    // if 'x' is the winner, update human score
    if ($(".game-board-square").eq(this._winningLine?.at(0)).hasClass("x")) {
      this._updateHumanScore();
    }

    // clear squares
    $(".game-board-square").each(function () {
      $(this).removeClass("x");
      $(this).removeClass("o");
      $(this).removeClass("animation");
    });

    // initialize game
    this._startGame();

    $(".modal").addClass("hide");

    $(".player-turn-message").text("Your turn!");
  }

  _stopVideo() {
    const video = $("#bgVideo").get(0);
    const videoButton = $("#bgVideoControl button");

    const htmlPlay = `
      Stop The Video

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 96 960 960"
        width="48"
      >
        <path
          d="M372 735h60V417h-60v318Zm156 0h60V417h-60v318ZM140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680V316H140v520Zm0 0V316v520Z"
        />
      </svg>
    `;
    const htmlPause = `
      Play The Video

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 96 960 960"
        width="48"
      >
        <path
          d="m392 743 260-169-260-169v338ZM140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680V316H140v520Zm0 0V316v520Z"
        />
      </svg>
    `;

    if (video.paused) {
      video.play();
      videoButton.html(htmlPlay);
    } else {
      video.pause();
      videoButton.html(htmlPause);
    }
  }
}
const app = new App();
