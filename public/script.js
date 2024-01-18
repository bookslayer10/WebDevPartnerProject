@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Stalinist+One&display=swap');
/*https://pixabay.com/illustrations/camouflage-military-texture-1541188/*/

body{
	overflow:hidden;
}


#r1{
	z-index:10;
	position:fixed;
	left:0;
	bottom:0;
	background-image: url('/images/camo.jpg');
	background-size: cover;
	width:100vw;
	height:22vh;
	border-top:thick solid white;
	
}

#r2{
	z-index:10;
	background-image: url('/images/camo.jpg');
	background-size: cover;
	position:fixed;
	left:0;
	top:0;
	width:100vw;
	height:25vh;
	border-bottom:thick solid white;
}

#r3{
	z-index:11;
	background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url('/images/camo.jpg');
	background-size: cover;
	position:fixed;
	left:0;
	top:0;
	width:9vw;
	height:100vh;
	border-right:thick solid white;
}

#r4{
	z-index:11;
	background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url('/images/camo.jpg');
	background-size: cover;
	position:fixed;
	right:0;
	top:0;
	width:9vw;
	height:100vh;
	border-left:thick solid white;
}

#r5{
	z-index:13;
	position:fixed;
	left:0;
	bottom:0;
	background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url('/images/camo.jpg');
	background-size: cover;
	width:100vw;
	height:22vh;
}


#r6{
	z-index:13;
	background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/camo.jpg');/*https://www.youtube.com/watch?v=a2UnYs9AA_M*/
	background-size: cover;
	position:fixed;
	left:0;
	top:0;
	width:100vw;
	height:25vh;
}


body{
	background-color: black;
}



#main {
	display: grid;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	--scale: 1;
	--s: calc(var(--scale) * 40px);
	/* size  */
	--m: calc(var(--scale) * 1px);
	/* margin */
	--f: calc(var(--s) * 1.732 + 4 * var(--m) - 1px);
	user-select: none;

	width:calc(var(--scale) * 1000px);
}

.container {
	font-size: 0;
	/* disable white space between inline block element */
	margin-left: auto;
	margin-right: auto;
}

.container div {
	width: var(--s);
	margin: var(--m);
	height: calc(var(--s) * 1.1547);
	display: inline-block;
	font-size: initial;
	clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
	margin-bottom: calc(var(--m) - var(--s) * 0.2885);
	background-image: url(images/fogTile.svg);
	background-size: 100% 100%;
}


/*https://css-tricks.com/hexagons-and-beyond-flexible-responsive-grid-patterns-sans-media-queries/*/

img {
	position: absolute;
	pointer-events: none;
	width: var(--s);
	height: var(--s);
}

.hidden {
	display: none;
}

#passbutton, #ok{
	width:215px;
	height:50px;
	padding:5px;
    font-size:20px;
	background-color:#222222;
	border:2px solid white;
	color:white;
	font-family:'Black Ops One', cursive;
}

#passbutton:hover{
	background-color:white;
	border:2px solid #222222;
	color:black;
}

#ok:hover{
	background-color:white;
	border:2px solid #222222;
	color:black;
}


#error {
	font-size: 18px;
	color: red;
	display: none;
	font-weight: 800;
}

h1{
	font-size:25px;
	color:white;
	font-family: 'Stalinist One', cursive;
}

input {
	width: 200px;
	height: 45px;
	padding-left: 5px;
	padding-right: 5px;
	font-size: 20px;
	text-align: center;
}

#lightbox {
  z-index:100;
  position:fixed;
  top:0px;
  left:0px;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,1);

}

#message {
    width:70%;
	background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),url('/images/camo.jpg');
    background-color:#777777;
	border:3px solid white;
    text-align:center;
    font-family: 'PT Mono', monospace;
    
    /* Center the message in the lightbox */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-left:30px;
	padding-right:30px;
	padding-top:100px;
	padding-bottom:100px;
	font-size:14px;
}




#infantinfo{
	grid-area:soldier;
}

#tankinfo{
	grid-area:tank;
}

#artinfo{
	grid-area:artillery;
}

#armydiv{
	z-index:101;
	position:fixed;
    left: 0;
    right: 0;
	bottom:5vh;
	display:grid;
	grid-template-areas: 
	'soldier tank artillery';
}


#turn{
	display:none;
	padding:5px;
	padding-top:20px;
	padding-bottom:20px;
	text-align:center;
    font-family:'Stalinist One', cursive;
    border:2px solid white;
	background-color:#222222;
	color:white;
	font-size:2.5vh;
	grid-area:start;
	
}

#numplay {
	grid-area: three;
}

#pass2 {
	grid-area: two;
}

#pass1{
	grid-area:one;
}



#movebuttondiv{
	position:absolute;
	bottom:3vh;
	z-index:101;
}


#up11{
	position:fixed;
	z-index:300;
	bottom:10%;
	right:26%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#right{
	position:fixed;
	z-index:300;
	rotate: 90deg;
	bottom:6.5%;
	right:8%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#down{
	position:fixed;
	z-index:300;
	rotate: 180deg;
	bottom:3%;
	right:26%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#left{
	position:fixed;
	z-index:300;
	rotate: 270deg;
	bottom:6.5%;
	right:44%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#plus{
	position:fixed;
	z-index:300;
	bottom:10%;
	left:15%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#minus{
	position:fixed;
	z-index:300;
	rotate: 180deg;
	bottom:3%;
	left:15%;
	display:none;
	pointer-events:initial;
	width:60px;
	height:60px;
}

