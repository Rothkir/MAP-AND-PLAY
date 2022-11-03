var canvas = document.getElementById('mycanvas'); //Creates the canvas

var charList = ["THIEF", "PALADIN", "BARTENDER", "MAID", "BEGGAR", "BLACKSMITH", "FORTUNE TELLER", "BUFFON", "KING", "ALCHEMIST", "BARD", "ASSASSIN", "CLEANER", "DRUNKARD"];

var charDropped = 0; //Total number of character in the "Character Sheet"

var selection = '';

var isMouseDown = false;

var dropped = false; //For the buttons (tile selection)

var currentLayer = 0;

var layers = [
	//Bottom
	{
		//Structure is "x-y": ["url of desired image"]
		//EXAMPLE: "1-1": ["./images/whatever.png"]
	}, {}, //Middle
	{} //Top
];

//When the user clicks on the button, changes between hiding and showing the dropdown content. Also hides the previously shoed content if the user clicks on another button
function dropdown(x) {
	if (dropped == true) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		for (let i = 0; i < dropdowns.length; i++) {
			if (dropdowns[i].classList.contains('show')) {
				dropdowns[i].classList.remove('show');
			}
		}
	}
	document.getElementById("Dropdown" + x).classList.add("show");
	dropped = true;
}

//Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		for (let i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
};


//Select tile url from the Tiles options
function chooseTile(value) {
	var src = String(document.getElementById("img" + String(value)).src);
	selection = src;
}

//Removes all character sheets from the "Character sheets" space
function resetCharNum() {
	document.getElementById("charsheet").innerHTML = "";
}

//Creates a character sheet
function drawChar(num, key) {
	var row = document.getElementById(String(key));
	if (row == null) {
		charDropped += 1;
		var table = document.getElementById("charsheet");
		var newrow = table.insertRow();
		var image = newrow.insertCell();
		var stats = newrow.insertCell();

		newrow.id = String(key);

		image.innerHTML = "<img src='./images/char/char" + String(num) + ".png'>";


		stats.innerHTML = "<p><input type='text' id = 'name" + String(key) + "' size = '20' value = '" + String(charList[num]) + "'></input> POS: " + String(key) +"</p><p>STR: <input type='text' id = 'str" + String(key) + "'size='2'></input> CON: <input type='text' id='con" + String(key) + "' size='2'></input> DEX: <input type='text' id = 'dex" + String(key) + "' size='2'></input><br> INT: <input type='text' id = 'int" + String(key) + "' size='2'></input> WIS: <input type='text' id = 'wis" + String(key) + "' size='2'></input> CHA: <input type='text' id = 'cha" + String(key) + "' size='2'></input></p>";
	}
}

//Removes a character sheet (specifically with the location of removed tile) and if no character sheets are left, resets the "Character sheet" space
function removeChar(key) {
	charDropped -= 1;
	if (charDropped == 0) {
		resetCharNum();
	} else {
		var row = document.getElementById(String(key));
		row.remove();
	}

}

//Handler for placing new tiles on the map
function addTile(mouseEvent) {
	if (selection != '') { //If user clicks on the canvas, while having nothing selected, nothing happens and doesn't create bugs...
		var clickedNow = getCoords(event);
		if (clickedNow)
			var key = clickedNow[0] + "-" + clickedNow[1];
		if (mouseEvent.shiftKey) { //Shift is used when user wants to delete a tile
			if (String(layers[currentLayer][key]).includes("char")) {
				console.log(layers[currentLayer])
				removeChar(key);
			}
			delete layers[currentLayer][key];
		} else {
			if (selection.includes("char")) { 
				flag = false;
				for (let i = 0; i < layers.length; i++) {  //Check to see if any other character tiles are placed on the same key but different layer to avoid bug
					if (Object.keys(layers[i]).length !== 0) {
						if (layers[i].hasOwnProperty(key) == true) {
							if (layers[i][key] == selection) {
								flag = true;
							}
						}
					}
				}
				if (flag == false) {
					var numOfChar = parseInt(selection.slice(-6, -4).replace("r", ''));
					drawChar(numOfChar, key);
					layers[currentLayer][key] = [selection];
				}
			} else {
				layers[currentLayer][key] = [selection];
			}
			
		}		
	}
	console.log(layers);
	draw();

}

//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
	isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
	isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
	isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
	if (isMouseDown) {
		addTile(event);
	}
});

//Utility for getting coordinates of mouse click
function getCoords(e) {
	const {
		x, y
	} = e.target.getBoundingClientRect();
	const mouseX = e.clientX - x;
	const mouseY = e.clientY - y;
	return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)]; //Divides by 32, to make round coord to place on canvas
}


//converts data to image to show it in a new browser tab
function exportImage() {
	var dataURL = canvas.toDataURL();
	var image = new Image();
	image.src = dataURL;

	var newWindow = window.open("", "_blank");
	newWindow.document.write(image.outerHTML);
}


function exportCharSheet() {
	var element = document.getElementById("exportchar");
	if (document.getElementById("charsheet").innerHTML != "") {
		html2canvas(element).then(canvas => {
			var imageURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	
			window.location.href = imageURL;
		});
	}
	
	
}

//Resets diffrent variables
function clearCanvas() {
	layers = [{}, {}, {}];
	charDropped = 0;
	resetCharNum(); //Removes all characters
	draw(); //For resseting the canvas and actually showing the user
}

function setLayer(newLayer) {
	//Updates the layer
	currentLayer = newLayer;

	//Update the buttons to show updated layer
	var oldActiveLayer = document.querySelector(".layer.active");
	if (oldActiveLayer) {
		oldActiveLayer.classList.remove("active"); //Removes the previous active layer
	}
	document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active"); //Adds a new class to the layer (active)
}

//Change the active size of Canvas
function setSize() {
	clearCanvas(); //Clears the canvas so there is no bug
	var width = parseInt(document.getElementById("canvasX").value); //Gets value of both dropdown lists 
	var height = parseInt(document.getElementById("canvasY").value);
	canvas.width = width;
	canvas.height = height;
}

//Draws on the canvas
function draw() {
	var ctx = canvas.getContext("2d"); //Gets the context
	var tilesetImage = new Image(); //Creates new Image (canvases work with images)

	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears area of rectangle and sets it to transparent for good measure

	for (let i = 0; i < layers.length; i++) { //Goes through all layers
		Object.keys(layers[i]).forEach((key) => {
			var positionX = Number(key.split("-")[0]); //Gets x,y coords (Using the key)
			var positionY = Number(key.split("-")[1]);
			tilesetImage.src = layers[i][String(key)][0]; //Gets source of image
			ctx.drawImage(tilesetImage, positionX * 32, positionY * 32, 32, 32); //PositionX and positionY are multiplied by 32 to put them accurately on the board
		});
	}

}

//Initializes the app
window.onload = function() {
	selection = '';
	resetCharNum();
	draw();
	setLayer(0);
};