var START = 0;
var CHALLENGE = 1;
var PRIZE = 2;
var WALL = 3;
var GOAL = 4;
var PLAYER = 5;
var BLANK = 9;

var GRYFFINDOR = 1;
var SLYTHERIN = 2;
var RAVENCLAW = 3;
var HUFFLEPUFF = 4;

//Types of challanges
var ENEMY = 6;
var HAZARD = 7;
var VOLDEMORT = 8;

//Objects in game besides player
var gameObjects = [];

var wonChallenge;
var beatVoldemort = false;

//SET UP MAPS
//Create 8x8 matrix, which stores objects
var map = [];
//Map representing what the player has visited 
var visited = [];

  //Set up event handlers for arrow buttons
  var up = function() {
          //Checks if player is at edge of upper side of map or if it is next to wall
          if (player.position.row == 0 || map[player.position.row - 1][player.position.col].type == WALL) {
             displayMessage("Sorry, you cannot go that way.");
             if (player.position.row != 0) {
              visited[player.position.row - 1][player.position.col] = true;
             } 
          }
          //Move to that direction
          else {
            player.position.row -= 1;

            //Make new position visited 
            visited[player.position.row][player.position.col] = true;

            //Check if player intersected with a game object (challenge or prize)
            playerIntersectsWithSquare();

            checkForWinOrLose(); //End game if won or lost
          }

          //Update map
          printMap();

  };
  var left = function() {

            console.log("left arrow clicked!");

          //Checks if player is at edge of left side of map or if it is next to wall
          if (player.position.col == 0 || map[player.position.row][player.position.col - 1].type == WALL) {
            displayMessage("Sorry, you cannot go that way.");
            if (player.position.col != 0) {
              visited[player.position.row][player.position.col - 1] = true;
            }
          }
          //Move to that direction
          else {
            player.position.col -= 1;

            //Make new position visited
            visited[player.position.row][player.position.col] = true;

            //Check if player intersected with a game object (challenge or prize)
            playerIntersectsWithSquare();

            checkForWinOrLose(); //End game if won or lost
          }

          //Update map
          printMap();

  };
  var down = function() {
          //Checks if player is at edge of lower side of map or if it is next to wall
          if (player.position.row == 7 || map[player.position.row + 1][player.position.col].type == WALL) {
            displayMessage("Sorry, you cannot go that way.");
            if (player.position.row != 7) {
              visited[player.position.row + 1][player.position.col] = true;
            }  
          }
          //Move to that direction
          else {
            player.position.row += 1;

            //Make new position visited
            visited[player.position.row][player.position.col] = true;

            //Check if player intersected with a game object (challenge or prize)
            playerIntersectsWithSquare();

            checkForWinOrLose(); //End game if won or lost
          }

          //Update map
          printMap();

  };
  var right = function() {
          //Checks if player is at edge of right side of map or if it is next to wall
          if (player.position.col == 7 || map[player.position.row][player.position.col + 1].type == WALL) {
            displayMessage("Sorry, you cannot go that way.");
            if (player.position.col != 7) {
              visited[player.position.row][player.position.col + 1] = true;
            }
          }
          //Move to that direction
          else {
            player.position.col += 1;

            //Make new position visited
            visited[player.position.row][player.position.col] = true;

            //Check if player intersected with a game object (challenge or prize)
            playerIntersectsWithSquare();

            checkForWinOrLose(); //End game if won or lost
          }

          //Update map
          printMap();

  }; 

//8 rows
for (var i = 0; i < 8; i++) {
  //8 columns
  var row = [];
  var rowVisited = [];
  for (var j = 0; j < 8; j++) {
    row.push("/");
    rowVisited.push(false); //not visited = false; visited = true
  }
  map.push(row);
  visited.push(rowVisited);
}

