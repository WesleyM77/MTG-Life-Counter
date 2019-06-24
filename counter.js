/*
// be sure to tip your service workers before you leave
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
        if (reg.installing) {
            console.log('Service worker installing');
        } else if (reg.waiting) {
            console.log('Service worker installed');
        } else if (reg.active) {
            console.log('Service worker active');
        }
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
}
*/
function playerLayoutDefault(activeDivs) {
    // sizes for the default vertical layout
    var defaultVerticalSizes = [null,   "100%", "50%", "33.3%", "25%", "20%", "16.6%", "14.28%", "12.5%"];
    // set the height and display of the active player rows
    for (var i = 0; i < activeDivs.length; i++) {
        activeDivs[i].style.height = defaultVerticalSizes[activeDivs.length];
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
function setPlayerlayout(numberPlayers) {
    // these are the player rows we want to display
    var activeDivs = document.getElementsByClassName("active");
    // select the layout for the total number of players
    switch (numberPlayers) {
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
function setBackgroundAndActive(el, colorIndex) {
    // these are the player colors in order
    var colorClasses = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];
    // mark as active and set the background color clas7
    el.className = "tile active noise " + colorClasses[colorIndex];
}
function setStartingLifeTotal(startingLife) {
    // is this nihilism?
    var life = null;
    if (startingLife != null) {
        // got the life
        life = startingLife;
    } else {
        // get the select element for the starting life total
        var selectStartingLife = document.getElementById("start_life");
        // get the selected value
        var life = selectStartingLife.options[selectStartingLife.selectedIndex].value;
        if (life == null || life == "") {
            // default to 20 life points if we were not able to get the value from the select element
            life = "20";
        }
    }
    // set the value in the life divs
    var lifeDivs = document.getElementsByClassName("life");
    for (var i = 0; i < lifeDivs.length; i++) {
        // you go now, it's your birthday
        lifeDivs[i].innerText = life;
    }
}
function displayRows(numberPlayers, startingLife) {
    // get a collection of all the player rows
    var divs = document.getElementsByClassName("tile");
    // for each player row until we reach the total number of players
    for (var i = 0; i < numberPlayers; i++) {
        // show some fancy backgrounds or something
        setBackgroundAndActive(divs[i], i);
    }
    // set the right layout for the number of players
    setPlayerlayout(numberPlayers);
    // set the starting life total
    setStartingLifeTotal(startingLife);
    // hide the choose number of players container
    var choose = document.getElementById("choose");
    choose.className = "choose hidden";
    // show the top menu button
    var menuButton = document.getElementById("menu_button");
    menuButton.classList.remove("hidden");
    // show the players container
    var play = document.getElementById("play");
    play.className = "play";
    // are you ready to ruuuuuuuummble?
}
function death(id, el) {
    // clear the life total because there is no more life
    el.innerText = "";
    // disable the plus and minus buttons for this player
    var buttons  = document.getElementsByClassName(id);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    // add the dead class so we can see the skull and laugh at them
    el.className = "life dead";
    // display the button for the unearth spell
    var backFromTheDeadButton = el.nextElementSibling.children[2];
    backFromTheDeadButton.className = "animate";
    // we need to change the bg of the parent element
    // this is needed for the six player layout
    el.parentElement.style.backgroundColor = "#000000";
    el.parentElement.classList.remove("noise");
}
function animateDead(id, el, btn) {
    // remove the dead class
    el.className = "life";
    // you start again with 1 life
    el.innerText = "1";
    // enable the plus and minus buttons
    var buttons  = document.getElementsByClassName(id);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
    // hide the resurrection button
    btn.className = "animate hidden";
    // back from black
    el.parentElement.classList.add("noise");
    el.parentElement.removeAttribute("style");
}
function displayLife(id, el, intTotal) {
    // is the player dead yet?
    if (intTotal <= 0) {
        // yes, they drink with the gods in Valhalla
        death(id, el);
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
    if (strCurrentTotal != null && strCurrentTotal != "") {
        // convert the text to an integer
        var intCurrentTotal = parseInt(strCurrentTotal);
        // the amount of change should be an integer too
        var intChange = parseInt(change);
        // maths is hard
        var intNewTotal = intCurrentTotal + intChange;
        // display the new life total, tada!
        displayLife(id, totalDiv, intNewTotal);
    }
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
    // TODO: replay
    closeSlideMenu(e);
}
function restart(e) {
    // TODO: restart
    closeSlideMenu(e);
}
//
// DISABLE PRESS TEMPORARILY
// TODO: instead of adding or subtracting life on press
// will open a menu of actions for that player tile
//
/*
var g_pressTimer = null;
function runPressTimer(e) {
    // change the life total unless it is 2 or less
    // just to be certain the user should manually click
    // the remaining life out of the poor bastard
    var id = e.target.dataset.id;
    var lifeTotalElement = document.getElementById(id);
    var intLifeTotal = parseInt(lifeTotalElement.innerText);
    if (e.target.value == "-" && intLifeTotal <= 2) {
        finishPress(e);
    } else {
        mousedownChangeValue(e.target);
        // if we have a timer already destroy it
        if (g_pressTimer != null) {
            clearPressTimer();
        }
        // take another turn
        g_pressTimer = window.setTimeout(function() {
            runPressTimer(e);
        }, 250);
    }
}
function clearPressTimer() {
    // remove target timer from the game
    window.clearTimeout(g_pressTimer);
    g_pressTimer = null;
}
var g_pressed = false;
function handlePress(e) {
    g_pressed = true;
    // start an infinite combo
    g_pressTimer = window.setTimeout(function() {
        runPressTimer(e);
    }, 500);
}
function handlePressUp(e) {
    finishPress(e);
}
function handlePanEnd(e) {
    finishPress(e);
}
function finishPress(e) {
    if (g_pressed) {
        clearPressTimer();
        g_pressed = false;
    }
}
*/
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
            if (startingLife == null) {
                startingLife = 20;
            }
            // round 1: fight!
            displayRows(numberPlayers, startingLife);
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
/*
    hammerTime.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    hammerTime.on("press", function(e) {
        e.preventDefault();
        handlePress(e);
    });
    hammerTime.on("pressup", function(e) {
        e.preventDefault();
        handlePressUp(e);
    });
    hammerTime.on("panend", function(e) {
        e.preventDefault();
        handlePanEnd(e);
    });
*/
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
            var numberPlayers = parseInt(e.srcElement.value);
            displayRows(numberPlayers, null);
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
            var elem = document.getElementById(id);
            animateDead(id, elem, btn);
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
    var toggleButtons = document.getElementsByClassName("toggle-button");
    for (var f = 0; f < toggleButtons.length; f++) {
        toggleButtons[f].addEventListener("click", function(e) {
            g_slideOutMenu.toggle();
        }, false);
    }
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
});
