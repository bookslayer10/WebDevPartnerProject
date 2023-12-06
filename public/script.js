// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"

const BOARD_SIZE = 398;

let hexDiv; //variable to create hexs
let isUnloading = false;
// hex array
let hexes = new Array();
hexes.push(null);

let displayHexes = new Array();
displayHexes.push(null);

let isBoardDivLoaded = false;

let ajacentHexStore = new Array();
ajacentHexStore.push(null);

// k is the the column, i is the row
let id = 1;
for(let k = 1; k <= 23; k++){
  for(let i = 1; i <= 23 - Math.abs(k - 12); i++, id++){ // this for loop increment includes both i++ and id++

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

    if(edgesIsOn[0] || edgesIsOn[1]){
      ajacentHexes.push(-1);
    } else {
      if(k <= 12){
        ajacentHexes.push(id - (10 + k));
      } else {
        ajacentHexes.push(id - (35 - k));
      }
    }

    if(edgesIsOn[1] || edgesIsOn[2]){
      ajacentHexes.push(-1);
    } else {
      ajacentHexes.push(id + 1);
    }

    if(edgesIsOn[2] || edgesIsOn[3]){
      ajacentHexes.push(-1);
    } else {
      if(k <= 11){
        ajacentHexes.push(id + (12 + k));
      } else {
        ajacentHexes.push(id + (35 - k));
      }
    }

    if(edgesIsOn[3] || edgesIsOn[4]){
      ajacentHexes.push(-1);
    } else {
      if(k <= 11){
        ajacentHexes.push(id + (11 + k));
      } else {
        ajacentHexes.push(id + (34 - k));
      }
    }

    if(edgesIsOn[4] || edgesIsOn[5]){
      ajacentHexes.push(-1);
    } else {
      ajacentHexes.push(id - 1);
    }

    if(edgesIsOn[6] || edgesIsOn[0]){
      ajacentHexes.push(-1);
    } else {
      if(k <= 12){
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

// Declaration of hex
class Hex {

  constructor(id, color, hidden) {
    this.id = id;
    this.color = color;
    this.hidden = hidden;
    this.element = null;
  }
  
  assignElement(){
    this.element = document.getElementById(this.id);
  }
  
  updateColor(){
    if(this.hidden){
      this.element.style.backgroundColor = "#ffffff";
    } else {
      this.element.style.backgroundColor = this.color;
    }
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let passphrase = prompt("Game passphrase input");

const numberOfPlayersRef = ref(database, "numberOfPlayers+" + passphrase);
const hexesRef = ref(database, "hexes+" + passphrase);


let numberOfPlayers = null;
let playerID = null;

onValue(numberOfPlayersRef, (data) => {
    numberOfPlayers = data.val();
    
    if(playerID == null && numberOfPlayers < 7){
        numberOfPlayers++;
        playerID = numberOfPlayers;

        set(numberOfPlayersRef, numberOfPlayers);
    }
    
}); // onValue numPlayers

onValue(hexesRef, (data) => {
  
  if(isUnloading){
    return;
  }

  if(data.val() == null){
    createNewHexArray();
    set(hexesRef, hexes);
  } else {
    hexes = new Array();
    hexes.push(null);
    displayHexes = new Array();
    displayHexes.push(null);
    for(let i = 1; i < BOARD_SIZE; i++){
      hexes.push(new Hex(data.val()[i].id, data.val()[i].color, false));
      displayHexes.push(new Hex(hexes[i].id, hexes[i].color, (hexes[i].id % 5 == playerID)));
    }
  }

  if(isBoardDivLoaded) updateGameBoard();
  
}); // onValue numPlayers

window.onunload = (event) => {
  isUnloading = true;

  if(playerID != null){
      numberOfPlayers--;
      
      if(0 < numberOfPlayers){
          set(numberOfPlayersRef, numberOfPlayers);
      } else {
        set(hexesRef, null);
        set(numberOfPlayersRef, null);
      }

  } // if
} // onunload

//AUTOMATE THE CREATION OF DIVS IN THE CONTAINER DIVS (CREATE FUNCTION).

window.onload = function(){
  let id = 1;
  for(let k = 1; k < 13; k++){
    let container = document.getElementById("c" + (k));
	container.setAttribute("class","container");
    for(let i = 1; i < 12 + k; i++){
      createHexElement(container, id);
      id++;
    }
  } 

  for(let k = 1; k < 12; k++){
    let container = document.getElementById("c" + (k + 12));
    container.setAttribute("class","container");
    for(let i = 1; i < 24 - k; i++){
      createHexElement(container, id);
      id++;
    }
  }


  isBoardDivLoaded = true;
  updateGameBoard();

  // 397 hexagon elements created
}

function createHexElement(container, id){
  hexDiv = document.createElement("div"); 
  hexDiv.setAttribute("id", id);
  hexDiv.addEventListener("click", changeHexColor);
  hexDiv.addEventListener("click", logHexName);
  container.appendChild(hexDiv);
}

function createNewHexArray(){
  hexes = new Array();
  hexes.push(null);

  let id = 1;

   // k is the the column, i is the row
  for(let k = 1; k <= 23; k++){
    for(let i = 1; i <= 23 - Math.abs(k - 12); i++, id++){ // this for loop increment includes both i++ and id++
      hexes.push(new Hex(id + "", "#009900", false));
    }
  } 

}

const changeHexColor = (e) => {
  hexes[e.target.id].assignElement();
  hexes[e.target.id].color = "#990000";

  ajacentHexStore[e.target.id].forEach(
    function(id2) {
      hexes[id2].assignElement();
      hexes[id2].color = "#990000";
      ajacentHexStore[id2].forEach(
        function(id3) {
          hexes[id3].assignElement();
          hexes[id3].color = "#990000";
        }
      );
    }
  );

  set(hexesRef, hexes);
}

const logHexName = (e) => {
  console.log("ID of Hex clicked: " + e.target.id);
  console.log(ajacentHexStore[e.target.id]);
  
}

function updateGameBoard(){
  for(let i = 1; i < BOARD_SIZE; i++){
    displayHexes[i].assignElement();
    displayHexes[i].updateColor();
  }
}