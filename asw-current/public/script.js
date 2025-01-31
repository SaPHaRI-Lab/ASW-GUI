//add items to front or back & switch views
var frontItems = [];
var backItems = [];
var currView = "front";
function switchView() {
    const front = document.getElementById('jacket-front');
    const back = document.getElementById('jacket-back');
    const jacketCanvas = document.getElementById('jacketCanvas');
    const jacketCtx = jacketCanvas.getContext('2d');
    if (currView == "front") {//front.style.display != 'none') {
        for (let i = 0; i < frontItems.length; i++) {
            frontItems[i].style.display = 'none';
        }
        for (let i = 0; i < backItems.length; i++) {
            backItems[i].style.display = 'block';
        }
        //front.style.display = 'none';
        //back.style.display = 'block';
        jacketCtx.clearRect(0,0,jacketCanvas.width,jacketCanvas.height);
        jacketCtx.drawImage(back,0,0,jacketCanvas.width,jacketCanvas.height);
        currView = "back";
        document.getElementById('front-view').style.display = 'block';
        document.getElementById('back-view').style.display = 'none';
    } else {
        for (let i = 0; i < frontItems.length; i++) {
            frontItems[i].style.display = 'block';
        }
        for (let i = 0; i < backItems.length; i++) {
            backItems[i].style.display = 'none';
        }
        //front.style.display = 'block';
        //back.style.display = 'none';
        jacketCtx.clearRect(0,0,jacketCanvas.width,jacketCanvas.height);
        jacketCtx.drawImage(front,0,0,jacketCanvas.width,jacketCanvas.height);
        currView = "front";
        document.getElementById('back-view').style.display = 'block';
        document.getElementById('front-view').style.display = 'none';
    }
}

//drag and drop functionality
function dragOver(e) {
    e.preventDefault();
}
function drag(e) {
    e.dataTransfer.setData("text", document.getElementById(e.target.id).id);
}
function drop(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    const item = document.getElementById(data);
    const dropArea = document.getElementById('jacketbox');
    const alreadyDroppedItem = dropArea.querySelector(`#${data}`);
    const jacketCanvas = document.getElementById('jacketCanvas');
    const jacketCtx = jacketCanvas.getContext('2d');
    var imgData = jacketCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
    var rgba = imgData.data;
    if (alreadyDroppedItem) {
        if (rgba[3] !== 0) {
            positionItem(alreadyDroppedItem, e, dropArea);
        } else {
            return;
        }
    } else {
        if (rgba[3] !== 0) { //make sure the pixel under the drop isn't transparent
            const clonedItem = item.cloneNode(true);
            const uniqueId = `${data}-${Date.now()}`;
            clonedItem.id = uniqueId;
            clonedItem.className = item.className + ' dropped-item';
            clonedItem.style.cssText = item.style.cssText;
            /*if (clonedItem.id.startsWith('light-ind')) {
                clonedItem.style.backgroundColor = defaultColor;
                clonedItem.setAttribute('data-flashing-color', defaultColor);
            } else if (clonedItem.id.startsWith('light-strip')) {
                clonedItem.querySelectorAll('.circle, .rectangle').forEach(part => {
                    part.style.backgroundColor = defaultColor;
                });
                clonedItem.setAttribute('data-flashing-color', defaultColor);
            }*/
            dropArea.appendChild(clonedItem);
            positionItem(clonedItem, e, dropArea);
            /*if (clonedItem.id.startsWith('light-ind')) {
                //document.querySelector('input[name="item-movement"][value="Flash ind"]').checked = true;
                //selectedColor = 'grey';
                flashAnimation(clonedItem);
            } else if (clonedItem.id.startsWith('light-strip')) {
                //document.querySelector('input[name="item-movement"][value="Flash str"]').checked = true;
                //selectedColor = 'grey';
                flashAnimation(clonedItem);
            }*/

            clonedItem.addEventListener('click', function() {
                selectItem(clonedItem);
            });
            if (currView == "front") {
                frontItems.push(clonedItem);
            } else if (currView == "back") {
                backItems.push(clonedItem);
            }
            selectItem(clonedItem);
        } else {
            return;
        }
    }
}