function setUpMap() {

  //Add start and goal
  var start = new Square(START, "Start");
  var goal = new Square(GOAL, "Goal");


  //Add to gameObjects: first elements
  gameObjects.push(start);
  gameObjects.push(goal);

  //Create 10 challenges: 7 with enemy and 3 with hazard
  gameObjects.push(new Challenge("Horcrux: Tom Riddle's Diary", "With the help of Harry, the hocrux was destroyed thanks to basilisk venom. Ink bled from the diary and a scream errupted as the soul fragment perished.", "You tried to summon a spell to defeat Tom Riddle's basilisk, but it was too agile. The snake took a bite from you, and you have been poisoned with venom.", 40, ENEMY, "Expulso", 80));
  gameObjects.push(new Challenge("Horcrux: Marvolo Gaunt's Ring", "With the help of Dumbledore using Godric Gryffinfor's sword, the ring exploded into ashes.", "When trying to destroy the ring, a protective charm rebounded your spell which made you hallucinate and faint.", 20, ENEMY, "Confringo", 20));
  gameObjects.push(new Challenge("Horcrux: Salazar Slytherin's Locket", "With the help of Ron as he stabbed the dark figure, the horcrux imploded into the remains of the locket.", "The horcux surrounded you with a dark aura and summoned hallucinations of your friends trying to attack you. A dark and evil laugh echoed through the halls as they continued to cast curses upon you.", 30, ENEMY, "Expelliarmus", 50));
  gameObjects.push(new Challenge("Horcrux: Helga Hufflepuff's Cup", "With the help of Ron and Hermoine, the venom from the basilisk fang was penetrated into the cup, and a soul of Voldemort appeared and exploded in the Chamber of Secrets, sending waves crashing forth.", "The cup sent you into Voldemort's memory which brought fear and toture into your mind, driving you insane.", 50, ENEMY, "Reducto", 50));
  gameObjects.push(new Challenge("Horcrux: Rowena Ravenclaw's Diadem", "The Room of Requirement was set on fire as the diadem erupted into flames, spiraling another piece of Voldemort's soul into ignition and death. You managed to escape by flying on a broom.", "Malfoy's friends attack you with Petrificus Totalus, leaving you paralyzed in every inch of your body. They take the diadem and run away with it.", 20, ENEMY, "Incendio", 50));
  gameObjects.push(new Challenge("Horcrux: Harry Potter", "You discover that Harry has been a horcrux all along. The one that Voldemort didn't intend to create. You had no choice but to kill him in order to destroy the hocrux that lived inside him. However, the boy who lived will return very soon.", "Voldemort arrives with his Death Eaters and surround you. They take you hostage and force you to give answers as to where Harry and his friends are. They attack you with Crucio, penetrating you with jolts of electricity and pain.", 70, ENEMY, "Avada Kedavra", 150));
  gameObjects.push(new Challenge("Horcrux: Nagini the Snake", "With the help of Neville, you create a diversion and distract it long enough for Neville to kill it with Godric Gryffindor's sword.", "The snake wraps you around in a coil and tries to stangle you. Thankfully, Neville lures it away just in time before it choked the life out of you.", 60, ENEMY, "Stupefy", 100));

  gameObjects.push(new Challenge("Hazard: DEMENTORS", "You cast 'Expecto Patronum' on the Dementors and a maginifcent doe is summoned to protect you and fight them off. A bright dome of light and happiness surrounds you, scaring the dementors off into the night sky.", "The dementors surround you and try to suck your soul and happiness out. You are saved by Harry, but you are left cold and distraught.", 70, HAZARD));
  gameObjects.push(new Challenge("Hazard: The Forbidden Forest", "You manage to escape the creatures of the Forbidden Forest by driving away with Ron's car.", "The spiders surround you and tangle you with web. They summon their leader, Aragog, to determine your fate. He plans to eat you for dinner, but luckily Harry and Ron came in and rescued you out.", 30, HAZARD));
  gameObjects.push(new Challenge("Hazard: The Whomping Willow", "You saved Ron from the warewolf who turns out to be Harry's godfather, Sirius Black. You managed to get through the tree without being hit by its enourmous swinging branches.", "The tree smacks you off the ground and sends you flying 40 feet in the air. You land on the ground and break your legs and spine.", 40, HAZARD));

  //Create 2 prizes and add to gameObjects
  gameObjects.push(new Square(PRIZE, "Cloak of Invisibility"));
  gameObjects.push(new Square(PRIZE, "Resurrection Stone"));

  //Create 10 walls
  for (var i = 1; i <= 10; i++) {
    var wall = new Square(WALL, "Wall " + i);
    gameObjects.push(wall);
  }

}

//Clear contents of map to blank, including visited map
function clearMap() {

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      map[i][j] = "/";
      visited[i][j] = false;
    }
  }

}

//Make enemy: Voldemort
var enemy = new Person("Voldemort", 500, VOLDEMORT);
enemy.numberOfHorcruxes = 7;
enemy.prize = {
  type: PRIZE,
  name: "Elder Wand"
};

