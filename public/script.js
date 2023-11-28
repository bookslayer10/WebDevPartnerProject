// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"
let id = 1; // id number for the idividual hexagons
let hexDiv; //variable to create hexs
/////////////////////////////////
/// GLOBAL VARS
/////////////////////////////////

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

let passphrase = prompt("Game passphrase input");

const numberOfPlayersRef = ref(database, "numberOfPlayers+" + passphrase);

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
  for(let k = 1; k < 13; k++){
    let container = document.getElementById("c" + (k));
	  container.setAttribute("class","container");
    for(let i = 1; i < 12 + k; i++){
      hexDiv = document.createElement("div"); 
      hexDiv.setAttribute("id", "hex" + (id));
      hexDiv.addEventListener("click", changeHexColour);
      container.appendChild(hexDiv);
      id++;
    }
  } 

  for(let k = 1; k < 12; k++){
    let container = document.getElementById("c" + (k + 12));
    container.setAttribute("class","container");
    for(let i = 1; i < 24 - k; i++){
      hexDiv = document.createElement("div"); 
      hexDiv.setAttribute("id", "hex" + (id));
      hexDiv.addEventListener("click", changeHexColour);
      container.appendChild(hexDiv);
      id++;
    }
  } 
}

const changeHexColour = (e) => {
 e.target.style.backgroundColor = "#990000";
}
