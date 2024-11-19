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
}

function selectItem(item) {
    document.querySelectorAll('.dropped-item').forEach(item => item.classList.remove('selected-item'));
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
    slider.value = 5;
    document.getElementById("value").innerHTML = 5;
}

document.addEventListener('DOMContentLoaded', function() {
    //color selecting functionality
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('click', () => {
            squares.forEach(sq => sq.classList.remove('selected-col'));
            square.classList.add('selected-col');
            const color = square.id;
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            const other = document.querySelector('.other');
            if (selectedItem) {
                if (selectedItem == other) {
                    other.style.borderBottomColor = color;
                    other.style.backgroundColor = transparent;
                }
                selectedItem.style.backgroundColor = color;
            }
        });
    });
    //slider functionality
    var slider = document.getElementById("speed-range");
    var output = document.getElementById("value");
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = this.value;
    }
    //saving radio button selection
    document.querySelectorAll('input[name="item-movement"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            if (selectedItem) {
                saveItemSelections(selectedItem.id, this.value, document.getElementById("speed-range").value);
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

//delete selected item
function deleteItem() {
    const selectedItem = document.querySelector('.dropped-item.selected-item');
    if (selectedItem) {
        selectedItem.remove();
    }
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