//Make Default player
var player = new Person("Player", 300, PLAYER);
player.prizes = [];
//Randomly sort player into a house
player.house = sortPlayer();


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Sort player
function sortPlayer() {

  var house;
  var sort = getRandomInt(1, 4);

  switch(sort) {

    case GRYFFINDOR:
      house = ["Gryffindor", "gryffindor.gif"];
      break;
    case SLYTHERIN:
      house = ["Slytherin", "slytherin.gif"];
      break;
    case RAVENCLAW:
      house = ["Ravenclaw", "ravenclaw.gif"];
      break;
    case HUFFLEPUFF:
      house = ["Hufflepuff", "hufflepuff.gif"];
      break;  

  }

  return house;

}

//Constructors
function Position(x, y) {
  this.row = x;
  this.col = y;
}

function Person(name, health, type) {
  this.name = name;
  this.health = health;
  this.type = type;
}

function Square(typeInt, description) {

  this.type = typeInt;
  this.name = description;

  //Put it on random position of grid, but make sure it does not overlap existing squares
  var rowPosition = getRandomInt(0, 7);
  var colPosition = getRandomInt(0, 7);

  //Makes sure that position is not taking existing square on map
  while (map[rowPosition][colPosition] != "/") {
    rowPosition = getRandomInt(0, 7);
    colPosition = getRandomInt(0, 7);
  }

  //Add square to map
  map[rowPosition][colPosition] = this;

  //Store row position and col position in square object
  this.position = new Position(rowPosition, colPosition);

  //Checks if type is a START, then add to currentLocation of player
  if (typeInt == START) {
    player.position = new Position(rowPosition, colPosition);
    //Make starting location visible by making it true in visited map
    visited[rowPosition][colPosition] = true;
  }

}

function Challenge(name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost) {

    this.type = CHALLENGE;
    this.challengeName = name;
    this.launch = function(index) {

      //Result of challenge: if won or lost
      wonChallenge = false;

      $("#game").fadeOut(1000);

      $("#challenge-description").html("Take on challange: " + name + "?");
      $("#decline-challenge").unbind("click").click(function() {

        console.log("Challenge declined");

        $("#challenge").stop(true).fadeOut(1000); //Remove challenge
        //Lose 10 points on health
        player.health -= 10;
        printMap(); //Update
        $("#game").delay(1000).fadeIn(1000); //Return to game
        checkForWinOrLose();
      });
      $("#accept-challenge").unbind("click").click(function() {

        console.log("Challenge accepted");

        $("#challenge").stop(true).fadeOut(1000); //Remove challenge

        //Check what type of challenge it is
        if (typeOfChallenge == HAZARD) {
            hazardChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost);
        }
        //Challenge is an enemy challange
        else {
          enemyChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost);
        }

      });

      //Display challenge
      $("#challenge").delay(1000).fadeIn(1000);

    };

    //Put it on random position of grid, but make sure it does not overlap existing squares
    var rowPosition = getRandomInt(0, 7);
    var colPosition = getRandomInt(0, 7);

    //Makes sure that position is not taking existing square on map
    while (map[rowPosition][colPosition] != "/") {
      rowPosition = getRandomInt(0, 7);
      colPosition = getRandomInt(0, 7);

    }

    //Store row position and col position in challenge object
    this.position = new Position(rowPosition, colPosition);

    //Add challenge to map
    map[rowPosition][colPosition] = this;

}

function hazardChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost) {

            //Determine outcome
            var outcome = getRandomInt(0, 1);

            //WON
            if (outcome) {

              console.log("You won the challenge!");

              //Display result of challenge in "message own page"
              $("#mop-1").html(messageWon);
              $("#mop-2").html("Congratulations! You won the challenge.");

              $("#message-own-page").unbind("click").click(function() {
                $(this).fadeOut(1000); //Remove message
                printMap();
                $("#game").delay(1000).fadeIn(1000); //Return to game
              });

              $("#message-own-page").delay(1000).fadeIn(1000);

              challengeWon(index);
              return;

            }
            //LOST
            else {

              console.log("You lost the challenge!");

              //Display result of challenge in "message own page"
              $("#mop-1").html(messageLost);
              $("#mop-2").html("You failed the challenge. You lost " + healthLost + " health points.");

              $("#message-own-page").unbind("click").click(function() {
                $(this).fadeOut(1000); //Remove message

                $("#no").unbind("click").click(function() {

                    console.log("Not trying again");

                    $("#try-again").stop(true).fadeOut(1000); //Get rid of try again page 
                    $("#game").delay(1000).fadeIn(1000); //Return to game
                });
                $("#yes").unbind("click").click(function() {
                  $("#try-again").stop(true).fadeOut(1000, function() {
                    hazardChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost); //Enter hazard challenge again
                  }); //Get rid of try again page 
                });

                //Ask to try again
                $("#try-again").delay(1000).fadeIn(1000);
                checkForWinOrLose();
                
              });

              $("#message-own-page").delay(1000).fadeIn(1000);

              //Player loses health based on challenge
              player.health -= healthLost;
              printMap();

              //Check if player has no health
              if (player.health <= 0) {
                wonChallenge = false;
                return;
              }

            }

}

function enemyChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost) {

            //Ask to type in spell to defeat enemy 
            $("#spell-instruction").html("Type a spell from the choices below to defeat " + name + ".");

            //10 SPELLS
            var spells = ["Expelliarmus", "Confringo", "Avada Kedavra", "Protego", "Expecto Patronum", "Reducto", "Petrificus Totalus", "Stupefy", "Expulso", "Incendio"];

            var spellChoices = [spellToWin];

            //Remove spellToWin from spells
            for (var i = 0; i < 10; i++) {
              if (spells[i] == spellToWin) {
                spells.splice(i, 1);
                break;
              }
            } 

            //Get 3 random choices for the spell including the winning spell
            for (var i = 0; i < 3; i++) {

              var randomIndex = getRandomInt(0, spells.length - 1);

              while (spellChoices[i] == spells[randomIndex]) {
                randomIndex = getRandomInt(0, spells.length - 1);
              }

              //Get spell and add to choices
              spellChoices.push(spells.splice(randomIndex, 1));
            
            } 

            console.log("Spell choices: " + spellChoices.length);
            //Shuffle order of spell choices 
            shuffle(spellChoices);
    
            var listOfSpellChoices = "";
            for (var i = 0; i < spellChoices.length; i++) {
              listOfSpellChoices += spellChoices[i];
              //Not the last element
              if (i + 1 != spellChoices.length) {
                listOfSpellChoices += ", ";
              }
            }

            //Add listOfSpellChoices to spell page
            $("#spells").html(listOfSpellChoices);
            //Clear input of spellInput
            $("#spellInput").val("");

            $("#conjure-spell").one("click", function() {
                //No input
                if ($("#spellInput").val().trim() == "") {
                  $("#spell-instruction").html("Please type in a spell.");
                }
                else {

                  //Remove spell page
                  $("#spell").stop(true).fadeOut(1000);

                  var spell = $("#spellInput").val().toLowerCase();

                  //WON
                  if (spell == spellToWin.toLowerCase()) {

                    console.log("You won the enemy challenge");

                    //Display result of challenge in "message own page"
                    $("#mop-1").html(messageWon);
                    $("#mop-2").html("Congratulations! You won the challenge. Voldemort has lost " + enemyHealthLost + " health points and has " + --enemy.numberOfHorcruxes + " horcruxes left.");

                    $("#message-own-page").unbind("click").click(function() {
                      $(this).fadeOut(1000); //Remove message
                      printMap();
                      $("#game").delay(1000).fadeIn(1000, function() {
                        //$("#try-again").hide(); //Get rid of try again page if it shows up
                      }); //Return to game
                    });

                    $("#message-own-page").delay(1000).fadeIn(1000);
  
                    //Enemy loses health
                    enemy.health -= enemyHealthLost;
                    challengeWon(index);
                    return;

                  }
                  //LOST
                  else {

                      console.log("You lost the enemy challenge.");

                      //Display result of challenge in "message own page"
                      $("#mop-1").html(messageLost);
                      $("#mop-2").html("You failed the challenge. You lost " + healthLost + " health points.");

                      $("#message-own-page").unbind("click").click(function() {
                        $(this).fadeOut(1000); //Remove message

                        $("#no").unbind("click").click(function() {
                            $("#try-again").stop(true).fadeOut(1000); //Get rid of try again page 
                            $("#game").delay(1000).fadeIn(1000); //Return to game
                        });
                        $("#yes").unbind("click").click(function(){
                          $("#try-again").stop(true).fadeOut(1000, function() {
                            enemyChallenge(index, name, messageWon, messageLost, healthLost, typeOfChallenge, spellToWin, enemyHealthLost); //Enter enemy challenge again
                          }); //Get rid of try again page 
                        });

                        //Ask to try again
                        $("#try-again").delay(1000).fadeIn(1000);
                        checkForWinOrLose();
                        
                      });

                      $("#message-own-page").delay(1000).fadeIn(1000);

                      //Player loses health based on challenge
                      player.health -= healthLost;
                      printMap();

                      //Check if player has no health
                      if (player.health <= 0) {
                        wonChallenge = false;
                        return;
                      }

                  }

                }
            });

            //Display spell page
            $("#spell").delay(1000).fadeIn(1000);  

}

