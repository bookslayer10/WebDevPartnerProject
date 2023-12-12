// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js"

const BOARD_SIZE = 398;
let passphrase;
let pass1 = document.getElementById("passphrase");
let pass2 = document.getElementById("passphrase2");
let hexDiv; //variable to create hexs
let hexImg; //variable for the images within the hexes
let isUnloading = false;
let numPlayers2 = 0;
// hex array
let hexes = new Array();
hexes.push(null);

let displayHexes = new Array();
displayHexes.push(null);

let isBoardDivLoaded = false;

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
    this.ajacentHexes = this.getAjacentHexes();
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

  getAjacentHexes(){
    let array = new Array(); // ajacentHexes is ordered as the 30, 90, 150, 210, 270, 330
    



    return array;
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



document.getElementById("passbutton").addEventListener("click", passFunction);

function passFunction(){
	if(pass1.value != "" && pass2.value != ""){
		passphrase = pass1.value + pass2.value;
		console.log(passphrase + "ship");
		document.getElementById("message").style.display = "none";
		document.getElementById("lightbox").style.display = "none";
		document.getElementById("pass1").innerHTML = "Lobby: " + pass1.value;
		document.getElementById("pass2").innerHTML = "Passphrase: " + pass2.value;
		document.getElementById("numplay").style.display = "initial";
		document.getElementById("pass1").style.display = "initial";
		document.getElementById("pass2").style.display = "initial";
	}else if(pass1.value != "" && pass2.value == ""){
		
	document.getElementById("error").style.display = "initial";
	document.getElementById("error").innerHTML = "Dude, put in a passphrase";
		
	}else if(pass1.value == "" && pass2.value != ""){
		
	document.getElementById("error").style.display = "initial";
	document.getElementById("error").innerHTML = "Dude, put in a lobby name";
	
	}else{
		console.log("no");
		document.getElementById("error").style.display = "initial";
		document.getElementById("error").innerHTML = "WTF";
	}
}

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
	document.getElementById("numplay").innerHTML = "Number of Players: " + numberOfPlayers;
	console.log(numberOfPlayers);
    
}); // onValue numPlayers


onValue(hexesRef, (data) => {
  
  if(isUnloading){
    return;
  }

  if(data.val() == null){
    createHexArray();
    console.log("createarray");
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
    console.log("arrayRecieved");

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
          set(numberOfPlayersRef, null);
          set(hexesRef, null);
      }

  } // if
} // onunload

//AUTOMATE THE CREATION OF DIVS IN THE CONTAINER DIVS (CREATE FUNCTION).

window.onload = function(){
  let id = 1;
	console.log(numberOfPlayers);
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

  hexImg = document.createElement("img");
  hexImg.setAttribute("src", "/images/testImage2.svg");

  container.appendChild(hexDiv);
  hexDiv.appendChild(hexImg);
}

function createHexArray(){
  hexes = new Array();
  hexes.push(null);
  displayHexes = new Array();
  displayHexes.push(null);

  for(let i = 1; i < BOARD_SIZE; i++){ // 397 elements from 1 to 397 inclusive
    hexes.push(new Hex(i + "", "#009900", false));

    displayHexes.push(new Hex(hexes[i].id, hexes[i].color, false));

  }

}

const changeHexColor = (e) => {

  console.log("changecolor");

  hexes[e.target.id].assignElement();
  hexes[e.target.id].color = "#990000";

  set(hexesRef, hexes);
}

const logHexName = (e) => {
  console.log("ID of Hex clicked: " + e.target.id);
}

function updateGameBoard(){
  console.log("updateGameBoard");
  for(let i = 1; i < BOARD_SIZE; i++){
    displayHexes[i].assignElement();
    displayHexes[i].updateColor();
  }
}



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
