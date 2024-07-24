"use strict";

var gStartingLife = null;
var gNumberOfPlayers = 0;
var gPlayers = Array(9).fill(null);
var gSlideOutMenu = null;
var gColorpickerPlayerTile = null;
var gColorpickerCurrentColor = null;
var gGameTimer = null;
var gGameTime = 0;
var gSettingShowColorpicker = true;
var gSettingShowTimer = false;

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
function showMask() {
    show("mask");
}
function hideMask() {
    hide("mask");
}
function getPlayerFromAttribute(el) {
    var playerNumber = el.dataset.player;
    var playerInt = parseInt(playerNumber);
    return getPlayer(playerInt);
}
function getPlayer(playerNumber) {
    if (gPlayers == null || playerNumber < 1 || playerNumber >= gPlayers.length) {
        return null;
    } else {
        return gPlayers[playerNumber];
    }
}
function getPlayerTile(playerNumber) {
    var player = getPlayer(playerNumber);
    if (player == null) {
        return null;
    }
    var tile = player.getTile();
    if (tile == null) {
        return null;
    }
    return tile;
}
function getLifeDiv(playerNumber) {
    var tile = getPlayerTile(playerNumber);
    if (tile == null) {
        return null;
    }
    var lifeDiv = tile.firstElementChild;
    if (lifeDiv == null) {
        return null;
    }
    return lifeDiv;
}
function getButtonsDiv(playerNumber) {
    var lifeDiv = getLifeDiv(playerNumber);
    if (lifeDiv == null) {
        return null;
    }
    var buttonsDiv = lifeDiv.nextElementSibling;
    if (buttonsDiv == null) {
        return null;
    }
    return buttonsDiv;
}
function displayLife(playerNumber, total) {
    var lifeDiv = getLifeDiv(playerNumber);
    if (lifeDiv != null) {
        lifeDiv.innerText = total.toString();
    }
}
function changeLifeInternal(current, change) {
    if (current != null && change != null) {
        var intChange = parseInt(change);
        if (isNaN(intChange)) {
            return current;
        } else {
            var newTotal = current + intChange;
            return newTotal;
        }
    }
}
function playerLayoutHelper(arrClassNames) {
    var allThePlayerTiles = document.getElementsByClassName("tile");
    for (var i=0; i<allThePlayerTiles.length; i++) {
        var playerTile = allThePlayerTiles[i];
        playerTile.className = "tile hidden c" + (i + 1).toString();
        if (i < gNumberOfPlayers) {
            playerTile.classList.remove("hidden");
            var classToAdd = arrClassNames[i];
            playerTile.classList.add(classToAdd);
            if (gSettingShowTimer) {
                playerTile.classList.add("timer");
            }
        }
    }
}
function playerLayoutTwo() {
    var classNames = ["two-t", "two-b"];
    playerLayoutHelper(classNames);
}
function playerLayoutThree() {
    var classNames = ["four-t-l", "four-t-r", "four-b-l"];
    playerLayoutHelper(classNames);
}
function playerLayoutFour() {
    var classNames = ["four-t-l", "four-t-r", "four-b-l", "four-b-r"];
    playerLayoutHelper(classNames);
}
function setLayout() {
    switch (gNumberOfPlayers) {
        case 2:
            playerLayoutTwo();
            break;
        case 3:
            playerLayoutThree();
            break;
        case 4:
            playerLayoutFour();
            break;
    }
}
function initStartingLife() {
    var divs = document.getElementsByClassName("life");
    for (var i=0; i<divs.length; i++) {
        divs[i].innerText = gStartingLife.toString();
    }
}
function initPlayers() {
    var len = gPlayers.length;
    for (var i=1; i<len; i++) {
        if (i > gNumberOfPlayers) {
            gPlayers[i] = null;
        } else {
            var playerTile = document.getElementById("tile" + i.toString());
            var player = new Player(i, gStartingLife, playerTile);
            gPlayers[i] = player;
        }
    }
}
function intToHHMMSS(secondsInt) {
    var hours = Math.floor(secondsInt / 3600);
    var minutes = Math.floor((secondsInt - (hours * 3600)) / 60);
    var seconds = secondsInt - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}