//NEW GAME
function newGame() {

  $(".container-fluid").attr("style", "width: 100%;");

  setUpMap();
  printMap();

  //Set event handler for quit game button
  $("#quit-button").click(function() {
    quitGame();
  });

  //Show game on DOM
  $("#game").stop(true).fadeIn(1000);

  $("#up").on("click", up);
  $("#left").on("click", left);
  $("#down").on("click", down);
  $("#right").on("click", right);

}

function playerIntersectsWithSquare() {

  console.log("went through");

  //Get player's location and see if gameObjects has square with the same location
  for (var i = 1; i < gameObjects.length; i++) {

    //Player intersects with a game object
    if (gameObjects[i].position.row == player.position.row && gameObjects[i].position.col == player.position.col) {

      console.log("Went through");

      //Check what type of game object it is: mainly looks for challenge or prize
      switch (gameObjects[i].type) {

         case CHALLENGE:

            console.log("player got a challenge");

            //Make arrows unclickable
            $("#up").off();
            $("#left").off();
            $("#down").off();
            $("#right").off();

            gameObjects[i].launch(i);

            //Make arrows clickable
            $("#up").on("click", up);
            $("#left").on("click", left);
            $("#down").on("click", down);
            $("#right").on("click", right);

            //Update map
            printMap();

            checkForWinOrLose();

            break;
         case PRIZE:
            console.log("player got a prize");
            displayMessage("You got a prize: " + gameObjects[i].name + "!");
            //Collect prize and get rid of it in the map an gameObjects
            player.prizes.push(gameObjects[i]);
            map[player.position.row][player.position.col].type = "/";
            gameObjects[i].type = BLANK;
            $("#" + player.position.row.toString() + player.position.col.toString()).attr("background", "floor.jpg").attr("title", "blank");
            //Update map
            printMap();
            break;
          case GOAL:
            if (player.prizes.length < 2) {
              displayMessage("You have reached Dumbledore's office! However, you still need at least 2 prizes in order to finish and win the game.");
            }
          default:
            break;

      }

      break;

    }

  }

}

function challengeWon(index) {

  //If won challenge, get rid of challenge on map and gameObjects
  console.log("You won the challenge!!!");

  map[player.position.row][player.position.col] = "/";
  gameObjects[index].type = BLANK;
  $("#" + player.position.row.toString() + player.position.col.toString()).attr("background", "floor.jpg").attr("title", "blank");

  //Check if player defeated Voldemort
  if (enemy.health <= 0 && enemy.numberOfHorcruxes == 0 && !beatVoldemort) {
    displayMessageOwnPage("Congratulations! You defeated Voldemort!", "You received a prize: Elder Wand!");
    beatVoldemort = true;
    player.prizes.push(enemy.prize);
  }

}

