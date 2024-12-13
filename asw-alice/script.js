//add items to front or back & switch views
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

//drag and drop functionality
function dragOver(e) {
    e.preventDefault();
}
function drag(e) {
    //e.dataTransfer.setData("text", e.target.id);
    e.dataTransfer.setData("text", document.getElementById(e.target.id).id);
}
function drop(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    const item = document.getElementById(data);
    const dropArea = document.getElementById('jacketbox');
    const alreadyDroppedItem = dropArea.querySelector(`#${data}`);
    if (alreadyDroppedItem) {
        positionItem(alreadyDroppedItem, e, dropArea);
    } else {
        const clonedItem = item.cloneNode(true);
        const uniqueId = `${data}-${Date.now()}`;
        clonedItem.id = uniqueId;
        clonedItem.className = item.className + ' dropped-item';
        clonedItem.style.cssText = item.style.cssText;
        positionItem(clonedItem, e, dropArea);
        dropArea.appendChild(clonedItem);
        clonedItem.addEventListener('click', function() {
            selectItem(clonedItem);
        });
        if (currView == "front") {
            frontItems.push(clonedItem);
        } else if (currView == "back") {
            backItems.push(clonedItem);
        }
        selectItem(clonedItem);
    }
}

function positionItem(item, e, area) {
    const rect = area.getBoundingClientRect();
    const offsetX = -345;
    const offsetY = -30;
    const xVal = e.clientX-rect.left-offsetX;
    const yVal = e.clientY-rect.top-offsetY;
    item.style.position = 'absolute';
    item.style.left = `${xVal}px`;
    item.style.top = `${yVal}px`;
    item.style.zIndex = '10';
    if (item == '.light-strip') {
        item.style.left='10px';
    }
    item.x = xVal;
    item.y = yVal;
}

function selectItem(item) {
    document.querySelectorAll('.dropped-item').forEach(item => {
        item.classList.remove('selected-item');
        item.querySelectorAll('.circle, .rectangle').forEach(part => part.classList.remove('selected-item'));
    });
    item.classList.add('selected-item');
    item.querySelectorAll('.rectangle, .circle').forEach(part => part.classList.add('selected-item'));
    document.querySelectorAll('.movement > div').forEach(div => {
        div.style.display = 'none';
    });
    const baseId = item.id.split('-').slice(0, -1).join('-');
    const movementElement = document.getElementById(`${baseId}-movement`);
    if (movementElement) {
        movementElement.style.display = 'block';
    }
    loadItemSelections(item.id);
}

//saving and loading item selections/customizations
var itemSelections = {
    front: {},
    back: {}
};
function saveItemSelections(itemID, radioSelection, sliderValue) {
    itemSelections[currView][itemID] = {radioSelection, sliderValue};
}
function loadItemSelections(itemID) {
    const selection = itemSelections[currView][itemID];
    if (selection) {
        const radio = document.querySelector(`input[name="item-movement"][value="${selection.radioSelection}"]`);
        if (radio) {
            radio.checked = true;
        }
        const slider = document.getElementById("speed-range");
        if (slider) {
            slider.value = selection.sliderValue;
            document.getElementById("value").innerHTML = selection.sliderValue;
        }
    } else {
        resetRadioButtons();
        resetSlider();
    }
}
function resetRadioButtons() {
    document.querySelectorAll('input[name="item-movement"]').forEach(input => {
        input.checked = false;
    });
}
function resetSlider() {
    const slider = document.getElementById("speed-range");
    slider.value = 3;
    document.getElementById("value").innerHTML = 3;
}

let flashInterval = null;
const flashingItems = new Set();
let currSpeed = 300;
let selectedColor = null;
const defaultColor = 'grey';

document.addEventListener('DOMContentLoaded', function() {
    //color selecting functionality
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('click', () => {
            squares.forEach(sq => sq.classList.remove('selected-col'));
            square.classList.add('selected-col');
            selectedColor = square.id;
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            const other = document.querySelector('.other');
            if (selectedItem) {
                if (selectedItem == other) {
                    other.style.borderBottomColor = selectedColor;
                    other.style.backgroundColor = transparent;
                }
                selectedItem.style.backgroundColor = selectedColor;
                selectedItem.querySelectorAll('.circle, .rectangle').forEach(part => {
                    part.style.backgroundColor = selectedColor;
                });
                if (flashingItems.has(selectedItem)) {
                    selectedItem.setAttribute('data-flashing-color', selectedColor);
                }
                selectedItem.color = selectedColor;
            }
        });
    });
    //slider functionality
    var slider = document.getElementById("speed-range");
    var output = document.getElementById("value");
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = this.value;
        currSpeed = this.value * 10;
    }
    //saving radio button selection
    document.querySelectorAll('input[name="item-movement"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            if (selectedItem) {
                saveItemSelections(selectedItem.id, this.value, document.getElementById("speed-range").value);
                if (radio.value.includes('Light on')) {
                    stopFlash(selectedItem);
                } else if (radio.value.includes('Flash')) {
                    currSpeed = 200;
                    flashAnimation(selectedItem);
                } else if (radio.value.includes('Trickle up')) {
                    currSpeed = 300;
                    flashAnimation(selectedItem, 'trickle-up');
                } else if (radio.value.includes('Trickle down')) {
                    currSpeed = 300;
                    flashAnimation(selectedItem, 'trickle-down');
                } else if (radio.value.includes('Random fl')) {
                    currSpeed = 200;
                    flashAnimation(selectedItem, 'random-fl');
                }
                selectedItem.radioSelection = this.value;
            }
        });
    });
    //saving slider selection
    document.getElementById("speed-range").addEventListener('input', function() {
        const selectedItem = document.querySelector('.dropped-item.selected-item');
        let radioValue;
        if (selectedItem) {
            const selectedRadio = document.querySelector('input[name="item-movement"]:checked');
            if (selectedRadio) {
                radioValue = selectedRadio.value;
            } else {
                radioValue = null;
            }
            saveItemSelections(selectedItem.id, radioValue, this.value);
        }
    });
    //delete item
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteItem();
        }
    });
});