function positionItem(item, e, area) {
    const rect = area.getBoundingClientRect();
    //const offsetX = -345;
    //const offsetY = -30;
    const xVal = e.clientX-rect.left-item.offsetWidth/2;//-offsetX;
    const yVal = e.clientY-rect.top-item.offsetHeight/2;//-offsetY;
    item.style.position = 'absolute';
    item.style.left = `${xVal}px`;
    item.style.top = `${yVal}px`;
    item.style.zIndex = '10';
    if (item.id.startsWith('light-strip')) {
        item.style.left=`${xVal-10}px`;
    } else if (item.id.startsWith('battery')) {
        item.style.left=`${xVal-30}px`;
        item.style.top=`${yVal-10}px`;
    } else if (item.id.startsWith('fur-patch')) {
        item.style.left=`${xVal-20}px`;
        item.style.top=`${yVal-20}px`;
    }
    item.x = xVal;
    item.y = yVal;
}

function selectItem(item) {
    document.querySelectorAll('.dropped-item').forEach(item => {
        item.classList.remove('selected-item');
        item.querySelectorAll('.circle, .rectangle, .battery1, .battery2, .rectangle2, .trapezoid, .fur1, .fur2').forEach(part => part.classList.remove('selected-item'));
        if (item.querySelector('.rotate-circle')) {
            item.querySelector('.rotate-circle').remove();
        }
    });
    item.classList.add('selected-item');
    const rotateCircle = document.createElement('div');
    rotateCircle.classList.add('rotate-circle');
    item.appendChild(rotateCircle);
    rotateItem(item, rotateCircle);
    if (item.id.startsWith('light-strip') || item.id.startsWith('battery') || item.id.startsWith('speaker') || item.id.startsWith('fur-patch')) {
        item.style.border = 'none';
    }
    if (item.id.startsWith('light-strip')) {
        rotateCircle.style.top = '-27px';
        rotateCircle.style.transform = 'translateX(30%)';
    } else if (item.id.startsWith('battery')) {
        rotateCircle.style.transform = 'translateX(125%)';
    } else if (item.id.startsWith('fur-patch')) {
        rotateCircle.style.transform = 'translateX(100%)';
    }
    item.querySelectorAll('.rectangle, .circle, .battery1, .battery2, .rectangle2, .trapezoid, .fur1, .fur2').forEach(part => part.classList.add('selected-item'));
    document.querySelectorAll('.movement > div').forEach(div => {
        div.style.display = 'none';
    });
    if (item.id.startsWith('speaker')) {
        document.getElementById('movement-title').textContent = "Sound";
        document.getElementById('custom-title').textContent = "Describe the desired sound:";
    } else {
        document.getElementById('movement-title').textContent = "Movement";
        document.getElementById('custom-title').textContent = "Write my own:";
    }
    let baseId = item.id;
    if (baseId.includes('copy')) {
        baseId = item.id.split('-').slice(0, -2).join('-');
    } else {
        baseId = item.id.split('-').slice(0, -1).join('-');
    }
    const movementElement = document.getElementById(`${baseId}-movement`);
    if (movementElement) {
        movementElement.style.display = 'block';
    }
    loadItemSelections(item.id);
}