function printMap() {

  //Display number of prizes player has and # of horcruxes left
  var listOfPrizes = "";
  for (var i = 0; i < player.prizes.length; i++) {
    listOfPrizes += player.prizes[i].name;
    //Not the last element
    if (i + 1 != player.prizes.length) {
      listOfPrizes += ", ";
    }
  }

  //Update number of prizes and horcruzes in DOM
  $("#prizes").html(listOfPrizes);
  $("#horcruxes").html(enemy.numberOfHorcruxes);

  console.log("You: " + player.health);
  console.log("Voldemort: " + enemy.health);

  //Update health bars
  $("#player").html("You: " + player.health);
  $("#player").attr("aria-valuenow", player.health);
  $("#player").attr("style", "width: " + player.health / 300 * 100 + "%;");
  $("#enemy").html("Voldemort: " + enemy.health);
  $("#enemy").attr("aria-valuenow", enemy.health);
  $("#enemy").attr("style", "width: " + enemy.health / 500 * 100 + "%;");

  //Console log map result
  var mapResult = "";

  for (var i = 0; i < 8; i++) {

    for(var j = 0; j < 8; j++) {

      //Get id for position of data table
      var positionString = "#" + i.toString() + j.toString();

      //Check if player position intersects this position on the map
      if (player.position.row == i && player.position.col == j) {

        $(positionString).attr("background", player.house[1]).attr("title", player.name).attr("style", "background-size: contain;");
        
        mapResult += "* ";
        continue;

      }

      //Check if position is unvisited
      if (visited[i][j] == false) {
        //Set data table to black
        $(positionString).attr("style", "background-color: black");
      }

      switch (map[i][j].type) {
        case START:
          mapResult += "S";
          if (visited[i][j]) {
            $(positionString).attr("background", "start.png").attr("title", map[i][j].name).attr("style", "background-size: contain;");
          } 
          break;
        case CHALLENGE:
          mapResult += "C";
          if (visited[i][j]) {
            $(positionString).attr("background", "horcrux.jpg").attr("title", map[i][j].challengeName).attr("style", "background-size: contain;");
          } 
          break;
        case PRIZE:
          mapResult += "P";
          if (visited[i][j]) {
            $(positionString).attr("background", "deathly-hallows.jpg").attr("title", map[i][j].name).attr("style", "background-size: contain;");
          }
          break;
        case WALL:
          mapResult += "W";
          if (visited[i][j]) {
            $(positionString).attr("background", "wall.jpg").attr("title", map[i][j].name).attr("style", "background-size: contain;");
          }
          break;
        case GOAL:
          mapResult += "G";
          if (visited[i][j]) {
            $(positionString).attr("background", "goal.jpg").attr("title", map[i][j].name).attr("style", "background-size: contain;");
          }
          break;
        default:
          mapResult += "/";
          if (visited[i][j]) {
            $(positionString).attr("background", "floor.jpg").attr("title", "blank").attr("style", "background-size: contain;");
          }
          break;
      }

      mapResult += " ";

    }

    mapResult += "\n";

  }

  console.log(mapResult);

}
//////////////////
//DOCUMENT READY//
//////////////////
$(document).ready(function() {

    $("#title, #creator, .form-group, .message, #game, #spell, #message-own-page, #challenge, #try-again, #end-game, #quit-game").hide();
    $("#title").fadeIn(1000);
    $("#creator").delay(1000).fadeIn(1000);
    $(".form-group").delay(2000).fadeIn(1000);
    
    //Submit name
    $("#formButton").click(function() {

      //No input
      if ($("#input").val().trim() == "") {
        $("#prompt").html("Please enter your name.");
      }
      else {
        //Store name       
        player.name = $("#input").val();
        //Make form disappear 
        $(".form-group").fadeToggle(1000);
        updateMessage("Welcome to Hogwarts, " + player.name + "!", "The Sorting Hat will place you into your chosen House...");
        $("#messageButton").hide(); //Hide button for now
        $(".message").delay(1000).fadeToggle(1000).delay(4000).fadeToggle(1000, function() {
            updateMessage("Congratulations! You have been sorted into...", player.house[0]);
            $("#message-2").hide().delay(2000).fadeToggle(1000);
        }).fadeToggle(1000).delay(5000).fadeToggle(1000, function() {

            updateMessage("Voldemort and his Death Eaters have been rampaging all over Hogwarts and the Wizarding World! It's up to you to try and stop him.", "Your goal is to either get at least 2 of the 3 prizes that make up the Deathly Hallows and give them to Dumbledore at his office so he can use it to defeat Voldemort, or you can go out there and defeat him yourself! Of course, with the help of some friends along the way... If you defeat him, you get a special prize: the Elder Wand! The most powerful wand in the Wizarding World... With these 3 prizes, you can become the Master of Death! But of course, you need to turn these in to Dumbledore's office once you get them. He is the one in charge of handling these powerful artifacts. If you succeed, you will be able to save the Wizardng World! Are you up to the task?");
            $(".message").attr("style", "margin-top: 5%;").hide();

            $("#message-2").hide().delay(4000).fadeToggle(2000, function() {
                $(this).after("<p id=\"skip\">(Click to Skip)</p>"); //Add skip sentence after second message 
                $(".message").click(function() {
                  //Stops current animations running and overwrites it with fadeToggle 
                  $(this).stop( true ).fadeOut(1000, function() {
                    $("#skip").remove(); //Remove skip sentence
                    preGame();
                  });
                });
            });

        }).fadeToggle(1000).delay(30000).fadeToggle(1000, function() {
          $("#skip").remove(); //Remove skip sentence
          preGame();
        });

      }       

    });
   
});

