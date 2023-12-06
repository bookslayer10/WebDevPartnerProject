// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"

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

let r = document.querySelector(':root');
let num;
let numz;

/*function zoom(event) {
  event.preventDefault();

  scale += event.deltaY * -0.001;

  // Restrict scale
  scale = Math.min(Math.max(0.85, scale), 3.3);

  // Apply scale transform
  el.style.transform = `scale(${scale})`; //https://developer.mozilla.org/en-US/play
}

   /*  document.onkeydown = function(event) {
         switch (event.keyCode) {
            case 37:
               left();
            break;
            case 38:
               alert('Up key');
            break;
            case 39:
               right();
            break;
            case 40:
               alert('Down key');
            break;
         }
      };*/


function right (){
	let rs = getComputedStyle(r);
    num = rs.getPropertyValue('--x');
	let num2 = parseInt(num);
	console.log(num2);
	if(num2<500){
	 r.style.setProperty('--x', num2 +10 + "px");
	}else if(num2<=0){
		r.style.setProperty('--p', num2 +10 + "px");
	}
 
}

function left() {
	let rs = getComputedStyle(r);
    num = rs.getPropertyValue('--x');
	let num2 = parseInt(num);
	console.log(num2);
	if(num2>500){
	 r.style.setProperty('--x', num2 -10 + "px");
	}else if(num2<=0){
		r.style.setProperty('--p', num2 +10 + "px");
	}
 
}

//let scale = 1;
//const el = document.getElementById("main");
//el.onwheel = zoom;


/*document.getElementById("main").onwheel = function(){
	wheelTwo()
	
};*/

function wheelTwo(){
	
	
	
	console.log("YO");
	let rs = getComputedStyle(r);
    let hex = rs.getPropertyValue('--s');
	let hex2 = parseInt(hex);
	console.log(hex2);
	if(hex2>19){
	 r.style.setProperty('--s', hex2-2 +"px");
	}
}
//https://www.w3schools.com/css/tryit.asp?filename=trycss3_var_js

window.onload = function(){
  let id = 1;
  for(let k = 1; k < 13; k++){
    let container = document.getElementById("c" + (k));
	container.setAttribute("class","container");
    for(let i = 1; i < 12 + k; i++){
      let hexDiv = document.createElement("div"); 
      hexDiv.setAttribute("id", "hex" + (id));
      container.appendChild(hexDiv);
      id++;
    }
  } 

  for(let k = 1; k < 12; k++){
    let container = document.getElementById("c" + (k + 12));
    container.setAttribute("class","container");
    for(let i = 1; i < 24 - k; i++){
      let hexDiv = document.createElement("div"); 
      hexDiv.setAttribute("id", "hex" + (id));
      container.appendChild(hexDiv);
      id++;
    }
  } 
}

function mouseWheel(event) { 
   
} 
