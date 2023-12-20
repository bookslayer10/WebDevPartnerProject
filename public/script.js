// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"

// Declaration of hex
class Hex {

  constructor(id, backgroundImage, foregroundImage, hidden) {
    this.id = id;
    this.hidden = hidden;
    this.divElement = null;
    this.imgElement = null;
    this.backgroundImage = backgroundImage;
    this.foregroundImage = foregroundImage;
    this.unit = null;
  }

  assignElements() {
    this.divElement = document.getElementById(this.id);
    this.imgElement = document.getElementById("img" + this.id);
  }

  updateImages() {
    if (this.hidden == true) {
      this.imgElement.classList.add("hidden");
      this.divElement.style.backgroundImage = "url(images/fogTile.svg)"; // using colored background for now instead of fog of war image
      console.log(this.id);
    } else {

      if (this.foregroundImage != false) {
        this.imgElement.classList.remove("hidden");
        this.imgElement.setAttribute("src", this.foregroundImage);
        this.divElement.style.backgroundImage = "url(" + this.backgroundImage + ")";
      } else {
        this.imgElement.classList.add("hidden");
        this.divElement.style.backgroundImage = "url(" + this.backgroundImage + ")";
      }
    }
  }
}

const INFANTRY = 0;
const ARMOUR = 1;
const ARTILLERY = 2;

class Unit {
  constructor(ownerID, unitType, health) {
    this.ownerID = ownerID;
    this.unitType = unitType;
    this.health = health;
  }
}

const BOARD_SIZE = 398;

let hexDiv; //variable to create hexs
let hexImg; //variable for the images within the hexes
let isUnloading = false;
//let numPlayers2 = 0;

// hex array
let hexes = new Array(BOARD_SIZE);
hexes[0] = null;
let displayHexes = new Array(hexes.length);
displayHexes[0] = null;

let isBoardDivLoaded = false;

let ajacentHexStore = new Array();
ajacentHexStore.push(null);