function rotateItem(item, rotateCircle) {
    let rotating = false;
    let ogAngle = 0;
    rotateCircle.addEventListener('mousedown', function(e) {
        rotating = true;
        const rect = item.getBoundingClientRect();
        const centerX = rect.left+rect.width/2;
        const centerY = rect.top+rect.height/2;
        const xVal = e.clientX;
        const yVal = e.clientY;
        ogAngle = Math.atan2(yVal-centerY, xVal-centerX) - getCurrAngle(item);
        e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
        if (rotating) {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left+rect.width/2;
            const centerY = rect.top+rect.height/2;
            const xVal = e.clientX;
            const yVal = e.clientY;
            const currAngle = Math.atan2(yVal-centerY, xVal-centerX);
            const rotationAngle = currAngle - ogAngle;
            item.style.transform = `rotate(${rotationAngle*(180/Math.PI)}deg)`;
        }
    });
    document.addEventListener('mouseup', function() {
        rotating = false;
    });
}
function getCurrAngle(item) {
    const style = window.getComputedStyle(item);
    let transform;
    if (style.transform) {
        transform = style.transform;
    } else {
        transform = 'none';
    }
    if (transform == 'none') {
        return 0;
    }
    const matrix = transform.replace('matrix(', '').replace(')', '').split(', ');
    return Math.atan2(parseFloat(matrix[1]),parseFloat(matrix[0]));
}

