// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"
let hexDiv; //variable to create hexs

// hex array
let hexes = new Array();
hexes.push(null);
let isBoardLoaded = false;

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

  constructor(id, color) {
    this.id = id;
    this.color = color;
    this.element = null;
  }
  
  assignElement(){
    this.element = document.getElementById(this.id);
  }
  
  updateColor(){
    console.log("updatecolor" + this.color)
    this.element.style.backgroundColor = this.color;
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
  
  if(data.val() == null){
    createHexArray();
    set(hexesRef, hexes);
    console.log("createarray:");
    console.log(hexes)
  } else {
    hexes = new Array();
    hexes.push("test");   
    for(let i = 1; i < data.val().length; i++){
      hexes.push(new Hex(data.val()[i].id, data.val()[i].color));
    }
    console.log("getarray");
    console.log(hexes);
  }

  if(isBoardLoaded) updateGameBoard();
  
}); // onValue numPlayers

window.onunload = (event) => {
    if(playerID != null){
        numberOfPlayers--;
        
        if(0 < numberOfPlayers){
            set(numberOfPlayersRef, numberOfPlayers);
        } else {
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

  console.log("window.onload finished")

  isBoardLoaded = true;
  updateGameBoard();

  // 397 hexagon elements created
}

function createHexElement(container, id){
  hexDiv = document.createElement("div"); 
  hexDiv.setAttribute("id", id);
  hexDiv.addEventListener("click", changeHexColor);
  container.appendChild(hexDiv);
}

function createHexArray(){
  console.log("create hex array");
  hexes = new Array();
  hexes.push(null);
  for(let i = 1; i < 398; i++){ // 397 elements from 1 to 397 inclusive
    hexes.push(new Hex(i + "", "#009900"));
  }

  console.log(hexes);
}

const changeHexColor = (e) => {
  console.log(hexes);
  console.log(hexes[e.target.id]);

  hexes[e.target.id].assignElement();
  console.log(hexes[e.target.id].element)

  hexes[e.target.id].color = "#990000";

  set(hexesRef, hexes);
}

function updateGameBoard(){
  console.log("update");
  console.log(hexes.length);
  console.log(hexes)
  for(let i = 1; i < hexes.length; i++){
    hexes[i].assignElement();
    console.log(hexes[i]);
    hexes[i].updateColor();
  }
}