// k is the the column, i is the row
let id = 1;
for (let k = 1; k <= 23; k++) {
  for (let i = 1; i <= 23 - Math.abs(k - 12); i++, id++) { // this for loop increment includes both i++ and id++

    let edgesIsOn = new Array(); // 0 is top side, continue clockwise 0 - 5
    edgesIsOn.push(k == 1);
    edgesIsOn.push(i == 11 + k);
    edgesIsOn.push(i == 35 - k);
    edgesIsOn.push(k == 23);
    edgesIsOn.push(i == 1 && 12 <= k);
    edgesIsOn.push(i == 1 && k <= 12);

    // hexagon is 12 across an edge, 23 across diameter, 23 columns, 12-23-12 rows
    // array from 0 to 5 of the id of ajacent hexes, -1 if none ajacent
    // ajacentHexes is ordered as the 30, 90, 150, 210, 270, 330
    let ajacentHexes = new Array();

    if (edgesIsOn[0] || edgesIsOn[1]) {
      ajacentHexes.push(-1);
    } else {
      if (k <= 12) {
        ajacentHexes.push(id - (10 + k));
      } else {
        ajacentHexes.push(id - (35 - k));
      }
    }

    if (edgesIsOn[1] || edgesIsOn[2]) {
      ajacentHexes.push(-1);
    } else {
      ajacentHexes.push(id + 1);
    }

    if (edgesIsOn[2] || edgesIsOn[3]) {
      ajacentHexes.push(-1);
    } else {
      if (k <= 11) {
        ajacentHexes.push(id + (12 + k));
      } else {
        ajacentHexes.push(id + (35 - k));
      }
    }

    if (edgesIsOn[3] || edgesIsOn[4]) {
      ajacentHexes.push(-1);
    } else {
      if (k <= 11) {
        ajacentHexes.push(id + (11 + k));
      } else {
        ajacentHexes.push(id + (34 - k));
      }
    }

    if (edgesIsOn[4] || edgesIsOn[5]) {
      ajacentHexes.push(-1);
    } else {
      ajacentHexes.push(id - 1);
    }

    if (edgesIsOn[5] || edgesIsOn[0]) {
      ajacentHexes.push(-1);
    } else {
      if (k <= 12) {
        ajacentHexes.push(id - (11 + k));
      } else {
        ajacentHexes.push(id - (36 - k));
      }
    }

    ajacentHexStore.push(ajacentHexes);
  }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlJCQXZh1S3fpxZqzGnp8VnG-04MO-O7M",
  authDomain: "web-dev-partner-project.firebaseapp.com",
  databaseURL: "https://web-dev-partner-project-default-rtdb.firebaseio.com",
  projectId: "web-dev-partner-project",
  storageBucket: "web-dev-partner-project.appspot.com",
  messagingSenderId: "556366486052",
  appId: "1:556366486052:web:860a1f7da246a91499d6b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let pass1 = document.getElementById("passphrase");
let pass2 = document.getElementById("passphrase2");

let passphrase;

let numberOfPlayersRef;
let turnNumberRef;
let hexesRef;

let numberOfPlayers = null;
let playerID = null;
let turnNumber = null;

let selectedUnit = null;

let mainStyle = document.getElementById("main").style;
let scale = 1.5;
let boardX = 50;
let boardY = 50;
mainStyle.setProperty("--scale", scale);

document.getElementById("passbutton").addEventListener("click", passFunction);

function passFunction() {
  if (pass1.value != "" && pass2.value != "") {
    passphrase = pass1.value + pass2.value;

    numberOfPlayersRef = ref(database, "numberOfPlayers+" + passphrase);
    hexesRef = ref(database, "hexes+" + passphrase);
    turnNumberRef = ref(database, "turnNumber+" + passphrase);
    document.getElementById("message").style.display = "none";
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("pass1").innerHTML = "Lobby: " + pass1.value;
    document.getElementById("pass2").innerHTML = "Passphrase: " + pass2.value;
    document.getElementById("numplay").style.display = "initial";
    document.getElementById("pass1").style.display = "initial";
    document.getElementById("pass2").style.display = "initial";

    onValue(numberOfPlayersRef, (data) => {

      numberOfPlayers = data.val();

      if (playerID == null && numberOfPlayers < 7) {
        numberOfPlayers++;
        playerID = numberOfPlayers;

        set(numberOfPlayersRef, numberOfPlayers);
      }

      document.getElementById("numplay").innerHTML = "Number of Players: " + numberOfPlayers;

    }); // onValue numPlayers

    onValue(turnNumberRef, (data) => {

      turnNumber = data.val();
      if (turnNumber == null || turnNumber > numberOfPlayers) {
        turnNumber = 1;
        set(turnNumberRef, turnNumber)
      }

    }); // onValue turnNumberRef

    onValue(hexesRef, (data) => {
      console.log("onvalue");

      if (isUnloading) {
        return;
      }

      if (data.val() == null) {
        console.log("Null array in firebase");
        createNewHexArray();
        hexes[3].unit = (new Unit(1, INFANTRY, 3));
        hexes[60].unit = (new Unit(1, ARTILLERY, 3));
        hexes[100].unit = (new Unit(1, ARMOUR, 3));
        hexes[200].unit = (new Unit(2, INFANTRY, 3));
        hexes[300].unit = (new Unit(2, ARTILLERY, 3));
        hexes[370].unit = (new Unit(2, ARMOUR, 3));
        set(hexesRef, hexes);
      } else {
        console.log("Downloading array from firebase");
        for (let i = 1; i < BOARD_SIZE; i++) {
          if (hexes[i] == undefined) {
            hexes[i] = new Hex();
          }
          hexes[i].id = data.val()[i].id;
          hexes[i].backgroundImage = data.val()[i].backgroundImage;
          hexes[i].foregroundImage = data.val()[i].foregroundImage;
          hexes[i].hidden = data.val()[i].hidden;

          let tempUnit = data.val()[i].unit;
          if (tempUnit != undefined) {
            hexes[i].unit = tempUnit;
          } else {
            hexes[i].unit = null;
          }

        }
      }

      if (isBoardDivLoaded) updateGameBoard();

    }); // onValue numPlayers



    if (isBoardDivLoaded) updateGameBoard();

  } else if (pass1.value != "" && pass2.value == "") {
    document.getElementById("error").style.display = "initial";
    document.getElementById("error").innerHTML = "Please put in a passphrase";
  } else if (pass1.value == "" && pass2.value != "") {
    document.getElementById("error").style.display = "initial";
    document.getElementById("error").innerHTML = "Please put in a lobby name";
  } else {
    document.getElementById("error").style.display = "initial";
    document.getElementById("error").innerHTML = "Please enter a lobby name and passphrase";
  }
}

window.onkeydown = (e) => {
  if (passphrase == undefined) {
    return;
  }

  if (e.key == 'q') {
    scale *= 0.95;
    scale = Math.max(scale, 0.1);
    mainStyle.setProperty('--scale', scale);
  } else if (e.key == 'e') {
    scale *= 1.05;
    scale = Math.min(scale, 4);
    mainStyle.setProperty('--scale', scale);
  } else if (e.key == 's') {
    boardY -= 0.5 * scale;
    boardY = Math.max(boardY, -50);
    mainStyle.setProperty("top", boardY + "%");
  } else if (e.key == 'w') {
    boardY += 0.5 * scale;
    boardY = Math.min(boardY, 150);
    mainStyle.setProperty("top", boardY + "%");
  } else if (e.key == 'd') {
    boardX -= 0.5 * scale;
    boardX = Math.max(boardX, -50);
    mainStyle.setProperty("left", boardX + "%");
  } else if (e.key == 'a') {
    boardX += 0.5 * scale;
    boardX = Math.min(boardX, 150);
    mainStyle.setProperty("left", boardX + "%");
  }

}

window.onbeforeunload = (event) => {
  isUnloading = true;

  if (playerID != null) {
    numberOfPlayers--;

    if (0 < numberOfPlayers) {
      set(numberOfPlayersRef, numberOfPlayers);
    } else {
      set(hexesRef, null);
      set(turnNumberRef, null);
      set(numberOfPlayersRef, null);
    }
  } // if
} // onunload

//AUTOMATE THE CREATION OF DIVS IN THE CONTAINER DIVS (CREATE FUNCTION).

window.onload = function () {
  let id = 1;
  for (let k = 1; k < 13; k++) {
    let container = document.getElementById("c" + (k));
    container.setAttribute("class", "container");
    for (let i = 1; i < 12 + k; i++) {
      createHexElement(container, id);
      id++;
    }
  }

  for (let k = 1; k < 12; k++) {
    let container = document.getElementById("c" + (k + 12));
    container.setAttribute("class", "container");
    for (let i = 1; i < 24 - k; i++) {
      createHexElement(container, id);
      id++;
    }
  }


  isBoardDivLoaded = true;

  updateGameBoard();
  //set(turnNumberRef, turnNumber);

  // 397 hexagon elements created
}

function createHexElement(container, id) {
  hexDiv = document.createElement("div");
  hexDiv.setAttribute("id", id);
  hexDiv.addEventListener("click", hexClick);
  hexDiv.addEventListener("contextmenu", hexRightClick);
  hexDiv.addEventListener("click", logHexName);

  hexImg = document.createElement("img");
  hexImg.setAttribute("src", "/images/testImage.svg");
  hexImg.setAttribute("id", "img" + id);

  container.appendChild(hexDiv);
  hexDiv.appendChild(hexImg);
}

function createNewHexArray() {

  let createID = 1;

  // k is the the column, i is the row
  for (let k = 1; k <= 23; k++) {
    for (let i = 1; i <= 23 - Math.abs(k - 12); i++, createID++) { // this for loop increment includes both i++ and id++
      if (hexes[createID] == undefined) {
        hexes[createID] = new Hex();
      }
      hexes[createID].id = createID;
      hexes[createID].backgroundImage = "images/grassTile1.svg";
      hexes[createID].foregroundImage = false;
      hexes[createID].hidden = false;

    }
  }
}

const logHexName = (e) => {
  console.log("ID of Hex clicked: " + e.target.id);
}

const hexClick = (e) => {
  e.preventDefault();

  if (turnNumber != playerID) {
    return;
  }

  // move unit, otherwise select unit
  if (hexes[e.target.id].unit == null && selectedUnit != null) {
    let isInRange = false;
    ajacentHexStore[selectedUnit].forEach(function (i) {
      if (e.target.id == i) {
        isInRange = true;
        return;
      }

      if (i != -1 && hexes[selectedUnit].unit.unitType == ARMOUR) {
        ajacentHexStore[i].forEach(function (j) {
          if (e.target.id == j) {
            isInRange = true;
            return;
          }

          if (j != -1) {
            if (hexes[selectedUnit].unit.unitType == ARMOUR) {
              ajacentHexStore[j].forEach(function (k) {
                if (e.target.id == k) {
                  isInRange = true;
                  return;
                }

              });
            }
          }
        });
      }
    });

    if (isInRange) {
      console.log("moving unit");
      turnNumber++;
      set(turnNumberRef, turnNumber);

      hexes[e.target.id].unit = hexes[selectedUnit].unit;
      hexes[selectedUnit].unit = null;

      set(hexesRef, hexes);
    }
  }

  if (hexes[e.target.id].unit != null && hexes[e.target.id].unit.ownerID == playerID) {
    console.log("selecting unit");

    selectedUnit = e.target.id;
  }
}

const hexRightClick = (e) => {
  e.preventDefault();

  if (turnNumber != playerID) {
    return;
  }

  // fire unit, otherwise select unit
  if (selectedUnit != null && (hexes[e.target.id].unit == null || hexes[e.target.id].unit.ownerID != playerID)) {

    let isInRange = false;
    ajacentHexStore[selectedUnit].forEach(function (i) {
      if (e.target.id == i) {
        isInRange = true;
        return;
      }

      if (i != -1) {
        ajacentHexStore[i].forEach(function (j) {
          if (e.target.id == j) {
            isInRange = true;
            return;
          }

          if (j != -1 && hexes[selectedUnit].unit.unitType == ARTILLERY) {
            ajacentHexStore[j].forEach(function (k) {
              if (e.target.id == k) {
                isInRange = true;
                return;
              }
              if (k != -1 && hexes[selectedUnit].unit.unitType == ARTILLERY) {

                ajacentHexStore[k].forEach(function (l) {
                  if (e.target.id == l) {
                    isInRange = true;
                    return;
                  }

                });

              }

            });
          }
        });
      }
    });

    if (isInRange) {
      console.log("firing unit");
      turnNumber++;
      set(turnNumberRef, turnNumber);

      if (hexes[e.target.id].unit != null) {
        hexes[e.target.id].unit.health -= 1;
        if (hexes[e.target.id].unit.health < 1) {
          hexes[e.target.id].unit = null;
        }
      }

      set(hexesRef, hexes);
    }
  }

  if (hexes[e.target.id].unit != null && hexes[e.target.id].unit.ownerID == playerID) {
    console.log("selecting unit");

    selectedUnit = e.target.id;
  }
}

function updateGameBoard() {

  console.log("update board");

  // if hexes aren't defined, then don't try to update the board
  if (hexes[1] == undefined) {
    return;

  }

  for (let i = 1; i < BOARD_SIZE; i++) {
    if (displayHexes[i] == undefined) {
      displayHexes[i] = new Hex();
    }
    displayHexes[i].id = hexes[i].id;
    displayHexes[i].backgroundImage = hexes[i].backgroundImage;
    displayHexes[i].foregroundImage = hexes[i].foregroundImage;
    displayHexes[i].hidden = hexes[i].hidden;


    displayHexes[i].hidden = true;
  }

  for (let i = 1; i < BOARD_SIZE; i++) {
    if (hexes[i].unit != null) {
      switch (hexes[i].unit.unitType) {
        case INFANTRY:
          displayHexes[i].foregroundImage = "images/soldier.svg";
          break;
        case ARMOUR:
          displayHexes[i].foregroundImage = "images/tank.svg";
          break;
        case ARTILLERY:
          displayHexes[i].foregroundImage = "images/artillery.svg";
          break;
      }


      if (hexes[i].unit.ownerID == playerID) {
        displayHexes[i].hidden = false;
        ajacentHexStore[i].forEach(function (j) {
          if (j != -1) {
            displayHexes[j].hidden = false;
            if (hexes[i].unit.unitType == INFANTRY || hexes[i].unit.unitType == ARMOUR) {
              ajacentHexStore[j].forEach(function (k) {
                if (k != -1) {
                  displayHexes[k].hidden = false;

                  if (hexes[i].unit.unitType == INFANTRY) {
                    ajacentHexStore[k].forEach(function (l) {
                      if (l != -1) {
                        displayHexes[l].hidden = false;

                      }
                    });
                  }
                }
              });
            }

          }
        });

      }
    }
  }

  for (let i = 1; i < BOARD_SIZE; i++) {
    displayHexes[i].assignElements();
    displayHexes[i].updateImages();
  }
}