//saving and loading item selections/customizations
var itemSelections = {
    front: {},
    back: {}
};
function saveItemSelections(itemID, radioSelection, sliderValue, userInput) {
    itemSelections[currView][itemID] = {radioSelection, sliderValue, userInput};
}
function loadItemSelections(itemID) {
    const selection = itemSelections[currView][itemID];
    if (selection) {
        const radio = document.querySelector(`input[name="item-movement"][value="${selection.radioSelection}"]`);
        if (radio) {
            radio.checked = true;
        } else {
            resetRadioButtons();
        }
        const slider = document.getElementById("speed-range");
        if (slider) {
            slider.value = selection.sliderValue;
            document.getElementById("value").innerHTML = slider.value;
        }
        const userInputBox = document.getElementById('custom-input');
        if (userInputBox) {
            if (selection.userInput) {
                userInputBox.value = selection.userInput;
            } else {
                userInputBox.value = '';
            }
        }
    } else {
        resetRadioButtons();
        resetSlider();
        resetUserInput();
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
function resetUserInput() {
    const userInputBox = document.getElementById('custom-input');
    if (userInputBox) {
        userInputBox.value = '';
    }
}

let flashInterval = null;
const flashingItems = new Set();
let currSpeed = null;
let selectedColor = null;
const defaultColor = 'grey';
let rgba2 = [];

document.addEventListener('DOMContentLoaded', function() {
    //draw jacket image to canvas
    const jacketCanvas = document.getElementById('jacketCanvas');
    const jacketCtx = jacketCanvas.getContext('2d');
    jacketCtx.clearRect(0,0,jacketCanvas.width,jacketCanvas.height);
    jacketCtx.drawImage(document.getElementById('jacket-front'),0,0,jacketCanvas.width,jacketCanvas.height);
    //draw color select image to canvas
    const colorCanvas = document.getElementById('colorCanvas');
    const colorCtx = colorCanvas.getContext('2d');
    colorCtx.drawImage(document.getElementById('color-wheel'),0,0,colorCanvas.width,colorCanvas.height);
    //color selecting functionality
    colorCanvas.addEventListener('click', function(e) {
        var imgData = colorCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
        var rgba = imgData.data;
        const rect = colorCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (rgba[3] !== 0) { //if click isnt on transparent area of image
            selectedColor = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3] / 255})`;
            rgba2[0] = rgba[0];
            rgba2[1] = rgba[1];
            rgba2[2] = rgba[2];
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            const other = document.querySelector('.other');
            if (selectedItem) {
                if (selectedItem == other) {
                    other.style.borderBottomColor = selectedColor;
                    other.style.backgroundColor = transparent;
                }
                selectedItem.style.backgroundColor = selectedColor;
                selectedItem.querySelectorAll('.circle, .rectangle, .battery1, .battery2, .rectangle2, .trapezoid, .fur1, .fur2').forEach(part => {
                    part.style.backgroundColor = selectedColor;
                });
                if (flashingItems.has(selectedItem)) {
                    selectedItem.setAttribute('data-flashing-color', selectedColor);
                }
                selectedItem.color = selectedColor;
                //let lighterColor = `rgba(${rgba[0]+20}, ${rgba[1]+20}, ${rgba[2]+20}, ${rgba[3] / 255})`;
                document.getElementById('color-range').style.background = `linear-gradient(to right, white, ${selectedColor}, black)`;
            }
            colorCtx.clearRect(0,0,colorCanvas.width,colorCanvas.height);
            colorCtx.drawImage(document.getElementById('color-wheel'),0,0,colorCanvas.width,colorCanvas.height);
            colorCtx.beginPath();
            colorCtx.arc(x, y, 6, 0, 2 * Math.PI);
            colorCtx.lineWidth = 2;
            colorCtx.strokeStyle = 'black';
            colorCtx.stroke();
        }
    });
    document.getElementById('color-range').addEventListener('input', function() {
        selectedColor = updateShade(this.value);
        const selectedItem = document.querySelector('.dropped-item.selected-item');
        const other = document.querySelector('.other');
        if (selectedItem) {
            if (selectedItem == other) {
                other.style.borderBottomColor = selectedColor;
                other.style.backgroundColor = transparent;
            }
            selectedItem.style.backgroundColor = selectedColor;
            selectedItem.querySelectorAll('.circle, .rectangle, .battery1, .battery2, .rectangle2, .trapezoid, .fur1, .fur2').forEach(part => {
                part.style.backgroundColor = selectedColor;
            });
            if (flashingItems.has(selectedItem)) {
                selectedItem.setAttribute('data-flashing-color', selectedColor);
            }
            selectedItem.color = selectedColor;
        }
    });
    let clickOpen = false;
    //create item when clicking jacket
    jacketCanvas.addEventListener('click', function(e) {
        var imgData = jacketCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
        var rgba = imgData.data;
        if (!clickOpen && rgba[3] !== 0) {
            const clickItem = document.querySelector('.click-create');
            const rect = jacketCanvas.getBoundingClientRect();
            const x = e.clientX-rect.left+170;
            const y = e.clientY-rect.top+15;
            clickItem.style.left = `${x}px`;
            clickItem.style.top = `${y}px`;
            clickItem.style.display = 'grid';
            clickOpen = true;
        } else {
            clickItem.style.display = 'none';
            clickOpen = false;
        }
        e.stopPropagation();
    });
    document.addEventListener('click', function(e) {
        if (!document.querySelector('.click-create').contains(e.target) && clickOpen == true) {
            document.querySelector('.click-create').style.display = 'none';
            clickOpen = false;
        }
    });
    document.querySelectorAll('.click-item').forEach(item => {
        const dropArea = document.getElementById('jacketbox');
        let clickedItem = null;
        item.addEventListener('click', function(e) {
            if (e.target.id == 'click-fur') {
                const furNodeList = document.querySelectorAll('.fur-patch');
                for (let i = 0; i < furNodeList.length; i++) {
                    const furClonedNode = furNodeList[i].cloneNode(true);
                    furClonedNode.id = `${'fur-patch'}-${Date.now()}`;
                    furClonedNode.className = furClonedNode.className + ' dropped-item';
                    dropArea.appendChild(furClonedNode);
                    clickPositionItem(furClonedNode, e, dropArea);
                    furClonedNode.addEventListener('click', function () {
                        selectItem(furClonedNode);
                    });
                }
            } else if (e.target.id == 'click-light1') {
                clickedItem = document.getElementById('light-ind').cloneNode(true);
                clickedItem.id = `${'light-ind'}-${Date.now()}`;
                clickedItem.className = document.getElementById('light-ind').className + ' dropped-item';
                dropArea.appendChild(clickedItem);
                clickPositionItem(clickedItem, e, dropArea);
                clickedItem.addEventListener('click', function () {
                    selectItem(clickedItem);
                });
                //clickedItem.style.left = `${e.clientX-rect.left+170}px`;
                //clickedItem.style.top = `${e.clientY-rect.top+15}px`;
            } else if (e.target.id == 'click-light2') {
                const lightNodeList = document.querySelectorAll('.light-strip');
                for (let i = 0; i < lightNodeList.length; i++) {
                    const lightClonedNode = lightNodeList[i].cloneNode(true);
                    lightClonedNode.id = `${'light-strip'}-${Date.now()}`;
                    lightClonedNode.className = lightClonedNode.className + ' dropped-item';
                    dropArea.appendChild(lightClonedNode);
                    clickPositionItem(lightClonedNode, e, dropArea);
                    lightClonedNode.addEventListener('click', function () {
                        selectItem(lightClonedNode);
                    });
                }
            } else if (e.target.id == 'click-battery') {
                const batteryNodeList = document.querySelectorAll('.battery');
                for (let i = 0; i < batteryNodeList.length; i++) {
                    const batteryClonedNode = batteryNodeList[i].cloneNode(true);
                    batteryClonedNode.id = `${'battery'}-${Date.now()}`;
                    batteryClonedNode.className = batteryClonedNode.className + ' dropped-item';
                    dropArea.appendChild(batteryClonedNode);
                    clickPositionItem(batteryClonedNode, e, dropArea);
                    batteryClonedNode.addEventListener('click', function () {
                        selectItem(batteryClonedNode);
                    });
                }
            } else if (e.target.id == 'click-display') {
                clickedItem = document.getElementById('display').cloneNode(true);
                clickedItem.id = `${'display'}-${Date.now()}`;
                clickedItem.className = document.getElementById('display').className + ' dropped-item';
                dropArea.appendChild(clickedItem);
                clickPositionItem(clickedItem, e, dropArea);
                clickedItem.addEventListener('click', function () {
                    selectItem(clickedItem);
                });
            } else if (e.target.id == 'click-speaker') {
                const speakerNodeList = document.querySelectorAll('.speaker');
                for (let i = 0; i < speakerNodeList.length; i++) {
                    const speakerClonedNode = speakerNodeList[i].cloneNode(true);
                    speakerClonedNode.id = `${'speaker'}-${Date.now()}`;
                    speakerClonedNode.className = speakerClonedNode.className + ' dropped-item';
                    dropArea.appendChild(speakerClonedNode);
                    clickPositionItem(speakerClonedNode, e, dropArea);
                    speakerClonedNode.addEventListener('click', function () {
                        selectItem(speakerClonedNode);
                    });
                }
            } else if (e.target.id == 'click-other') {
                clickedItem = document.getElementById('other').cloneNode(true);
                clickedItem.id = `${'other'}-${Date.now()}`;
                clickedItem.className = document.getElementById('other').className + ' dropped-item';
                dropArea.appendChild(clickedItem);
                clickPositionItem(clickedItem, e, dropArea);
                clickedItem.addEventListener('click', function () {
                    selectItem(clickedItem);
                });
            }
        });
    });
    //slider functionality
    var slider = document.getElementById("speed-range");
    var output = document.getElementById("value");
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = this.value;
        //currSpeed = this.value * 10;
    }
    //saving radio button selection
    document.querySelectorAll('input[name="item-movement"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedItem = document.querySelector('.dropped-item.selected-item');
            if (selectedItem) {
                const sliderVal = document.getElementById("speed-range").value;
                saveItemSelections(selectedItem.id, this.value, sliderVal, document.getElementById("custom-input").value);
                if (radio.value.includes('Light on')) {
                    stopFlash(selectedItem);
                } else if (radio.value.includes('Flash')) {
                    updateSpeed(sliderVal);
                    flashAnimation(selectedItem);
                    document.getElementById("speed-range").addEventListener('input', function() {
                        const currMovement = document.querySelector('input[name="item-movement"]:checked');
                        if (currMovement && currMovement.value.includes('Light on')) {
                            stopFlash(selectedItem);
                            return;
                        }
                        updateSpeed(this.value);
                        flashAnimation(selectedItem);
                    });
                } else if (radio.value.includes('Trickle up')) {
                    updateSpeed(sliderVal);
                    flashAnimation(selectedItem, 'trickle-up');
                    document.getElementById("speed-range").addEventListener('input', function() {
                        const currMovement = document.querySelector('input[name="item-movement"]:checked');
                        if (currMovement && currMovement.value.includes('Light on')) {
                            stopFlash(selectedItem);
                            return;
                        }
                        updateSpeed(this.value);
                        flashAnimation(selectedItem, 'trickle-up');
                    });
                } else if (radio.value.includes('Trickle down')) {
                    updateSpeed(sliderVal);
                    flashAnimation(selectedItem, 'trickle-down');
                    document.getElementById("speed-range").addEventListener('input', function() {
                        const currMovement = document.querySelector('input[name="item-movement"]:checked');
                        if (currMovement && currMovement.value.includes('Light on')) {
                            stopFlash(selectedItem);
                            return;
                        }
                        updateSpeed(this.value);
                        flashAnimation(selectedItem, 'trickle-down');
                    });
                } else if (radio.value.includes('Random fl')) {
                    updateSpeed(sliderVal);
                    flashAnimation(selectedItem, 'random-fl');
                    document.getElementById("speed-range").addEventListener('input', function() {
                        const currMovement = document.querySelector('input[name="item-movement"]:checked');
                        if (currMovement && currMovement.value.includes('Light on')) {
                            stopFlash(selectedItem);
                            return;
                        }
                        updateSpeed(this.value);
                        flashAnimation(selectedItem, 'random-fl');
                    });
                }
                selectedItem.radioSelection = this.value;
                selectedItem.speed = sliderVal;
            }
        });
    });
    //saving user input
    document.getElementById("custom-input").addEventListener('input', function(){
        const selectedItem = document.querySelector('.dropped-item.selected-item');
        let radioValue;
        if (selectedItem) {
            const selectedRadio = document.querySelector('input[name="item-movement"]:checked');
            if (selectedRadio) {
                radioValue = selectedRadio.value;
            } else {
                radioValue = null;
            }
            saveItemSelections(selectedItem.id, radioValue, document.getElementById("speed-range").value, this.value);
            selectedItem.userinput = document.getElementById("custom-input").value;
        }
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
            saveItemSelections(selectedItem.id, radioValue, this.value, document.getElementById("custom-input").value);
            selectedItem.speed = this.value;
            updateSpeed(this.value);
        }
    });
    //delete item
    document.addEventListener('keydown', (e) => {
        const selectedItem = document.querySelector('.dropped-item.selected-item');
        if (document.activeElement.id.startsWith('custom-input')) {
            return;
        }
        if (selectedItem) {
            if (e.key == 'Delete' || e.key == 'Backspace') {
                deleteItem();
            } else if (e.key == 'ArrowUp') {
                selectedItem.style.top = `${parseInt(selectedItem.style.top)-10}px`;
            } else if (e.key == 'ArrowDown') {
                selectedItem.style.top = `${parseInt(selectedItem.style.top)+10}px`;
            } else if (e.key == 'ArrowLeft') {
                selectedItem.style.left = `${parseInt(selectedItem.style.left)-10}px`;
            } else if (e.key == 'ArrowRight') {
                selectedItem.style.left = `${parseInt(selectedItem.style.left)+10}px`;
            }
        }
    });
    //user input for popup
    const p1 = document.getElementById("participant1");
    const vN1 = document.getElementById("videoNum1")
    p1.addEventListener('input', function() {
        if ((p1.value != "") && (vN1.value != "")) {
            document.getElementById("continue-button").disabled = false;
        } else {
            document.getElementById("continue-button").disabled = true;
        }
    });
    vN1.addEventListener('input', function() {
        if ((p1.value != "") && (vN1.value != "")) {
            document.getElementById("continue-button").disabled = false;
        } else {
            document.getElementById("continue-button").disabled = true;
        }
    });
    //info popup
    document.querySelector('.popup-info').style.display = 'none';
    document.getElementById('info-button').addEventListener('click', function() {
        document.querySelector('.popup-info').style.display = 'block';
    });
    document.getElementById('close-info').addEventListener('click', function() {
        document.querySelector('.popup-info').style.display = 'none';
    });
    //clicking to deselect
    document.querySelector('.container').addEventListener('click', function(e) {
        const selectedItem = document.querySelector('.dropped-item.selected-item');
        if (selectedItem && e.target != selectedItem && !e.target.closest('.customization') && !e.target.closest('.rotate-circle')) {
            selectedItem.classList.remove('selected-item');
            //document.querySelectorAll('.color, .speed').style.display = 'none';
        } else if (e.target == selectedItem) {
            //selectedItem.classList.add();
            //document.querySelectorAll('.color, .speed').style.display = 'block'; //alter this querySelectorAll '.customization test, etcetc
        }
    });
});

function clickPositionItem(item, e, area) {
    const rect = area.getBoundingClientRect();
    const xVal = e.clientX-rect.left-item.offsetWidth/2;
    const yVal = e.clientY-rect.top-item.offsetHeight/2;
    item.style.position = 'absolute';
    item.style.left = `${xVal}px`;
    item.style.top = `${yVal}px`;
    item.style.zIndex = '10';
    if (item.id.startsWith('light-strip')) {
        item.style.left=`${xVal-10}px`;
    } else if (item.id.startsWith('battery')) {
        item.style.left=`${xVal-30}px`;
        item.style.top=`${yVal-10}px`;
    } else if (item.id.startsWith('fur-patch')) {
        item.style.left=`${xVal-20}px`;
        item.style.top=`${yVal-20}px`;
    }
    item.x = xVal;
    item.y = yVal;
}

function updateShade(sliderVal) {
    let color2 = null;
    let ratio = null;
    if (sliderVal <= 5) {
        ratio = sliderVal/5;
        color2 = `rgba(${Math.round(255+(rgba2[0]-255)*ratio)}, ${Math.round(255+(rgba2[1]-255)*ratio)}, ${Math.round(255+(rgba2[2]-255)*ratio)}, 1)`.replace(/\s+/g, '');
    } else {
        ratio = (sliderVal-5)/5;
        color2 = `rgba(${Math.round(rgba2[0]*(1-ratio))}, ${Math.round(rgba2[1]*(1-ratio))}, ${Math.round(rgba2[2]*(1-ratio))}, 1)`.replace(/\s+/g, '');
    }
    return color2;
}

function updateSpeed(sliderVal) {
    if (sliderVal == 1) {
        currSpeed = 700;
    } else if (sliderVal == 2) {
        currSpeed = 550;
    } else if (sliderVal == 3) {
        currSpeed = 400;
    } else if (sliderVal == 4) {
        currSpeed = 250;
    } else if (sliderVal == 5) {
        currSpeed = 90;
    }
}

//normalize/reformat color string so rgba comparison works
function normalizeColorStr(colorStr) {
    colorStr = colorStr.replace(/\s+/g, '').toLowerCase();
    if (colorStr.startsWith('rgb(') && !colorStr.startsWith('rgba')) {
        const rgba = colorStr.match(/\d+/g);
        if (rgba && rgba.length == 3) {
            return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},1)`;
        }
    }
    return colorStr;
}

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
                let flashingColor = normalizeColorStr(flashingItem.getAttribute('data-flashing-color'));
                let currColor = null;
                if (!flashingColor) {
                    flashingColor = defaultColor;
                }
                if (flashingItem.classList.contains('light-ind')) {
                    currColor = normalizeColorStr(flashingItem.style.backgroundColor);
                    if (currColor == flashingColor) {
                        flashingItem.style.backgroundColor = '#bbb';
                    } else {
                        flashingItem.style.backgroundColor = flashingColor;
                    }
                } else {
                    flashingItem.querySelectorAll('.rectangle, .circle').forEach(part => {
                        currColor = normalizeColorStr(part.style.backgroundColor);
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
        const tempId = selectedItem.id.split('-').slice(0, -1).join('-');;
        clonedItem.id = `${tempId}-copy-${Date.now()}`;
        clonedItem.className = selectedItem.className + ' dropped-item';
        clonedItem.style.cssText = selectedItem.style.cssText;
        const dropArea = document.getElementById('jacketbox');
        const rect = selectedItem.getBoundingClientRect();
        const xVal = rect.left-dropArea.offsetLeft+10;
        const yVal = rect.top-dropArea.offsetTop+10;
        clonedItem.style.position = 'absolute';
        clonedItem.style.left = `${xVal}px`;
        clonedItem.style.top = `${yVal}px`;
        clonedItem.style.zIndex = '10';
        dropArea.appendChild(clonedItem);
        if (currView === 'front') {
            frontItems.push(clonedItem);
        } else if (currView === 'back') {
            backItems.push(clonedItem);
        }
        const ogCustomizations = itemSelections[currView][selectedItem.id];
        if (ogCustomizations) {
            itemSelections[currView][clonedItem.id] = {...ogCustomizations};
            clonedItem.radioSelection = ogCustomizations.radioSelection;
            clonedItem.speed = ogCustomizations.sliderValue;
            clonedItem.userinput = ogCustomizations.userInput;
            clonedItem.color = selectedColor;
            clonedItem.x = xVal;
            clonedItem.y = yVal; //maybe double check the coords
        } else {
            clonedItem.radioSelection = null;
            clonedItem.speed = null;
            clonedItem.userinput = null;
            clonedItem.color = null;
            clonedItem.x = xVal;
            clonedItem.y = yVal;
        }
        clonedItem.addEventListener('click', function() {
            selectItem(clonedItem);
        });
        clonedItem.setAttribute('data-flashing-color', selectedItem.getAttribute('data-flashing-color'));//flashing works for dupe but not other animations
        if (flashingItems.has(selectedItem)) {
            flashingItems.add(clonedItem);
        }
        selectItem(clonedItem);
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
        if (currView == 'front') {
            for (let i = 0; i < frontItems.length; i++) {
                if (frontItems[i].id == selectedItem.id) {
                    frontItems[i].id = "DELETED"+frontItems[i].id;//frontItems.splice(i,1);
                }
            }
        } else if (currView == 'back') {
            for (let i = 0; i < backItems.length; i++) {
                if (backItems[i].id == selectedItem.id) {
                    backItems[i].id = "DELETED"+backItems[i].id;//backItems.splice(i,1);
                }
            }
        }
        selectedItem.remove();
    }
}

function continueToGUI() {
    document.querySelector(".popup").style.display = 'none';
    document.getElementById("participant").value = document.getElementById("participant1").value;
    document.getElementById("videoNum").value = document.getElementById("videoNum1").value;
}

//test --> also going to change this
function saveFile() {
    const participantNum = document.getElementById('participant').value;
    const videoNum = document.getElementById('videoNum').value;
    var csvFile = "data:text/csv;charset=utf-8,";
    csvFile += "Jacket Side,Item ID,Customization,Speed,User Input,Color,X Position,Y Position\n";
    for (let i = 0; i < frontItems.length; i++) { //items on jacket front  selectedItem.userinput = document.getElementById(selectedItem.custom-1).value;
        csvFile += `front,${frontItems[i].id},${frontItems[i].radioSelection},${frontItems[i].speed},${frontItems[i].userinput},"${frontItems[i].color}",${frontItems[i].x},${frontItems[i].y}\n`;
    }
    for (let i = 0; i < backItems.length; i++) { //items on jacket back
        csvFile += `back,${backItems[i].id},${backItems[i].radioSelection},${backItems[i].speed},${backItems[i].userinput},"${backItems[i].color}",${backItems[i].x},${backItems[i].y}\n`;
    }
    const encodedUri = encodeURI(csvFile);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Participant_${participantNum}_Video_${videoNum}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}