function flashAnimation(item, flashPattern) {
    flashingItems.add(item);
    let lights = Array.from(item.querySelectorAll('.circle'));
    if (!selectedColor) {
        item.setAttribute('data-flashing-color', defaultColor);
    } else {
        item.setAttribute('data-flashing-color', selectedColor);
    }
    if (flashPattern == 'trickle-up' || flashPattern == 'trickle-down') {
        if (flashInterval) {
            clearInterval(flashInterval);
        }
        if (flashPattern == 'trickle-up') {
            lights.reverse();
        }
        let currLight = 0; //current light that's flashing
        flashInterval = setInterval(() => {
            for (let i = 0; i < lights.length; i++) {
                if (i == currLight) {
                    lights[i].style.backgroundColor = selectedColor;
                } else {
                    lights[i].style.backgroundColor = '#bbb';
                }
            }
            currLight = (currLight+1) % lights.length;
        }, currSpeed);
    } else if (flashPattern == 'random-fl') {
        if (flashInterval) {
            clearInterval(flashInterval);
        }
        flashInterval = setInterval(() => {
            for (let i = 0; i < lights.length; i++) {
                const randomFlash = Math.random();
                if (randomFlash > 0.5) {
                    lights[i].style.backgroundColor = selectedColor;
                } else {
                    lights[i].style.backgroundColor = '#bbb';
                }
            }
        }, currSpeed);
    } else { //default flash
        if (flashInterval) {
            clearInterval(flashInterval);
        }
        flashInterval = setInterval(() => {
            flashingItems.forEach(flashingItem => {
                let flashingColor = flashingItem.getAttribute('data-flashing-color');
                let currColor = null;
                if (!flashingColor) {
                    flashingColor = defaultColor;
                }
                if (flashingItem.classList.contains('light-ind')) {
                    currColor = flashingItem.style.backgroundColor;
                    if (currColor == flashingColor) {
                        flashingItem.style.backgroundColor = '#bbb';
                    } else {
                        flashingItem.style.backgroundColor = flashingColor;
                    }
                } else {
                    flashingItem.querySelectorAll('.rectangle, .circle').forEach(part => {
                        currColor = part.style.backgroundColor;
                        if (currColor == flashingColor) {
                            part.style.backgroundColor = '#bbb';
                        } else {
                            part.style.backgroundColor = flashingColor;
                        }
                    });
                }
            });
        }, currSpeed);
    }
}

//light on & no flash option
function stopFlash(item) {
    flashingItems.delete(item);
    if (flashingItems.size == 0 && flashInterval) {
        clearInterval(flashInterval);
        flashInterval = null;
    }
    if (item.classList.contains('light-ind')) {
        if (item.getAttribute('data-flashing-color')) {
            item.style.backgroundColor = item.getAttribute('data-flashing-color');
        }
        item.style.backgroundColor = selectedColor;
    } else {
        item.querySelectorAll('.rectangle, .circle').forEach(part => {
            if (item.getAttribute('data-flashing-color')) {
                part.style.backgroundColor = item.getAttribute('data-flashing-color');
            }
            part.style.backgroundColor = selectedColor;
        });
    }
}

//duplicate selected item
function duplicate() {
    const selectedItem = document.querySelector('.dropped-item.selected-item');
    if (selectedItem) {
        const clonedItem = selectedItem.cloneNode(true);
        clonedItem.id = `${selectedItem.id}-copy-${Date.now()}`;
        clonedItem.className = selectedItem.className + ' dropped-item';
        clonedItem.style.cssText = selectedItem.style.cssText;
        const rect = selectedItem.getBoundingClientRect();
        clonedItem.style.position = 'absolute';
        clonedItem.style.left = `${rect.left+10}px`;
        clonedItem.style.top = `${rect.top+10}px`;
        clonedItem.style.zIndex = '10';
        const dropArea = document.getElementById('jacketbox');
        dropArea.appendChild(clonedItem);
        clonedItem.addEventListener('click', function() {
            selectItem(clonedItem);
        });
        clonedItem.setAttribute('data-flashing-color', selectedItem.getAttribute('data-flashing-color'));
        if (flashingItems.has(selectedItem)) {
            flashingItems.add(clonedItem);
        }
    }
}

function undo() {
    //WIP: testing in other file
}

function redo() {
    //WIP: testing in other file
}

//delete selected item
function deleteItem() {
    const selectedItem = document.querySelector('.dropped-item.selected-item');
    if (selectedItem) {
        selectedItem.remove();
    }
}

//test --> also going to change this
/*function saveFile() {
    const participantNum = document.getElementById('participant').value;
    const videoNum = document.getElementById('videoNum').value;
    var csvFile = "data:text/csv;charset=utf-8,";
    csvFile += "Jacket Side,Item ID,Customization,Color,X Position,Y Position\n";
    for (let i = 0; i < frontItems.length; i++) { //items on jacket front
        csvFile += `front,${frontItems[i].id},${frontItems[i].radioSelection},${frontItems[i].color},${frontItems[i].x},${frontItems[i].y}\n`;
    }
    for (let i = 0; i < backItems.length; i++) { //items on jacket back
        csvFile += `back,${backItems[i].id},${backItems[i].radioSelection},${backItems[i].color},${backItems[i].x},${backItems[i].y}\n`;
    }
    const encodedUri = encodeURI(csvFile);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Participant_${participantNum}_Video_${videoNum}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}*/