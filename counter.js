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
        // no more hiding in the shadows
        elem.classList.remove("hidden");
    }
}
function hide(id, el) {
    var elem = el;
    if (elem == null) {
        elem = document.getElementById(id);
    }
    if (elem != null) {
        // back to the shadows you vile beast
        elem.classList.add("hidden");
    }
}
function toggleFullScreen(e) {
    var doc = window.document;
    var docEl = doc.documentElement;
    // look for the available fullscreen properties for the browser
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    // if we are not in fullscreen mode then tell the handy to just make it so
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        // we are already in fullscreen mode so like close it or whatever
        cancelFullScreen.call(doc);
    }
    // we are done with the slidemenu so slide slide slide it away
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
            // if we didn't add enough, then more +1/+1 counters for you
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
// more confusing functions
function showMask() {
    show("mask");
}
function hideMask() {
    hide("mask");
}
function getPlayerTileFromEvent(e) {
    // what were we pressing on?
    var targetButton = e.target;
    // only handle plus / minus button press up events
    if (targetButton != null && (targetButton.classList.contains("plus") || targetButton.classList.contains("minus"))) {
        // get the player tile element that has the class with the background color on it from the page on the site with the stuff
        var playerTile = targetButton.parentElement.parentElement;
        if (playerTile != null && playerTile.classList.contains("tile")) {
            // this returns an element
            return playerTile;
        }
    }
    // this returns 'not-something'
    return null;
}
function getPlayerTileFromClassName(playerTileClass) {
    // throw a pokeball to capture the player tile
    var collectThemAll = document.getElementsByClassName(playerTileClass);
    // this is supposed to be unique so there should
    // only be one player tile to rule them all
    var playerTile = collectThemAll[0];
    // no need for error checking. I'm a wizard
    return playerTile;
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
// 1, 2, 3, 4, 5... 6, 7, 8, 9, 10... 11... 12.
function playerLayoutOne() {
    // one is the loneliest number. maybe you should
    // play with yourself instead of playing by yourself
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
    var classNames = Array(6).fill("six");
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
            // we shouldn't really reach this anymore
            // kind of like the middle of your back
            playerLayoutDefault(activeDivs);
            break;
    }
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
    // get a collection of all the Commander damage badges
    // even though we don't need no stinking badges
    var badges = document.getElementsByClassName("commander-damage");
    // for each Commander damage badge cast some more instants
    for (var j = 0; j < badges.length; j++) {
        // hide it
        badges[j].classList.add("hidden");
        // get the red-headed step-child and spank it
        badges[j].firstElementChild.innerText = "";
    }
}
function setStartingLifeTotal(life) {
    // set the value in the life divs
    var lifeDivs = document.getElementsByClassName("life");
    for (var i = 0; i < lifeDivs.length; i++) {
        // Korn says "got the life..."
        lifeDivs[i].innerText = life;
    }
}
function getStartingLifeTotal(startingLife) {
    // is this nihilism?
    var life = null;
    if (startingLife != null) {
        // we should check the rules to see if this is allowed
        var iLife = parseInt(startingLife);
        // setting the starting life to Force of Nature is just not possible
        if (isNaN(iLife)) {
            life = "20";
        } else {
            if (iLife > 100) {
                // this bowl of porridge is too hot
                life = "100";
            } else if (iLife < 20) {
                // this bowl of porridge is too cold
                life = "20";
            } else {
                // and the third bowl of porridge was just right
                life = startingLife;
            }
        }
    } else {
        // get the select element for the starting life total
        var selectStartingLife = document.getElementById("start_life");
        // get that selected value thingy
        var life = selectStartingLife.options[selectStartingLife.selectedIndex].value;
        // if the universe hates us and we have no life
        if (life == null || life == "") {
            // default to 20 life points because this is a nice number, not a mean number like 7
            life = "20";
        }
    }
    // you gotta give to get
    return life;
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
function changeLife(el, change) {
    // get the div element which has the life total for this player
    var totalDiv = el.parentElement.previousElementSibling.previousElementSibling;
    if (totalDiv != null && totalDiv.className == "life") {
        // get the text content (their current life total)
        var strCurrentTotal = totalDiv.innerText;
        // convert the text to an integer
        var intCurrentTotal = parseInt(strCurrentTotal);
        // the amount of change should be an integer too
        var intChange = parseInt(change);
        // maths is hard
        var intNewTotal = intCurrentTotal + intChange;
        // display the new life total, voila!
        displayLife(totalDiv, intNewTotal);
    }
}
function plusLife(el) {
    // add one to the life total because lifelink or whatever stupid shit
    changeLife(el, 1);
}
function minusLife(el) {
    // subtract one from the life total, oh the horror
    changeLife(el, -1);
}
function mousedownChangeValue(el) {
    // the button class tells us if we need to add or subtract from the life total
    if (el.className.includes("plus")) {
        // we all want more life
        plusLife(el);
    } else if (el.className.includes("minus")) {
        // too many cigarettes or something, you lose life
        minusLife(el);
    }
}
function getCurrentColor(el) {
    // verify a player tile was passed in
    if (el != null && el.classList.contains("tile")) {
        // this returns a rgb string like so "rgb(30, 144, 255)"
        return window.getComputedStyle(el).getPropertyValue("background-color");
    }
    // doh!
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
    // gimme a R! gimme a G! gimme a B! what does that spell? rgb! rgb! rgb!
    return "#" + r + g + b;
}
function changePlayerColor(e) {
    // we set a unique className on the button to help us
    // find the player tile we want to make super-duper
    var playerTileClass = e.target.dataset.cn;
    // also get the hex color from the button
    var hex = e.target.dataset.hx;
    // git er dun
    var playerTile = getPlayerTileFromClassName(playerTileClass);
    // away with you
    closeContextMenu();
    // open your mind wide to the possibilities of
    // infinite colors. if by infinite you mean 20
    openColorpicker(playerTile, hex);
}
// global player change is a serious problem
var g_elPlayerTile = null;
var g_currentColor = null;
function colorSelected(el) {
    var selectedColor = el.dataset.color;
    if (g_elPlayerTile != null) {
        g_elPlayerTile.style.backgroundColor = selectedColor;
    }
    // buh-bye
    closeColorpicker();
}
// these seem kind of redundant
// at least they shouldn't confuse anyone
function showColorpicker() {
    // put on your Guy Fawkes mask
    showMask();
    show("colorpicker");
}
function hideColorpicker() {
    // masks off!
    hideMask();
    hide("colorpicker");
}
function openColorpicker(el, hex) {
    g_elPlayerTile = el;
    g_currentColor = hex;
    // taste the rainbow
    showColorpicker();
    var selectedColor = document.getElementById(hex);
    if (selectedColor != null) {
        // on the dialog we can show which color is the current color so if
        // someone doesn't have a very good memory then it isn't a problem
        selectedColor.focus();
    }
}
function closeColorpicker() {
    // to everything null null null 
    g_elPlayerTile = null;
    g_currentColor = null;
    // the rainbow is gone now
    hideColorpicker();
}
function initColorpicker() {
    var colorContainer = document.getElementById("colorpicker");
    // um, like, y'know... the colors man, the colors
    var bgColorArray = ["#b22222", "#e00000", "#d90073", "#ce9ae4",
                        "#911eb4", "#2e86c1", "#0000ff", "#000080",
                        "#138d75", "#228b22", "#28b463", "#016171",
                        "#fec007", "#fe730e", "#fc6f53", "#f0e68c",
                        "#a0522d", "#000000", "#6d7a70", "#ffffff"];
    // for each color in the array make a shiny button
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
function positionDialog(e) {
    // we need a tutor to find the context menu and we must shuffle our library afterwards
    var contextMenu = document.getElementById("context_menu");
    // we were using negative margin offsets to center the dialog so we should remove them
    contextMenu.style.margin = "0px";
    // get the location of the bad touch
    var xCoord = e.srcEvent.x;
    var yCoord = e.srcEvent.y;
    // do we have a real number?
    if (!isNaN(yCoord) && yCoord > 0) {
        // you must be this high to ride
        var topMin = 18;
        if (yCoord < topMin) {
            yCoord = topMin;
        }
        // don't be a giant
        var windowHeight = window.innerHeight;
        var dialogHeight = window.getComputedStyle(contextMenu).getPropertyValue("height");
        var topMax = windowHeight - parseInt(dialogHeight) - 5;
        if (yCoord > topMax) {
            yCoord = topMax;
        }
        // make sure we are a number
        if (!isNaN(yCoord)) {
            // set to a liberal position on the left
            contextMenu.style.top = yCoord + "px";
        }
    }
    // is this a real number or is it fake news?
    if (!isNaN(xCoord) && xCoord > 0) {
        // we need to display within the viewport
        var leftMin = 5;
        if (xCoord < leftMin) {
            xCoord = leftMin;
        }
        // no fatties
        var windowWidth = window.innerWidth;
        var dialogWidth = window.getComputedStyle(contextMenu).getPropertyValue("width");
        var leftMax = windowWidth - parseInt(dialogWidth) - 20;
        if (xCoord > leftMax) {
            xCoord = leftMax;
        }
        // make sure we are a number
        if (!isNaN(xCoord)) {
            // the dialog enters the battlefield
            contextMenu.style.left = xCoord + "px";
        }
    }
}
function showFirstPlayerDialog() {
    showMask();
    show("starting_player");
}
function hideFirstPlayerDialog() {
    hideMask();
    hide("starting_player");
}
function openFirstPlayerDialog() {
    // summon a Math Random to see who begins
    var startingPlayer = Math.floor(Math.random() * g_numberPlayers + 1);
    // set the text for the glorius, wondrous leader of the game
    var text = document.getElementById("starting_player_text");
    text.innerText = "Player " + startingPlayer.toString() + " begins!";
    // kick some goblins and get them to bring the dialog into view
    showFirstPlayerDialog();
}
function closeFirstPlayerDialog() {
    // bury the dialog
    hideFirstPlayerDialog();
}
// show it, hide it, it is what it is
function showContextMenu(e) {
    showMask();
    show("context_menu");
    positionDialog(e);
}
function hideContextMenu() {
    hideMask();
    hide("context_menu");
}
function openContextMenu(e, el, hex) {
    // bam! context-menu in yo face
    showContextMenu(e);
    // the change color button needs some flavor text
    var colorpickerButton = document.getElementById("color");
    colorpickerButton.dataset.cn = el.className;
    colorpickerButton.dataset.hx = hex;
    // the commander damage button needs some flavor text too
    var commanderButton = document.getElementById("commander");
    commanderButton.dataset.cn = el.className;
}
function closeContextMenu() {
    hideContextMenu();
}
// show, hide, open, close... all the normal positions
function showCommanderDamageDialog() {
    showMask();
    show("commander_damage");
}
function hideCommanderDamageDialog() {
    hideMask();
    hide("commander_damage");
}
function openCommanderDamageDialog(el) {
    // damage plan
    showCommanderDamageDialog();
    // how much Commander damage has this player already had?
    var damageElement = el.children[1].firstElementChild;
    var commanderDamage = damageElement.innerText;
    // if we couldn't get a value then it must be zero
    // lucky for them if it wasn't zero, those bastards
    if (commanderDamage == "") {
        commanderDamage = 0;
    }
    // set the value of the input in the dialog and then take a quick break
    var input = document.getElementById("commander_damage_input");
    input.value = commanderDamage;
    input.focus();
    input.select();
    // set the class on the ok button
    var button = document.getElementById("commander_damage_button");
    button.dataset.cn = el.className;
}
function closeCommanderDamageDialog() {
    hideCommanderDamageDialog();
}
function addCommanderDamage(e) {
    // get the button from the event planner and check their classiness
    var playerTileClass = e.target.dataset.cn;
    var playerTile = getPlayerTileFromClassName(playerTileClass);
    // away with you
    closeContextMenu();
    // special Commander damage stuff
    openCommanderDamageDialog(playerTile);
}
function handleCommanderDamage(e) {
    // everything is ok
    var src = e.srcElement;
    // how much damage did the Commander do to your face?
    var damage = parseInt(src.previousElementSibling.value);
    if (damage != null && damage >= 0) {
        // we need that player tile, badly
        var playerTileClass = src.dataset.cn;
        var playerTile = getPlayerTileFromClassName(playerTileClass);
        var commanderBadge = playerTile.children[1];
        if (damage >= 21) {
            // tear the flair off
            hide(null, commanderBadge);
            // remove all that damage until end of turn
            commanderBadge.firstElementChild.innerText = "";
            // die you monster, die!
            death(playerTile.firstElementChild);
        } else if (damage == 0) {
            // I guess we reset the Commander damage because someone screwed up
            // hide the badge because there is no Commander damage now
            hide(null, commanderBadge);
            // tabula rasa
            commanderBadge.firstElementChild.innerText = "";
        } else {
            // display the badge of shame
            show(null, commanderBadge);
            // show just how bad it is
            commanderBadge.firstElementChild.innerText = damage;
        }
    }
    // sweet dreams little dialog
    closeCommanderDamageDialog();
    // TODO kill player when 21 commander points
}
var g_numberPlayers = 0;
function newGame(startingLife) {
    // display the player tiles we will need and remove the rest from the game
    displayTiles();
    // how much life do we have?
    var life = getStartingLifeTotal(startingLife);
    // display the starting life
    setStartingLifeTotal(life);
    // make sure everyone has a place to sit at the table
    setPlayerlayout();
    // we are done choosing the number of players so make that go away
    hide("choose");
    // let's begin play time, remember to share and play nicely in the sandbox
    show("play");
}
function replay(e) {
    // just one more game, just one more...
    newGame();
    // end step for the menu
    closeSlideMenu(e);
}
function restart(e) {
    // show the choose number of players container
    show("choose");
    // hide the players container
    hide("play");
    // end step for the menu
    closeSlideMenu(e);
}
function death(el) {
    // clear the life total because there is no more life. so sad.
    el.innerText = "";
    // add the death class so we can see the skull and laugh at them
    el.classList.add("death");
    // hide the plus and minus buttons for this player cuz they are tot
    hide(null, el.nextElementSibling.nextElementSibling.children[0]);
    hide(null, el.nextElementSibling.nextElementSibling.children[1]);
    // display the button for the unearth spell, maybe they pull a Jesus
    show(null, el.nextElementSibling.nextElementSibling.children[2]);
}
function animateDead(el) {
    // you start again with 1 life
    el.innerText = "1";
    // sorcery to remove death
    el.classList.remove("death");
    // show the plus and minus buttons for this player cuz they are not tot
    show(null, el.nextElementSibling.nextElementSibling.children[0]);
    show(null, el.nextElementSibling.nextElementSibling.children[1]);
    // hide the resurrection button
    hide(null, el.nextElementSibling.nextElementSibling.children[2]);
}
function handlePressUp(e) {
    // what player tile was pressed?
    var playerTile = getPlayerTileFromEvent(e);
    if (playerTile != null) {
        // what is the current color of the player tile?
        var currentColorRgb = getCurrentColor(playerTile);
        if (currentColorRgb != null) {
            // hexerei
            var hex = RgbStringToHex(currentColorRgb);
            // go baby go!
            openContextMenu(e, playerTile, hex);
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
var g_slideOutMenu = null;
function closeSlideMenu(e) {
  e.preventDefault();
  if (g_slideOutMenu != null) {
      // we like to move it move it
      g_slideOutMenu.close();
  }
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
            var playerTile = e.srcElement.parentElement.previousElementSibling.previousElementSibling;
            animateDead(playerTile);
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
        this.panel.addEventListener("click", closeSlideMenu, false);
    });
    g_slideOutMenu.on("beforeclose", function() {
        this.panel.classList.remove("panel-open");
        this.panel.removeEventListener("click", closeSlideMenu, false);
    });
    // add handler for the fullscreen button
    var fullscreenButton = document.getElementById("fullscreen");
    fullscreenButton.addEventListener("click", function(e) {
        toggleFullScreen(e);
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
        openFirstPlayerDialog();
    }, false);
    // add handler for the first player dialog button
    var startPlayerButton = document.getElementById("starting_player_button");
    startPlayerButton.addEventListener("click", function(e) {
        closeFirstPlayerDialog();
    }, false);
    // ooooh, pretty colors
    initColorpicker();
    var colorpickerCloseButton = document.getElementById("colorpicker_close");
    colorpickerCloseButton.addEventListener("click", function(e) {
        closeColorpicker();
    }, false);
    // context-menu buttons
    var colorButton = document.getElementById("color");
    colorButton.addEventListener("click", function(e) {
        changePlayerColor(e);
    }, false);
    var commanderButton = document.getElementById("commander");
    commanderButton.addEventListener("click", function(e) {
        addCommanderDamage(e);
    }, false);
    var contextMenuCloseButton = document.getElementById("context_menu_close");
    contextMenuCloseButton.addEventListener("click", function(e) {
        closeContextMenu();
    }, false);
    // commander damage controls
    var commanderDamageCloseButton = document.getElementById("commander_damage_close");
    commanderDamageCloseButton.addEventListener("click", function(e) {
        closeCommanderDamageDialog();
    }, false);
    var commanderDamageOkButton = document.getElementById("commander_damage_button");
    commanderDamageOkButton.addEventListener("click", function(e) {
        handleCommanderDamage(e);
    }, false);
    // just don't
    document.addEventListener("onselectstart", function() {
        return false;
    }, false);
});
