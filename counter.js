// be sure to tip your service workers before you leave
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(function(reg) {
        if (reg.installing) {
            console.log("Service worker installing");
        } else if (reg.waiting) {
            console.log("Service worker installed");
        } else if (reg.active) {
            console.log("Service worker active");
        }
    }).catch(function(error) {
        console.log("Registration failed with " + error);
    });
}
function show(id, el) {
    var elem = el;
    if (elem == null) {
        elem = document.getElementById(id);
    }
    if (elem != null) {
        elem.classList.remove("hidden");
    }
}
function hide(id, el) {
    var elem = el;
    if (elem == null) {
        elem = document.getElementById(id);
    }
    if (elem != null) {
        elem.classList.add("hidden");
    }
}
function playerLayoutDefault(activeDivs) {
    // sizes for the default vertical layout
    var defaultVerticalSizes = [null,   "100%", "50%", "33.3%", "25%", "20%", "16.6%", "14.28%", "12.5%"];
    // set the height and display of the active player rows
    for (var i = 0; i < activeDivs.length; i++) {
        activeDivs[i].style.height = defaultVerticalSizes[activeDivs.length];
        // charlie brown you blockhead
        activeDivs[i].style.display = "block";
    }
}
function playerLayoutHelper(activeDivs, arrClassNames) {
    // perpetuate the class struggle
    for (var i = 0; i <  activeDivs.length; i++) {
        var currentClass = activeDivs[i].className;
        activeDivs[i].className = currentClass + " " + arrClassNames[i];
    }
}
function playerLayoutTwo(activeDivs) {
    activeDivs[0].className = activeDivs[0].className + " two-t";
    activeDivs[1].className = activeDivs[1].className + " two-b";
}
function playerLayoutThree(activeDivs) {
    var classNames = ["four-t-l", "four-t-r", "four-b-l"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutFour(activeDivs) {
    var classNames = ["four-t-l", "four-t-r", "four-b-l", "four-b-r"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutFive(activeDivs) {
    var classNames = Array(5).fill("five");
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutSix(activeDivs) {
    var classNames = ["six-t-l", "six-t-r", "six-m-l", "six-m-r", "six-b-l", "six-b-r"];
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutSeven(activeDivs) {
    var classNames = Array(7).fill("seven");
    playerLayoutHelper(activeDivs, classNames);
}
function playerLayoutEight(activeDivs) {
    var classNames = Array(8).fill("eight");
    playerLayoutHelper(activeDivs, classNames);
}
function setPlayerlayout() {
    // these are the player rows we want to display
    var activeDivs = document.getElementsByClassName("active");
    // select the layout for the total number of players
    switch (g_numberPlayers) {
        case 2: // good lovin'
            playerLayoutTwo(activeDivs);
            break;
        case 3: // menage a trois
            playerLayoutThree(activeDivs);
            break;
        case 4: // couple swapping
            playerLayoutFour(activeDivs);
            break;
        case 5: // are we an orgy already?
            playerLayoutFive(activeDivs);
            break;
        case 6: // party time, excellent
            playerLayoutSix(activeDivs);
            break;
        case 7: // people enough for everything you want
            playerLayoutSeven(activeDivs);
            break;
        case 8: // it smells like sex and candy
            playerLayoutEight(activeDivs);
            break;
        default:
            playerLayoutDefault(activeDivs);
            break;
    }
}
function setStartingLifeTotal(life) {
    // set the value in the life divs
    var lifeDivs = document.getElementsByClassName("life");
    for (var i = 0; i < lifeDivs.length; i++) {
        // you go now, it's your birthday, it's your birthday
        lifeDivs[i].innerText = life;
    }
}
function getStartingLifeTotal(startingLife) {
    // is this nihilism?
    var life = null;
    if (startingLife != null) {
        // we should check the rules to see if this is allowed
        var iLife = parseInt(startingLife);
        // setting the starting life to force of nature is just not possible
        if (isNaN(iLife)) {
            life = "20";
        } else {
            // should not have too much or too little life
            if (iLife > 100) {
                life = "100";
            } else if (iLife < 20) {
                life = "20";
            } else {
                // got the life
                life = startingLife;
            }
        }
    } else {
        // get the select element for the starting life total
        var selectStartingLife = document.getElementById("start_life");
        // get the selected value
        var life = selectStartingLife.options[selectStartingLife.selectedIndex].value;
        // if the universe hates us and we have no life
        if (life == null || life == "") {
            // default to 20 life points because this is a nice number, not a mean number like 7
            life = "20";
        }
    }
    return life;
}
function displayTiles() {
    // get a collection of all the player tiles
    var divs = document.getElementsByClassName("tile");
    // for each player tile cast some instants
    for (var i = 0; i < divs.length; i++) {
        // reset the normal css classes
        divs[i].className = "tile noise c" + i;
        // make sure everyone has a pulse before we begin
        animateDead(divs[i].children[0]);
        if (i < g_numberPlayers) {
            // these are the tiles for those about to throw down
            divs[i].classList.add("active");
        } else {
            // all of the other player tiles should be placed in exile
            divs[i].classList.add("hidden");
        }
    }
}
function showFirstPlayerDialog() {
    // summon a Math Random to see who begins
    var startingPlayer = Math.floor(Math.random() * g_numberPlayers + 1);
    // set the text for the glorius, wondrous leader of the game
    var text = document.getElementById("starting_player_dialog_text");
    text.innerText = "Player " + startingPlayer.toString() + " begins!";
    showMask();
    // kick some goblins and get them to display the dialog
    show("starting_player_dialog");
}
function hideFirstPlayerDialog() {
    hideMask();
    // bury the dialog
    hide("starting_player_dialog");
}
var g_numberPlayers = 0;
function newGame(startingLife) {
    // display the player tiles we will need and hide the rest
    displayTiles();
    // get the starting life total
    var life = getStartingLifeTotal(startingLife);
    // set the starting life total
    setStartingLifeTotal(life);
    // set the right layout for the number of players
    setPlayerlayout();
    // hide the choose number of players container
    hide("choose");
    // show the players container
    show("play");
}
function death(el) {
    // clear the life total because there is no more life
    el.innerText = "";
    // add the death class so we can see the skull and laugh at them
    el.classList.add("death");
    // hide the plus and minus buttons for this player
    hide(null, el.nextElementSibling.children[0]);
    hide(null, el.nextElementSibling.children[1]);
    // display the button for the unearth spell
    show(null, el.nextElementSibling.children[2]);
}
function animateDead(el) {
    // you start again with 1 life
    el.innerText = "1";
    // sorcery to remove death
    el.classList.remove("death");
    // show the plus and minus buttons for this player
    show(null, el.nextElementSibling.children[0]);
    show(null, el.nextElementSibling.children[1]);
    // hide the resurrection button
    hide(null, el.nextElementSibling.children[2]);
}
function displayLife(el, intTotal) {
    // is the player dead yet?
    if (intTotal <= 0) {
        // yes, they drink with the gods in Valhalla
        death(el);
    } else {
        // no, they are not dead yet, they feel happy
        // display their remaining life total
        el.innerText = intTotal.toString();
    }
}
function changeLife(id, change) {
    // get the div element which has the life total for this player
    var totalDiv = document.getElementById(id);
    // get the text content (their current life total)
    var strCurrentTotal = totalDiv.innerText;
    // convert the text to an integer
    var intCurrentTotal = parseInt(strCurrentTotal);
    // the amount of change should be an integer too
    var intChange = parseInt(change);
    // maths is hard
    var intNewTotal = intCurrentTotal + intChange;
    // display the new life total, tada!
    displayLife(totalDiv, intNewTotal);
}
function plusLife(id) {
    // add one to the life total because lifelink or whatever stupid shit
    changeLife(id, 1);
}
function minusLife(id) {
    // subtract one from the life total, oh the horror
    changeLife(id, -1);
}
function mousedownChangeValue(el) {
    // get the data-id from the button
    var id = el.dataset.id;
    // the button class tells us if we need to add or subtract from the life total
    if (el.className.includes("plus")) {
        // we all want more
        plusLife(id);
    } else if (el.className.includes("minus")) {
        // too many cigarettes or something
        minusLife(id);
    }
}
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
    // look for the available fullscreen properties for the browser
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    // if we are not in fullscreen mode then just do it
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        // we are already in fullscreen mode so close it
        cancelFullScreen.call(doc);
    }
}
function replay(e) {
    // just one more game, just one more
    newGame();
    // end of turn for menu
    closeSlideMenu(e);
}
function restart(e) {
    // show the choose number of players container
    show("choose");
    // hide the players container
    hide("play");
    // end of turn for menu
    closeSlideMenu(e);
}
function getParamAndValidate(urlParams, paramName, rangeBottom, rangeTop) {
    var returnValue = null;
    var paramValue = urlParams.get(paramName);
    if (paramValue != null) {
        // if we have something then cast an int spell
        var intParam = parseInt(paramValue);
        if (intParam != null && !isNaN(intParam)) {
            // int spell was not counterspelled
            returnValue = intParam;
            // if we have added too many +1/+1 counters we should take them off
            // if we didn't add enough then more +1/+1 counters for you
            if (returnValue > rangeTop) {
                returnValue = rangeTop;
            } else if (returnValue < rangeBottom) {
                returnValue = rangeBottom;
            }

        } else if (isNaN(intParam)) {
            // frak, we don't know what is happening
            intParam = null;
        }
    }
    return returnValue;
}
function handleQueryString()
{
    // check for query params
    var urlParams = new URLSearchParams(location.search);
    // we are looking for "p" which is number of players
    // and "l" which is the starting life total
    if (urlParams != null && (urlParams.has("p") || urlParams.has("l"))) {
        // check yourself before you wreck yourself
        var numberPlayers = getParamAndValidate(urlParams, "p", 2, 8);
        var startingLife = getParamAndValidate(urlParams, "l", 1, 999);
        if (numberPlayers != null) {
            g_numberPlayers = numberPlayers;
            if (startingLife == null) {
                startingLife = 20;
            }
            // round 1: fight!
            newGame(startingLife);
        }
    }
}
function handleSwipeLeft(e) {
    if (g_slideOutMenu != null) {
        // we gotta close now, you don't have
        // to go home but you can't stay here
        g_slideOutMenu.close();
    }
}
function handleSwipeRight(e) {
    if (g_slideOutMenu != null) {
        // yay! we're doing stuff
        g_slideOutMenu.open();
    }
}
function getPlayerTile(e) {
    // what were we pressing on?
    var targetButton = e.target;
    // only handle plus / minus button press up events
    if (targetButton != null && (targetButton.classList.contains("plus") || targetButton.classList.contains("minus"))) {
        // get the player tile element that has the class with the background color on it from the page on the site with the stuff
        var playerTile = targetButton.parentElement.parentElement;
        if (playerTile != null && playerTile.classList.contains("tile")) {
            return playerTile;
        }
    }
    return null;
}
function getCurrentColor(el) {
    // verify a player tile was passed in
    if (el != null && el.classList.contains("tile")) {
        // this returns a rgb string like so "rgb(30, 144, 255)"
        return window.getComputedStyle(el).getPropertyValue("background-color");
    }
    return null;
}
function RgbStringToHex(rgb) {
    // do all the maths during the upkeep
    rgb = rgb.substr(4).split(")")[0].split(",");

    var r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    r = (r.length == 1) ? "0" + r : r;
    g = (g.length == 1) ? "0" + g : g;
    b = (b.length == 1) ? "0" + b : b;

    return "#" + r + g + b;
}
function handlePressUp(e) {
    // what player tile was pressed?
    var playerTile = getPlayerTile(e);
    if (playerTile != null) {
        // what is the current color of the player tile?
        var currentColorRgb = getCurrentColor(playerTile);
        if (currentColorRgb != null) {
            // hexerei
            var hex = RgbStringToHex(currentColorRgb);
            // go baby go!
            openColorpicker(playerTile, hex);
        }
    }
}
var g_elPlayerTile = null;
var g_currentColor = null;
function colorSelected(el) {
    var selectedColor = el.dataset.color;
    if (g_elPlayerTile != null) {
        g_elPlayerTile.style.backgroundColor = selectedColor;
    }
    closeColorpicker();
}
function showColorpicker() {
    show("colorpicker");
}
function hideColorpicker() {
    hide("colorpicker");
}
function openColorpicker(el, hex) {
    g_elPlayerTile = el;
    g_currentColor = hex;
    showMask();
    showColorpicker();
    var selectedColor = document.getElementById(hex);
    if (selectedColor != null) {
        selectedColor.focus();
    }
}
function closeColorpicker() {
    g_elPlayerTile = null;
    g_currentColor = null;
    hideMask();
    hideColorpicker();
}
function initColorpicker() {
    var colorContainer = document.getElementById("colorpicker");
    var bgColorArray = ["#b22222", "#e00000", "#d90073", "#ce9ae4",
                        "#911eb4", "#2e86c1", "#0000ff", "#000080",
                        "#138d75", "#228b22", "#28b463", "#016171",
                        "#fec007", "#fe730e", "#fc6f53", "#f0e68c",
                        "#a0522d", "#000000", "#6d7a70", "#ffffff"];
    for (var i=0; i < bgColorArray.length; i++) {
        var rgbColor = bgColorArray[i];
        var button = document.createElement("input");
        button.id = rgbColor;
        button.type = "button";
        button.className = "swatch";
        button.dataset.color = rgbColor;
        button.style.backgroundColor = rgbColor;
        button.addEventListener("click", function(e) {
            colorSelected(this);
        }, false);
        colorContainer.appendChild(button);
    }
}
function showMask() {
    show("mask");
}
function hideMask() {
    hide("mask");
}
function initTouchyFeelyHandsyStuff(el) {
    // you *can* touch this, it's hammer time
    var hammerTime = new Hammer(el);
    hammerTime.on("swipeleft", function(e) {
        e.preventDefault();
        handleSwipeLeft(e);
    });
    hammerTime.on("swiperight", function(e) {
        e.preventDefault();
        handleSwipeRight(e);
    });
    hammerTime.on("pressup", function(e) {
        e.preventDefault();
        handlePressUp(e);
    });
}
var g_slideOutMenu = null;
function closeSlideMenu(e) {
  e.preventDefault();
  if (g_slideOutMenu != null) {
      // we like to move it move it
      g_slideOutMenu.close();
  }
}
window.addEventListener("DOMContentLoaded", function(e) {
    // add listener to the number of player buttons
    var numberPlayersButtons  = document.getElementsByClassName("player-button");
    for (var a = 0; a < numberPlayersButtons.length; a++) {
        numberPlayersButtons[a].addEventListener("click", function(e) {
            g_numberPlayers = parseInt(e.srcElement.value);
            newGame();
        }, false);
    }
    // for each of the plus and minus buttons
    var buttonClasses = ["plus", "minus"];
    for (var b = 0; b < buttonClasses.length; b++) {
        // get all of the buttons by type (plus or minus)
        var buttons  = document.getElementsByClassName(buttonClasses[b]);
        for (var c = 0; c < buttons.length; c++) {
            // for each button we need to add the mouse event handlers
            var btn = buttons[c];
            btn.addEventListener("click", function(e) {
                mousedownChangeValue(e.srcElement);
            }, false);
            // init the touch event handlers
            initTouchyFeelyHandsyStuff(btn);
        }
    }
    // add handler for the animate dead buttons
    var animateDeadButtons  = document.getElementsByClassName("animate");
    for (var d = 0; d < animateDeadButtons.length; d++) {
        animateDeadButtons[d].addEventListener("click", function(e) {
            var btn = e.srcElement;
            var id = btn.dataset.id;
            var el = document.getElementById(id);
            animateDead(el);
        }, false);
    }
    // handle any query params
    handleQueryString();
    // init slide menu
    g_slideOutMenu = new Slideout({
        "panel": document.getElementById("panel"),
        "menu": document.getElementById("menu"),
        "padding": 256,
        "tolerance": 70
    });
    g_slideOutMenu.enableTouch();
    g_slideOutMenu.on("beforeopen", function() {
        this.panel.classList.add("panel-open");
    });
    g_slideOutMenu.on("open", function() {
        this.panel.addEventListener("click", closeSlideMenu);
    });
    g_slideOutMenu.on("beforeclose", function() {
        this.panel.classList.remove("panel-open");
        this.panel.removeEventListener("click", closeSlideMenu);
    });
    // add handler for the fullscreen button
    var fullscreenButton = document.getElementById("fullscreen");
    fullscreenButton.addEventListener("click", function(e) {
        toggleFullScreen();
    }, false);
    // add handler for the replay button
    var replayButton = document.getElementById("replay");
    replayButton.addEventListener("click", function(e) {
        replay(e);
    }, false);
    // add handler for the restart button
    var restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", function(e) {
        restart(e);
    }, false);
    // add handler for the random start button
    var randomButton = document.getElementById("random");
    randomButton.addEventListener("click", function(e) {
        closeSlideMenu(e);
        showFirstPlayerDialog();
    }, false);
    // add handler for the first player dialog button
    var startPlayerButton = document.getElementById("starting_player_dialog_button");
    startPlayerButton.addEventListener("click", function(e) {
        hideFirstPlayerDialog();
    }, false);
    // ooooh, pretty colors
    initColorpicker();
    document.addEventListener("onselectstart", function() {
        return false;
    }, false);
});