function displayGameTimer() {
    gGameTime = gGameTime + 1;
    var gameTime = intToHHMMSS(gGameTime);
    var timeDiv = document.getElementById("time");
    timeDiv.innerText = gameTime;
}
function restartGameTimer() {
    killGameTimer();
    initGameTimer();
}
function clearGameTimer() {
    window.clearInterval(gGameTimer);
    gGameTimer = null;
}
function resetGameTime() {
    gGameTime = 0;
    var timeDiv = document.getElementById("time");
    timeDiv.innerText = "00:00:00";
}
function killGameTimer() {
    clearGameTimer();
    resetGameTime();
}
function closeGameTimer() {
    hide("time_container");
    killGameTimer();
    gSettingShowTimer = false;
    setLayout();
    show("show_timer");
    hide("hide_timer");
}
function openGameTimer() {
    show("time_container");
    startGameTimer();
    gSettingShowTimer = true;
    setLayout();
    show("hide_timer");
    hide("show_timer");
}
function initGameTimer() {
    gGameTimer = setInterval("displayGameTimer()", 1000);
}
function startGameTimer() {
    if (gGameTimer != null) {
        killGameTimer();
    }
    initGameTimer();
}
function newGame() {
    initPlayers();
    initStartingLife();
    setLayout();
    hide("choose");
    show("play");
    if (gSettingShowTimer) {
        openGameTimer();
    } else {
        displayShowTimerButton();
    }
}
function restart(e) {
    show("choose");
    killGameTimer();
    hide("play");
}
function replay(e) {
    newGame();
}
function displayHideTimerButton() {
    hide("show_timer");
    show("hide_timer");
}
function displayShowTimerButton() {
    hide("hide_timer");
    show("show_timer");
}
function settingShowTimer() {
    displayHideTimerButton();
    openGameTimer();
}
function settingHideTimer() {
    displayShowTimerButton();
    closeGameTimer();
}
function settingShowRandomPlayer() {
    openFirstPlayerDialog();
}
function settingShowColorpicker() {
    gSettingShowColorpicker = true;
    hide("show_colorpicker");
    show("hide_colorpicker");
}
function settingHideColorpicker() {
    gSettingShowColorpicker = false;
    hide("hide_colorpicker");
    show("show_colorpicker");
}
function handleConnectionChange(isOnline) {
    if (isOnline) {
        show("extra_buttons");
    } else {
        hide("extra_buttons");
    }
}
function toggleFullScreen(e) {
    var doc = window.document;
    var docEl = doc.documentElement;
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}
function changeLifeValue(el) {
    var player = getPlayerFromAttribute(el);
    if (el.className.includes("plus") || el.className.includes("animate")) {
        player.changeLife(1);
    } else if (el.className.includes("minus")) {
        player.changeLife(-1);
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
    var startingPlayer = Math.floor(Math.random() * gNumberOfPlayers + 1);
    var text = document.getElementById("starting_player_text");
    text.innerText = "Player " + startingPlayer.toString() + " begins!";
    showFirstPlayerDialog();
}
function closeFirstPlayerDialog() {
    hideFirstPlayerDialog();
}
function showColorpicker() {
    showMask();
    show("colorpicker");
}
function hideColorpicker() {
    hideMask();
    hide("colorpicker");
}
function openColorpicker(el, hex) {
    gColorpickerPlayerTile = el;
    gColorpickerCurrentColor = hex;
    showColorpicker();
    var selectedColor = document.getElementById(hex);
    if (selectedColor != null) {
        selectedColor.focus();
    }
}
function clearColorpickerFocus() {
    var swatches = document.getElementsByClassName("swatch");
    for (var i=0; i<swatches.length; i++) {
        swatches[i].blur();
    }
}
function closeColorpicker() {
    gColorpickerPlayerTile = null;
    gColorpickerCurrentColor = null;
    hideColorpicker();
    clearColorpickerFocus();
}
function colorSelected(el) {
    var selectedColor = el.dataset.color;
    if (gColorpickerPlayerTile != null) {
        gColorpickerPlayerTile.style.backgroundColor = selectedColor;
    }
    closeColorpicker();
}
function RgbStringToHex(rgb) {
    rgb = rgb.substr(4).split(")")[0].split(",");
    var r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
    r = (r.length == 1) ? "0" + r : r;
    g = (g.length == 1) ? "0" + g : g;
    b = (b.length == 1) ? "0" + b : b;
    return "#" + r + g + b;
}
function getCurrentColor(el) {
    if (el != null && el.classList.contains("tile")) {
        return window.getComputedStyle(el).getPropertyValue("background-color");
    }
    return null;
}
function openSlideMenu(e) {
    if (gSlideOutMenu != null) {
        gSlideOutMenu.open();
    }
}
function closeSlideMenu(e) {
    if (gSlideOutMenu != null) {
        gSlideOutMenu.close();
    }
}
function handlePressUp(e) {
    if (gSettingShowColorpicker) {
        var player = getPlayerFromAttribute(e.target);
        var playerTile = player.getTile();
        if (playerTile != null) {
            var currentColorRgb = getCurrentColor(playerTile);
            if (currentColorRgb != null) {
                var hex = RgbStringToHex(currentColorRgb);
                openColorpicker(playerTile, hex);
            }
        }
    }
}
function handleSwipeRight(e) {
    openSlideMenu(e);
}
function handleSwipeLeft(e) {
    closeSlideMenu(e);
}
function initTouchyFeelyHandsyStuffPlusMinus(el) {
    var hammerTime = getHammerTimeSwipe(el);
    hammerTime.add(new Hammer.Tap({ event: "singletap", taps: 1 }));
    hammerTime.add(new Hammer.Press({ event: "pressup", time: 1000 }));
    hammerTime.get("pressup").recognizeWith("singletap");
    hammerTime.get("singletap").requireFailure("pressup");
    hammerTime.on("pressup", function (e) {
        handlePressUp(e);
    });
}
function getHammerTimeSwipe(el) {
    var hammerTime = new Hammer.Manager(el);
    hammerTime.add(new Hammer.Swipe());
    hammerTime.on("swiperight", function (e) {
        handleSwipeRight(e);
    });
    return hammerTime;
}
function initTouchyFeelyHandsyStuffAnimate(el) {
    getHammerTimeSwipe(el);
}
function getStartingLife() {
    var selectStartingLife = document.getElementById("start_life");
    var life = selectStartingLife.options[selectStartingLife.selectedIndex].value;
    var iLife = parseInt(life);
    if (iLife == null || isNaN(iLife) || iLife == "") {
        iLife = 20;
    }
    return iLife;
}
function handleNumberOfPlayersSelection(e) {
    gNumberOfPlayers = parseInt(e.srcElement.value);
    gStartingLife = getStartingLife();
    newGame();
}
function handleError(error) {
    alert("wtf? " + error);
}
function initNumberOfPlayersButtons() {
    try {
        var numberPlayersButtons = document.getElementsByClassName("player-button");
        for (var i = 0; i < numberPlayersButtons.length; i++) {
            numberPlayersButtons[i].addEventListener("click", function (e) {
                handleNumberOfPlayersSelection(e);
            }, false);
        }
    } catch (e) {
        handleError(e);
    }
}
function initSlideMenu() {
    try {
        gSlideOutMenu = new Slideout({
            "panel": document.getElementById("panel"),
            "menu": document.getElementById("menu"),
            "padding": 256,
            "tolerance": 70
        });
        gSlideOutMenu.enableTouch();
        gSlideOutMenu.on("beforeopen", function () {
            this.panel.classList.add("panel-open");
        });
        gSlideOutMenu.on("open", function () {
            this.panel.addEventListener("click", closeSlideMenu, false);
        });
        gSlideOutMenu.on("beforeclose", function () {
            this.panel.classList.remove("panel-open");
            this.panel.removeEventListener("click", closeSlideMenu, false);
        });
    } catch (e) {
        handleError(e);
    }
}
function isStandaloneMode() {
    var returnValue = false;
    if (window.matchMedia('(display-mode: standalone)').matches) {
        returnValue = true;
    }
    if (!returnValue) {
        if (window.navigator.standalone === true) {
            returnValue = true;
        }
    }
    if (!returnValue) {
        if (window.location.search.includes("standalone")) {
            returnValue = true;
        }
    }
    return returnValue;
}
function initSlideMenuButtons() {
    try {
        var replayButton = document.getElementById("reset");
        replayButton.addEventListener("mousedown", function (e) {
            closeSlideMenu(e);
            replay(e);
        }, false);
    } catch (e) {
        handleError(e);
    }
}
function initGameTimerButtons() {
    try {
        var resetTimer = document.getElementById("time_reset");
        resetTimer.addEventListener("click", function (e) {
            restartGameTimer();
        }, false);
        var closeTimer = document.getElementById("time_close");
        closeTimer.addEventListener("click", function (e) {
            closeGameTimer();
        }, false);
    } catch (e) {
        handleError(e);
    }
}
function initPlusMinusButtons() {
    try {
        var buttonClasses = ["plus", "minus"];
        for (var i = 0; i < buttonClasses.length; i++) {
            var buttons = document.getElementsByClassName(buttonClasses[i]);
            for (var j = 0; j < buttons.length; j++) {
                var btn = buttons[j];
                btn.addEventListener("mouseup", function (e) {
                    changeLifeValue(e.srcElement);
                }, false);
                initTouchyFeelyHandsyStuffPlusMinus(btn);
            }
        }
    } catch (e) {
        handleError(e);
    }
}
function initDialogButtons() {
    try {
        var startPlayerButton = document.getElementById("starting_player_button");
        startPlayerButton.addEventListener("click", function (e) {
            closeFirstPlayerDialog();
        }, false);
        var colorpickerCloseButton = document.getElementById("colorpicker_close");
        colorpickerCloseButton.addEventListener("click", function (e) {
            closeColorpicker();
        }, false);
        var showTimerButton = document.getElementById("show_timer");
        showTimerButton.addEventListener("click", function (e) {
            settingShowTimer();
        }, false);
        var hideTimerButton = document.getElementById("hide_timer");
        hideTimerButton.addEventListener("click", function (e) {
            settingHideTimer();
        }, false);
        var showRandomPlayerButton = document.getElementById("random_player");
        showRandomPlayerButton.addEventListener("click", function (e) {
            settingShowRandomPlayer();
        }, false);
        var showColorpickerButton = document.getElementById("show_colorpicker");
        showColorpickerButton.addEventListener("click", function (e) {
            settingShowColorpicker();
        }, false);
        var hideColorpickerButton = document.getElementById("hide_colorpicker");
        hideColorpickerButton.addEventListener("click", function (e) {
            settingHideColorpicker();
        }, false);
        var fullscreenButton = document.getElementById("fullscreen");
        if (isStandaloneMode()) {
            fullscreenButton.classList.add("hidden");
        } else {
            fullscreenButton.addEventListener("mousedown", function (e) {
                toggleFullScreen(e);
            }, false);
        }
    } catch (e) {
        handleError(e);
    }
}
function initColorpicker() {
    try {
        var colorContainer = document.getElementById("colorpicker");
        var bgColorArray = ["#b22222", "#e00000", "#d90073", "#ce9ae4",
            "#911eb4", "#2e86c1", "#0000ff", "#000080",
            "#138d75", "#228b22", "#28b463", "#016171",
            "#fec007", "#fe730e", "#fc6f53", "#f0e68c",
            "#a0522d", "#000000", "#6d7a70", "#ffffff"];
        for (var i = 0; i < bgColorArray.length; i++) {
            var rgbColor = bgColorArray[i];
            var button = document.createElement("input");
            button.id = rgbColor;
            button.type = "button";
            button.className = "swatch";
            button.dataset.color = rgbColor;
            button.style.backgroundColor = rgbColor;
            button.addEventListener("click", function (e) {
                colorSelected(this);
            }, false);
            colorContainer.appendChild(button);
        }
    } catch (e) {
        handleError(e);
    }
}
function initConnection() {
    try {
        window.addEventListener("online", function (e) {
            handleConnectionChange(true);
        }, false);
        window.addEventListener("offline", function (e) {
            handleConnectionChange(false);
        }, false);
    } catch (e) {
        handleError(e);
    }
}
function initPage() {
    try {
        document.addEventListener("onselectstart", function () {
            return false;
        }, false);
    } catch (e) {
        handleError(e);
    }
}
window.addEventListener("DOMContentLoaded", function(e) {
    initNumberOfPlayersButtons();
    initSlideMenu();
    initSlideMenuButtons();
    initGameTimerButtons();
    initPlusMinusButtons();
    initDialogButtons();
    initColorpicker();
    initConnection();
    initPage();
});
class Player {
    constructor(playerNumber, life, tile, color) {
        this.playerNumber = playerNumber;
        this.life = life;
        this.tile = tile;
        this.color = color;
    }
    getPlayerNumber() {
        return this.playerNumber;
    }
    getLife() {
        return this.life;
    }
    changeLife(i) {
        this.life = changeLifeInternal(this.life, i);
        displayLife(this.playerNumber, this.life);
    }
    getTile() {
        return this.tile;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
};
