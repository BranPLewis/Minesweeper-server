Vue.createApp({
  data() {
    return {
      // Server Information
      clientId: null,
      gameId: "",
      game: null,
      allGames: null,
      usernames: [],
      gameMode: "",
      OPusername: "",

      minutes: 0,
      seconds: 0,
      timer: false,
      restarted: false,
      currentMines: 0,
      activeDifficulty: [],
      board_size: 64,
      board_height: 8,
      board_width: 8,
      hotbarOn: false,
      Socketmessage: "",
      HTTPmessage: "",
      socket: null,
      tileOn: true,
      descriptionPage: true,
      singleplayerDifficultyPage: false,
      multiplayerDifficultyPage: false,
      serverPage: false,
      createServerPage: false,
      joinServerPage: false,
      gameOver: false,
      win: false,
      winBeginner: false,
      gameOverBeginner: false,
      winIntermediate: false,
      gameOverIntermediate: false,
      winHard: false,
      gameOverHard: false,
      opponentExists: false,
      restartToggle: true,
      OPusernameToggle: false,
      standby: false,
      playersToggle: false,
      socket: null,
      mines: [],
      tiles: [],
      OPtiles: [],
    };
  },
  methods: {
    gameModeSingle: function () {
      this.gameMode = "singlePlayer";
    },

    gameModeMulti: function () {
      this.gameMode = "multiplayer";
    },

    opponentSwitchOff: function () {
      this.opponentExists = false;
      this.restartToggle = true;
      this.OPusernameToggle = false;
      this.playersToggle = false;
    },

    opponentSwitchOn: function () {
      this.opponentExists = true;
      this.restartToggle = false;
      this.OPusernameToggle = true;
      this.playersToggle = true;
    },

    SingleplayerSwitch: function () {
      this.descriptionPage = false;
      this.singleplayerDifficultyPage = true;
    },

    MultiplayerSwitch: function () {
      this.descriptionPage = false;
      this.serverPage = true;
    },

    createServerToggle: function () {
      this.serverPage = false;
      this.createServerPage = true;
    },

    serverCreated: function () {
      this.createServerPage = false;
      this.multiplayerDifficultyPage = true;
    },

    joinServerToggle: function () {
      this.serverPage = false;
      this.joinServerPage = true;
    },

    difficultySwitch: function () {
      this.singleplayerDifficultyPage = false;
      this.multiplayerDifficultyPage = false;
    },

    changeDifficultytoBeginner() {
      var Beginner = {
        title: "Beginner",
        col: 10,
        row: 10,
        mines: 12,
      };
      this.currentMines = 12;
      this.activeDifficulty.shift();
      this.activeDifficulty.push(Beginner);
      console.log("Difficulty is Beginner");
    },

    changeDifficultytoIntermediate() {
      var Intermediate = {
        title: "Intermediate",
        col: 20,
        row: 14,
        mines: 40,
      };
      this.currentMines = 40;
      this.activeDifficulty.shift();
      this.activeDifficulty.push(Intermediate);
      console.log("Difficulty is Intermediate");
    },

    changeDifficultytoHard() {
      var Hard = {
        title: "Hard",
        col: 30,
        row: 16,
        mines: 99,
      };
      this.currentMines = 99;
      this.activeDifficulty.shift();
      console.log(this.activeDifficulty);
      this.activeDifficulty.push(Hard);
      console.log("Difficulty is Hard");
    },

    checkWin: function (difficulty) {
      var diff = difficulty;
      var maxNum = diff.col * diff.row;
      var num = 0;
      for (x = 0; x < this.tiles.length; x++) {
        for (y = 0; y < this.tiles[x].length; y++) {
          if (
            this.tiles[x][y].class !== "mine" &&
            this.tiles[x][y].class !== "tile"
          ) {
            num += 1;
          }
          if (this.tiles[x][y].flag == "flagged") {
            num += 1;
          }
        }
      }
      console.log(num);
      if (num == maxNum) {
        this.win = true;
        if (this.activeDifficulty[0].title == "Beginner") {
          this.winBeginner = true;
        }
        if (this.activeDifficulty[0].title == "Intermediate") {
          this.winIntermediate = true;
        }
        if (this.activeDifficulty[0].title == "Hard") {
          this.winHard = true;
        }
        this.winExec();
        console.log("You win!");
      }
    },

    winExec: function () {
      this.stopTimer();
    },

    tile_click: function (row, difficulty) {
      if (this.gameOver == false && this.win == false) {
        var diff = difficulty;
        if (row.flag == "") {
          if (row.mine == false) {
            if (row.class !== "clicked") {
              row.class = "clicked";
              // Start with the Cross with out of bounds check
              //
              // Right of the cross
              if (row.col + 1 <= diff.col - 1) {
                if (this.tiles[row.col + 1][row.row].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Bottom of the cross
              if (row.row + 1 <= diff.row - 1) {
                if (this.tiles[row.col][row.row + 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Left of the cross
              if (row.col - 1 >= 0) {
                if (this.tiles[row.col - 1][row.row].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Top of the cross
              if (row.row - 1 >= 0) {
                if (this.tiles[row.col][row.row - 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              //Do the corners next
              //
              // Bottom Right
              if (row.col + 1 <= diff.col - 1 && row.row + 1 <= diff.row - 1) {
                if (this.tiles[row.col + 1][row.row + 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Bottom Left
              if (row.col - 1 >= 0 && row.row + 1 <= diff.row - 1) {
                if (this.tiles[row.col - 1][row.row + 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Top Left
              if (row.col - 1 >= 0 && row.row - 1 >= 0) {
                if (this.tiles[row.col - 1][row.row - 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              // Top Right
              if (row.col + 1 <= diff.col - 1 && row.row - 1 >= 0) {
                if (this.tiles[row.col + 1][row.row - 1].mine == true) {
                  if (row.number == "") {
                    row.number = 1;
                  } else {
                    row.number += 1;
                  }
                }
              }
              if (row.number == "") {
                if (row.col == diff.col - 1 && row.row == diff.row - 1) {
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                }
                if (row.col == diff.col - 1 && row.row == 0) {
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                }
                if (row.col == 0 && row.row == 0) {
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                }
                if (row.col == 0 && row.row == diff.row - 1) {
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row - 1], diff);
                }
                if (row.col == 0 && 0 < row.row && row.row < diff.row - 1) {
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row + 1], diff);
                }
                if (0 < row.col && row.col < diff.col - 1 && row.row == 0) {
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row + 1], diff);
                }
                if (
                  row.col == diff.col - 1 &&
                  0 < row.row &&
                  row.row < diff.row - 1
                ) {
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row + 1], diff);
                }
                if (
                  0 < row.col &&
                  row.col < diff.col - 1 &&
                  row.row == diff.row - 1
                ) {
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row - 1], diff);
                }
                if (
                  0 < row.col &&
                  row.col < diff.col - 1 &&
                  0 < row.row &&
                  row.row < diff.row - 1
                ) {
                  this.tile_click(this.tiles[row.col + 1][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row + 1], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row], diff);
                  this.tile_click(this.tiles[row.col - 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row - 1], diff);
                  this.tile_click(this.tiles[row.col + 1][row.row], diff);
                }
              }
              if (row.number == 1) {
                row.color = "blue";
              }
              if (row.number == 2) {
                row.color = "green";
              }
              if (row.number == 3) {
                row.color = "red";
              }
              if (row.number == 4) {
                row.color = "black";
              }
              if (row.number == 5) {
                row.color = "purple";
              }
            }
          } else {
            this.gameOver = true;
            if (this.activeDifficulty[0].title == "Beginner") {
              this.gameOverBeginner = true;
            }
            if (this.activeDifficulty[0].title == "Intermediate") {
              this.gameOverIntermediate = true;
            }
            if (this.activeDifficulty[0].title == "Hard") {
              this.gameOverHard = true;
            }
            this.gameOverExec(this.Beginner);
            row.class = "mine";
          }
        }
      }
    },

    flag: function (row) {
      if (this.gameOver == false && this.win == false) {
        if (row.class == "tile") {
          if (this.currentMines > 0) {
            if (row.flag == "") {
              row.flag = "flagged";
              this.currentMines -= 1;
            } else {
              row.flag = "";
              this.currentMines += 1;
            }
          } else {
            if (row.flag == "flagged") {
              row.flag = "";
              this.currentMines += 1;
            }
          }
        }
      }
    },

    generateMines: function (row, difficulty) {
      var diff = difficulty;
      if (this.mines.length == 0) {
        for (let i = 0; i < diff.mines; i++) {
          var rand_col = Math.ceil(Math.random() * diff.col - 1);
          var rand_row = Math.ceil(Math.random() * diff.row - 1);
          while (
            this.tiles[rand_col][rand_row].mine == true ||
            rand_col == row.col ||
            rand_row == row.row
          ) {
            rand_col = Math.ceil(Math.random() * diff.col - 1);
            rand_row = Math.ceil(Math.random() * diff.row - 1);
          }
          this.tiles[rand_col][rand_row].mine = true;
          this.tiles[rand_col][rand_row].col = rand_col;
          this.tiles[rand_col][rand_row].row = rand_row;
          this.mines.push(this.tiles[rand_col][rand_row]);
        }
      }
    },

    generateBoard: function (difficulty) {
      var diff = difficulty;
      var rowNum = 0;
      var colNum = 0;
      for (let i = 0; i < diff.col; i++) {
        const column = [];
        for (let j = 0; j < diff.row; j++) {
          tile = {
            mine: false,
            class: "tile",
            number: "",
            color: "",
            flag: "",
            difficulty: diff.title,
            col: colNum,
            row: rowNum,
          };
          rowNum += 1;
          column.push(tile);
        }
        colNum += 1;
        rowNum = 0;
        this.tiles.push(column);
      }
    },

    OPgenerateBoard: function (difficulty) {
      var diff = difficulty;
      var rowNum = 0;
      var colNum = 0;
      for (let i = 0; i < diff.col; i++) {
        const column = [];
        for (let j = 0; j < diff.row; j++) {
          tile = {
            mine: false,
            class: "OPtile",
            number: "",
            color: "",
            flag: "",
            difficulty: diff.title,
            col: colNum,
            row: rowNum,
          };
          rowNum += 1;
          column.push(tile);
        }
        colNum += 1;
        rowNum = 0;
        this.OPtiles.push(column);
      }
    },

    gameOverExec: function () {
      this.stopTimer();
      for (i = 0; i < this.mines.length; i++) {
        this.tiles[this.mines[i].col][this.mines[i].row].class = "mine";
      }
    },

    restart(difficulty) {
      var diff = difficulty;
      this.restarted = true;
      this.currentMines = this.activeDifficulty[0].mines;
      this.win = false;
      this.winBeginner = false;
      this.winIntermediate = false;
      this.winHard = false;
      this.gameOverBeginner = false;
      this.gameOverIntermediate = false;
      this.gameOverHard = false;
      this.gameOver = false;
      this.tiles = [];
      this.mines = [];
      this.generateBoard(this.activeDifficulty[0]);

      this.timer = setTimeout(() => {
        this.seconds = 0;
        this.minutes = 0;
      });

      this.timer = false;

      this.setTimer();
    },

    toggle_hotbar: function () {
      this.hotbarOn = !this.hotbarOn;
    },
    hotbarOff: function () {
      this.hotbarOn = false;
    },

    setTimer() {
      if (this.timer == true) {
        this.gametime = setInterval(() => {
          if (this.seconds < 59) {
            this.seconds++;
          } else {
            this.seconds = 0;
            this.minutes++;
          }
        }, 1000);
      } else {
        if (this.restarted == true) {
          this.stopTimer();
          this.timer = false;
        }
        if (this.gameOver == true) {
          this.stopTimer();
          this.timer = false;
        }
        if (this.win) {
          this.stopTimer();
          this.timer = false;
        }
      }
    },

    startTimer() {
      if (this.timer == false) {
        this.timer = true;

        this.setTimer();
      }
    },
    stopTimer() {
      clearInterval(this.gametime);
      clearInterval(this.timer);
    },

    serverPlay: function () {
      const payLoad = {
        method: "play",
        gameMode: this.gameMode,
        difficulty: this.activeDifficulty[0],
        username: this.username,
        clientId: this.clientId,
        win: this.win,
        gameOver: this.gameOver,
        board: this.tiles,
        gameId: this.gameId,
      };
      this.socket.send(JSON.stringify(payLoad));
    },

    joinServerOnCreation: function () {
      const payLoad = {
        method: "join",
        username: this.username,
        clientId: this.clientId,
        gameId: this.gameId,
      };
      this.socket.send(JSON.stringify(payLoad));
    },

    joinServer: function () {
      const payLoad = {
        method: "join",
        username: this.username,
        clientId: this.clientId,
        gameId: this.gameId,
      };
      this.socket.send(JSON.stringify(payLoad));
    },

    createServer: function () {
      if (this.gameId === "") {
        console.log("That is not a valid Game ID");
      } else {
        var payLoad = {
          method: "create",
          clientId: this.clientId,
          gameId: this.gameId,
          board: this.tiles,
          difficulty: this.activeDifficulty[0],
        };
        this.socket.send(JSON.stringify(payLoad));
      }
    },

    connect: function () {
      // 1: Connect to websocket
      // const protocol = window.location.protocol.includes("https")
      //   ? "wss"
      //   : "ws";
      this.socket = new WebSocket(`ws://localhost:9090`);
      // this.socket.onopen = function () {
      //   console.log("Connected to websocket");
      // };
      this.socket.onmessage = (message) => {
        const response = JSON.parse(message.data);
        if (response.method === "connect") {
          var clientID = response.clientId;
          console.log("Client id Set successfully " + clientID);
          this.clientId = clientID;
        }

        //create
        if (response.method === "create") {
          this.game = response.game;
          this.allGames = response.games;
          console.log(
            "Game created Succesfully " + "Game ID: " + response.game.id
          );
        }

        //join
        if (response.method === "join") {
          const game = response.game;
          const username = response.username;
          const difficulty = response.difficulty;
          if (this.activeDifficulty.length == 0) {
            this.activeDifficulty.push(difficulty);
          }
          this.currentMines = difficulty.mines;
          const gameId = response.gameId;
          var players = this.usernames;
          this.joinServerPage = false;
          if (game.clients.length > 1) {
            this.standby = false;
            console.log(game.clients);
            game.clients.forEach((i) => {
              console.log(i.username);
              let player = i.username;
              this.usernames.push(player);
            });
            console.log(this.usernames);
            var payLoad = {
              method: "users",
            };
            if (game.clients[1].username === username) {
              this.generateBoard(difficulty);
              this.OPgenerateBoard(difficulty);
            }
          } else {
            this.standby = true;
          }
        }

        // messages
        if (response.method === "message") {
          const error = response.message;
          console.log(error);
        }

        //updating each opponents board
        if (response.method === "play") {
          const board = response.board;
          const win = response.win;
          const gameOver = response.gameOver;
          for (x = 0; x < board.length; x++) {
            for (y = 0; y < board[x].length; y++) {
              if (board[x][y].class == "clicked") {
                board[x][y].class = "OPclicked";
              }
              if (board[x][y].class == "tile") {
                board[x][y].class = "OPtile";
              }
              if (board[x][y].class == "mine") {
                board[x][y].class = "OPmine";
              }
            }
          }
          this.OPtiles = board;
          if (win) {
            if (this.activeDifficulty[0].title == "Beginner") {
              this.gameOverBeginner = true;
            }
            if (this.activeDifficulty[0].title == "Intermediate") {
              this.gameOverIntermediate = true;
            }
            if (this.activeDifficulty[0].title == "Hard") {
              this.gameOverHard = true;
            }
            this.gameOverExec(this.activeDifficulty[0]);
          }
          if (gameOver) {
            if (this.activeDifficulty[0].title == "Beginner") {
              this.winBeginner = true;
            }
            if (this.activeDifficulty[0].title == "Intermediate") {
              this.winIntermediate = true;
            }
            if (this.activeDifficulty[0].title == "Hard") {
              this.winHard = true;
            }
            this.winExec();
          }
        }
      };
    },
  },

  computed: {
    formatTimer() {
      const formattedMinutes = this.minutes.toString();
      const formattedSeconds = this.seconds.toString().padStart(2, "0");
      return `${formattedMinutes}:${formattedSeconds}`;
    },
  },

  created: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        this.hotbarOn = false;
      }
    });
    this.connect();
  },
}).mount("#app");