#text1,#text2{
	font-size:20px;
	color:white;
	font-family:'Black Ops One', cursive;
}

#ok{
	display:none;
}

#info1{
	color:white;
	font-weight:500;
	display:none;
}

#info2{
	color:white;
	font-weight:500;
	display:none;
}

#totaldiv{
	z-index:90;
	display:grid;
	grid-template-areas:
	'info info'
	'start fire'
	'turn fire';
	position:fixed;
	top:3vh;
	left:8%;
	width:84%;
	
}

#startbutton{
	padding:5px;
    font-family:'Stalinist One', cursive;
    border:2px solid white;
	background-color:#222222;
	color:white;
	font-size:2.5vh;
	grid-area:start;
	padding-top:20px;
	padding-bottom:20px;
}

#startbutton:hover{
	background-color:white;
	border:2px solid #222222;
	color:black;
}


#pass1,#pass2,#numplay{
	font-family:'Black Ops One', cursive;
	z-index:101;
	color:white;
	font-size:2.1vh;
	display: none;
}

#infodiv{
	column-gap:1rem;
	padding:15px;
	padding-left:15%;
	border: 2px solid white;
	z-index:99;
	display:grid;
	grid-template-areas: 
	'one'
	'two'
	'three';
	grid-area:info;
}

#controldiv{
	padding:15px;
	z-index:101;
	position:fixed;
	bottom:2%;
	width:75%;
	height:120px;
	left:10.4%;
}

@media only screen and (min-width: 460px) {
	
	#message{
		padding-left:30px;
		padding-right:30px;
	}
	
	#plus,#minus{
		left:20%;
	}
	
	#right{
		right:13%;
	}
	
	#left{
		right:43%;
	}
	
	#up11,#down{
		right:28%;
	}

}

@media only screen and (min-width: 600px) {
	
	#r1,#r5{
		height:22vh;
	}
	
	#r3{
		width:11vw;
	}
	
	#r4{
		width:11vw;
	}
	
	#up11,#right,#left,#down,#plus,#minus{
		width:70px;
		height:70px;
	}
	
	#up11,#plus{
		bottom:12%;
	}
	
	#right,#left{
		bottom:7.5%;
	}


}

@media only screen and (min-width: 700px) {
	
	#plus,#minus{
		left:20%;
	}
	
	#right{
		right:16%;
	}
	
	#left{
		right:46%;
	}
	
	#up11,#down{
		right:31%;
	}
	
		
	#infodiv{
	grid-template-areas: 
	'one two three';
	padding-left:7%;
}

#totaldiv{
	top:6vh;
}


	

}




@media only screen and (min-width: 800px) {
	
	
	#totaldiv{
	grid-template-areas:
	'info ifo'
	'start turn fire';
	left:10.5%;
	width:90%;	
}

#turn{
	padding-top:33px;
	padding-right:3.6rem;
	padding-left:3.6rem;
}

		#right{
		right:19%;
	}
	
	#left{
		right:43%;
	}


	
	#infodiv{
	grid-template-areas: 
	'one'
	'two'
	'three';
	padding-left:15%;
}	

#message {
    width:50%;
}

#passbutton, #ok{
	font-size:25px;
}

h1{
	font-size:30px;
}

#text{
	font-size:25px;
}

#error{
	font-size:23px;
}

	#plus,#minus{
		left:25%;
	}

}

@media only screen and (min-width: 917px) {

    #totaldiv{
	width:91%;

}

@media only screen and (min-width: 917px) {

    #totaldiv{
	width:92%;
	}
	
			#right{
		right:21%;
	}
	
	#left{
		right:41%;
	}

}

@media only screen and (min-width: 1000px) {

	#passbutton, #ok{
		margin-top:10px;
		padding:9px;
	}

    #totaldiv{
	width:93%;
	}
	
	#startbutton{
		font-size:30px;
	}
	
	#infodiv{
		font-size:35px;
	}
	
		 #controldiv{
		 display:none;
	 }

}

@media only screen and (min-width: 1080px) {

	 
	     #totaldiv{
	width:95%;
	}
}


@media only screen and (min-width: 1150px) {
	 
	     #totaldiv{
	width:97%;
	}
}

@media only screen and (min-width: 1250px) {
	 
	 #totaldiv{
	width:99%;
	}
}




@media only screen and (min-width: 1400px) {
	#message {
		width:30%;
	}

	     #totaldiv{
	width:102%;
	}

}



@media only screen and (min-width: 1600px) {

	     #totaldiv{
	width:105%;
	}

}

#fired:hover{
	background-color:white;
	border:2px solid #222222;
	color:black;
}


#fired{
	display:none;
	grid-area:fire;
	padding:5px;
    font-family:'Stalinist One', cursive;
    border:2px solid white;
	background-color:#222222;
	color:white;
	font-size:2.5vh;
	grid-area:start;
	padding-top:20px;
	padding-bottom:20px;
}