function updateMessage(par1, par2) {
  $("#message-1").html(par1);
  $("#message-2").html(par2);
}

function preGame() {

        //Update info in player and house stats of DOM
        $("#player-name").html(player.name);
        $("#house").html(player.house[0]);
        $(".message").attr("style", "margin-top: 15%;").hide();

        updateMessage("Great! So the cups on the map represent challenges and the Deathly Hallows symbols represent a prize. You cannot go past the walls because you are not a ghost, of course. Collect the prizes and bring them to Dumbledore's office in order to win the game.", "Good luck!");
        $("#messageButton").show().click( function() { ////Make button appear to start new game
          //Remove message
          $(".message").fadeOut(1000, function() {
            newGame();
          });

        }); 
        $(".message").off( "click" ); //Make unclickable
        $(".message").fadeToggle(1000); //Make message appear
}

function displayMessage(message) {
  $("#game").prepend("<p class='currentMessage'>" + message + "</p>");
  $(".currentMessage").delay(3000).fadeToggle(1000, function() {
    $(this).remove(); //Remove message from DOM after displaying it
  });
}

function displayMessageOwnPage(message1, message2) {

  $("#game").fadeOut(1000);

  $("#mop-1").html(message1);
  $("#mop-2").html(message2);

  $("#message-own-page").click(function() {
      $(this).fadeOut(1000); //Remove message
      $("#game").delay(1000).fadeIn(1000); //Return to game
  });

  $("#message-own-page").delay(1000).fadeIn(1000);

}

function checkForWinOrLose() {
  
  var playerWon = player.position.row == gameObjects[1].position.row && player.position.col == gameObjects[1].position.col && player.prizes.length >= 2;
  var playerLost = player.health <= 0;

  if (playerWon || playerLost) {

    console.log("Game has ended.");

    //Game has ended 
    $("#game").stop(true).fadeOut(1000);
    $("#try-again").stop(true).fadeOut(1000);

    if (playerWon) {
      console.log("You won!");
      $("#end-game-status").html("You won, " + player.name + "!");
    }
    else {
      $("#end-game-status").html("Bloody hell, " + player.name + "! You died!");
    }

    //Event handler for quit game and new game 
    $("#quit-game-button").click(function() {
      $("#end-game").fadeOut(1000);
      quitGame();
    });
    $("#new-game-button").click(function() {
      $("#end-game").fadeOut(1000, function() {
        //Reset values before starting new game
        resetValues();
        newGame();
      });
    });

    //Display end game page
    $("#end-game").delay(1000).fadeIn(1000);

  }

}

function quitGame() {

  console.log("Quit!");

  $("#game").stop(true).fadeOut(1000); //Get rid of game if it is displayed

  //Event handler for new game button
  $("#new-button").click(function() {
      $("#quit-game").stop(true).fadeOut(1000, function() {
        //Reset values before starting new game
        resetValues();
        newGame();
      });
  });

  //Display quit game page
  $("#quit-game").delay(1000).fadeIn(1000);

}

function resetValues() {
    //Clear map
    clearMap();
    wonChallenge = false;
    //Clear attributes of each table cell: background, title, and style
    for (var i = 0; i < 8; i++) {

      for(var j = 0; j < 8; j++) {

        //Get id for position of data table
        var positionString = "#" + i.toString() + j.toString();

        $(positionString).removeAttr("background title style");
      }

    }

    //Remove event handlers for arrow buttons
    $("#up, #left, #down, #right, #conjure-spell, #accept-challenge").off("click");
    //Clear gameObjects
    gameObjects.length = 0;
    //Clear prizes
    player.prizes = [];
    //Put oirignal health of player and enemy
    player.health = 300;
    enemy.health = 500;
    enemy.numberOfHorcruxes = 7;
}

//Shuffle array - got online on stackoverflow
//Use only to shuffle order of spellChoices list
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}