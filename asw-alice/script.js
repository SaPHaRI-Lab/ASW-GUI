var frontItems = [];
var backItems = [];
var currView = "front";
function switchView() {
    const front = document.getElementById('jacket-front');
    const back = document.getElementById('jacket-back');
    if (front.style.display != 'none') {
        for (let i = 0; i < frontItems.length; i++) {
            frontItems[i].style.display = 'none';
        }
        for (let i = 0; i < backItems.length; i++) {
            backItems[i].style.display = 'block';
        }
        front.style.display = 'none';
        back.style.display = 'block';
        currView = "back";
    } else {
        for (let i = 0; i < frontItems.length; i++) {
            frontItems[i].style.display = 'block';
        }
        for (let i = 0; i < backItems.length; i++) {
            backItems[i].style.display = 'none';
        }
        front.style.display = 'block';
        back.style.display = 'none';
        currView = "front";
    }
}

const options = document.querySelectorAll('.option');
function dragOver(e) {
    e.preventDefault();
}
function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}   
function drop(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    const item = document.getElementById(data);
    const clonedItem = item.cloneNode(true);
    clonedItem.classList.add('dropped-item');
    clonedItem.style.zIndex = '10';
    const xVal = e.clientX-clonedItem.offsetWidth/2;
    const yVal = e.clientY-clonedItem.offsetHeight/2;
    clonedItem.style.left = `${xVal}px`;
    clonedItem.style.top = `${yVal}px`;
    document.body.appendChild(clonedItem);
    if (currView == "front") {
        frontItems.push(clonedItem);
    } else if (currView == "back") {
        backItems.push(clonedItem);
    }
    if (clonedItem.id == document.getElementById("fur-patch").id) {
        document.getElementById("fur-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("light-ind").id) {
        document.getElementById("lightind-movement").style.display = 'block';
        document.getElementById("fur-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("light-strip").id) {
        document.getElementById("lights-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("fur-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("display").id) {
        document.getElementById("display-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("fur-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("water-squirter").id) {
        document.getElementById("water-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("fur-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("noise").id) {
        document.getElementById("noise-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("fur-movement").style.display = 'none';
        document.getElementById("other-movement").style.display = 'none';
    } else if (clonedItem.id == document.getElementById("other").id) {
        document.getElementById("other-movement").style.display = 'block';
        document.getElementById("lightind-movement").style.display = 'none';
        document.getElementById("lights-movement").style.display = 'none';
        document.getElementById("display-movement").style.display = 'none'
        document.getElementById("water-movement").style.display = 'none';
        document.getElementById("noise-movement").style.display = 'none';
        document.getElementById("fur-movement").style.display = 'none';
    } 
}

var slider = document.getElementById("speed-range");
var output = document.getElementById("value");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

//test
function saveFile() {
    const participantNum = document.getElementById('participant').value;
    var csvFile = "data:text/csv;charset=utf-8,";
    csvFile += "Participant,View,Item ID,X Position,Y Position\n";
    for (let i = 0; i < frontItems.length; i++) {
        csvFile += `${participantNum},jacket-front,${frontItems[i].id},${frontItems[i].x},${frontItems[i].y}\n`;
    }
    const encodedUri = encodeURI(csvFile);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${participantNum}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/*const colorWheel = document.getElementById('color-select');
const output = document.getElementById('output');
colorWheel.addEventListener('click', function(event) {
    output.style.backgroundColor = white;
});*/