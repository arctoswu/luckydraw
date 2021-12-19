/*
 * Lucky draw code adapted from http://jsfiddle.net/yckelvin/6VA5e/
 */

var lookupNamesTBL = new Array();

Array.prototype.vlookup = function(index) {
    return this[index];
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function renderNameRoulette(nameElement, duration) {
    for (var i = 0; i < duration; i++) {
        var r = getRandomInt(0,lookupNamesTBL.length-1);
        nameElement.innerHTML = lookupNamesTBL.vlookup(r);
        await sleep(100);
    }

    return lookupNamesTBL.vlookup(r);
}


/* 
 * File handler code adapted from https://github.com/GoogleChromeLabs/text-editor/blob/main/src/inline-scripts/fs-helpers.js
 */

async function readFile() {
    let fileHandle;

    // For Chrome 86 and later...
    if ('showOpenFilePicker' in window) {
        [fileHandle] = await window.showOpenFilePicker();
    }
    // For Chrome 85 and earlier...
    else {
        fileHandle = window.chooseFileSystemEntries();
    }

    if (!fileHandle) {
        console.log("Error getting file handle!");
        return;
    }

    const file = await fileHandle.getFile();
    if (file.text) {
        return file.text();
    }
    return _readFileLegacy(file);
}

function _readFileLegacy(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            const text = e.srcElement.result;
            resolve(text);
        });
        reader.readAsText(file);
    });
}

// Create a handle to a new (text) file on the local file system.
function getNewFileHandle() {
    // For Chrome 86 and later...
    if ('showSaveFilePicker' in window) {
        const opts = {
            suggestedName: 'winners.txt',
            types: [{
                description: 'Text file',
                accept: {'text/plain': ['.txt']},
            }],
        };
        return window.showSaveFilePicker(opts);
    }
    // For Chrome 85 and earlier...
    const opts = {
        type: 'save-file',
        accepts: [{
            description: 'Text file',
            extensions: ['txt'],
            mimeTypes: ['text/plain'],
        }],
    };
    return window.chooseFileSystemEntries(opts);
}
  
// Writes the contents to disk.
async function writeFile(contents) {
    let fileHandle = await getNewFileHandle();

    // Support for Chrome 82 and earlier.
    if (fileHandle.createWriter) {
        // Create a writer (request permission if necessary).
        const writer = await fileHandle.createWriter();
        // Write the full length of the contents
        await writer.write(0, contents);
        // Close the file and write the contents to disk
        await writer.close();
        return;
    }
    // For Chrome 83 and later.
    else {
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(contents);
        // Close the file and write the contents to disk.
        await writable.close();
        return;
    }
}


/*
 * Confetti code adapted from https://www.codehim.com/animation-effects/javascript-confetti-explosion-effect/
 */

//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }
];

//-----------Functions--------------
resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = ctx.canvas.width / 2;
    cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            color: colors[Math.floor(randomRange(0, colors.length))],
            dimensions: {
                x: randomRange(10, 20),
                y: randomRange(10, 30)
            },
            position: {
                x: randomRange(0, canvas.width),
                y: canvas.height - 1
            },
            rotation: randomRange(0, 2 * Math.PI),
            scale: {
                x: 1,
                y: 1
            },
            velocity: {
                x: randomRange(-25, 25),
                y: randomRange(0, -50)
            }
        });
    }
};

//---------Render-----------
render = () => {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;
        
        // Move canvas to position and rotate
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);
        
        // Apply forces to velocity
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
        
        // Set position
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;
        
        // Delete confetti when out of frame
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
        
        // Loop confetto x position
        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;
        
        // Spin confetto by scaling y
        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        
        // Draw confetti
        ctx.fillRect(-width / 2, -height / 2, width, height);
        
        // Reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
    
    window.requestAnimationFrame(render);
};

//---------Execution--------
render();

//----------Resize----------
window.addEventListener('resize', function () {
    resizeCanvas();
});


/*
 * Lucky draw functions
 */

// roulette clip from https://freesound.org/people/jrayhartley/sounds/514303/
var rouletteEffect = new Audio('res/roulette.mp3');
rouletteEffect.loop = true;

// cheering clip from https://freesound.org/people/AmishRob/sounds/214989/
var cheerEffect = new Audio('res/pop-cheer.mp3');

async function loadParticipants() {
    // Assumes text file to contain list of participants names without header row
    var contents = await readFile();
    var lines = contents.split(/\r\n|\n/);
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
            lookupNamesTBL.push(lines[i]);
        }
    }

    document.getElementById("msgLoadStatus").innerHTML = "Loaded " + lookupNamesTBL.length + " entries."
}

function removeNames(name) {
    var i = lookupNamesTBL.length;

    while (i--) {
        if (lookupNamesTBL[i] === name) {
            lookupNamesTBL.splice(lookupNamesTBL.indexOf(name), 1);
        }
    }
}

async function drawWinner(drawButton, duration = 100) {
    rouletteEffect.play();
    drawButton.style.visibility = 'hidden';

    // draw winner randomly
    nameTags = drawButton.parentNode.getElementsByClassName("winner-name");
    for (var i = 0; i < nameTags.length; i++) {
        var winner = await renderNameRoulette(nameTags[i], duration);
        nameTags[i].style.color = "black";

        // Remove winner from list to prevent repeated winners
        removeNames(winner);
    }
    rouletteEffect.pause();

    // add sound effect and confetti for winner(s)
    cheerEffect.currentTime = 0;
    cheerEffect.play();
    var prizeSection = drawButton.closest("section");
    prizeSection.prepend(document.getElementById("canvas"));
    initConfetti();
}

async function saveWinners() {
    var winners = document.getElementsByClassName("winner-name");
    
    var listitems = [];
    for (i = 0; i < winners.length; i++) {
        listitems.push(winners.item(i));
    }

    listitems.sort(function(a, b) {
        var compA = a.getAttribute("id").toUpperCase();
        var compB = b.getAttribute("id").toUpperCase();
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });

    var contents = "Prize,Name\n";
    for (var i = 0; i < listitems.length; i++) {
        contents += listitems[i].getAttribute("id") + ",";
        contents += listitems[i].innerHTML;
        contents += "\n";
    }
    await writeFile(contents);
}
