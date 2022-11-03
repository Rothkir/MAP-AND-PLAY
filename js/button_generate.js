var acc = [];
var lengthAcc1 = 10;
for (let i = 0; i < lengthAcc1; i++) {
   acc.push("./images/acc/acc" + i + ".png")
}

var floor = [];
var lengthFloor1 = 14
for (let i = 0; i < lengthFloor1; i++) {
   floor.push("./images/floor/floor" + i + ".png")
}

var hole = [];
var lengthHole1 = 14
for (let i = 0; i < lengthHole1; i++) {
   hole.push("./images/hole/hole" + i + ".png")
}

var wall = [];
var lengthWall1 = 11
for (let i = 0; i < lengthWall1; i++) {
   wall.push("./images/wall/wall" + i + ".png")
}

var char = [];
var lengthChar1 = 14
for (let i = 0; i < lengthChar1; i++) {
   char.push("./images/char/char" + i + ".png")
}

var y = 0

var names_string = ["Floor", "Wall", "Holes", "Acc", "Char"]

var names_var = [floor, wall, hole, acc, char]

function createButton(x) {
   document.write("<td id='centerbutton' class='vertalignt'><button onclick='dropdown(" + x + ")' class='dropbtn'>" + names_string[x] + "</button><div id='Dropdown" + x + "' class='dropdown-content'>")
   for (let i = 0; i < names_var[x].length; i++) {
      document.write("<button onclick='chooseTile(" + y + ")'><img id = 'img" + y + "' src = '" + names_var[x][i] + "'></button>")
      y++
   }
   document.write("</td></div><br><br>")
}

for (let i = 0; i < names_string.length; i++) {
   createButton(i);
}