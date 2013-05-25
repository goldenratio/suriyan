/**
 * @author: Karthik VJ
 **/


var Main = (function()
{
    "use strict";

    /**
     * @private
     */
    var stage,
        optionsContainer,
        controlsContainer,
        canvasContainer,
        resizeTimer,
        slide,
        server,
        updateButton,
        selectedRes,
        progressBarContainer,
        statusMessage,
        displaySelectBox,
        displayNContainer,
        fullScreenButton,
        playButton,
        pauseButton,
        context,
        mouseTimeOut,
        /**
         * Private Methods
         */
        launchFullScreen,
        cancelFullScreen,
        onPlayClickHandler,
        onPauseClickHandler,
        onFullScreenStateChange,
        onFullScreenToggle,
        stopAutoMouseHide,
        startAutoMouseHide,
        onWindowMouseMove,
        onDisplayBoxChange,
        onUpdateClick,
        initialDisplay,
        showMessage,
        onLoop,
        onWindowResize;

    /**
     * Main
     * @constructor
     */
    function Main() {
        context = this;
    }

    /**
     * Initialize
     * Invoked when window has finished loading
     * @public
     */
    Main.prototype.init = function() {
        console.log("load complete!");
        stage = new createjs.Stage("slate");
        optionsContainer = document.getElementById("options");
        controlsContainer = document.getElementById("controls");
        canvasContainer = document.getElementById("canvasContainer");
        updateButton = document.getElementById("updateButton");
        progressBarContainer = document.getElementById("progressBarContainer");
        statusMessage = document.getElementById("statusMessage");
        displaySelectBox = document.getElementById("display");
        displayNContainer = document.getElementById("displayNValueContainer");
        fullScreenButton = document.getElementById("fullscreenButton");
        playButton = document.getElementById("playButton");
        pauseButton = document.getElementById("pauseButton");

        stage.autoClear = true;

        server = new NOAAServer();
        slide = new ImageSlide(stage, context);
        selectedRes = slide.Res.LOW;

        //slide.start(["http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1800_hmiigr_512.jpg", "http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1500_hmiigr_512a.jpg", "http://sohowww.nascom.nasa.gov//data/REPROCESSING/Completed/2013/hmiigr/20130523/20130523_1500_hmiigr_512.jpg"], selectedRes);

        /*var reqData = new RequestData();
        reqData.resolution = 2;
        reqData.numImg = 10;
        reqData.types = "instrument=EIT:wavelength=171";

        server.send(reqData.generatePostData(), context.serverCallback);*/

        initialDisplay();

        createjs.Ticker.addEventListener(Event.ENTER_FRAME, onLoop);
        updateButton.addEventListener(MouseEvent.CLICK, onUpdateClick, false);
        displaySelectBox.addEventListener(FormEvent.CHANGE, onDisplayBoxChange, false);
        fullScreenButton.addEventListener(MouseEvent.CLICK, onFullScreenToggle, false);
        playButton.addEventListener(MouseEvent.CLICK, onPlayClickHandler, false);
        pauseButton.addEventListener(MouseEvent.CLICK, onPauseClickHandler, false);

        document.addEventListener(Event.WEBKIT_FULLSCREEN, onFullScreenStateChange, false);
        window.addEventListener(Event.RESIZE, onWindowResize, false);

        context.resizeElements();
    };

    /**
     * Invoekd when Play button is clicked
     * @param event
     * @private
     */
    onPlayClickHandler= function(event) {
        slide.play();
    };

    /**
     * Invoked when Pause button is clicked
     * @param event
     * @private
     */
    onPauseClickHandler= function(event) {
        slide.pause();
    };

    /**
     * Invoked when fullscreen state is changed
     * @private
     */
    onFullScreenStateChange = function() {
        var fullScreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        //console.log(fullscreenElement);
        if(fullScreenElement === null) {
            // stop auto mouse hide
            stopAutoMouseHide();

            if(optionsContainer.style.display === "none")
            {
                optionsContainer.style.display = "block";
                controlsContainer.style.display = "block";
                Mouse.show();

                context.resizeElements();
            }
        }
        else {
            startAutoMouseHide();
        }

    };

    /**
     * Invoked when full screen button is toggled
     * @param event
     * @private
     */
    onFullScreenToggle = function(event) {
        //console.log(event);
        var fullScreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        //console.log(fullscreenElement);
        if(fullScreenElement === null) {
            launchFullScreen(document.documentElement); // the whole page
        }
        else {
            cancelFullScreen();
        }
    };

    /**
     * Starts Auto Mouse Hide
     * @private
     */
    startAutoMouseHide = function() {
        window.addEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
    };

    /**
     * Stops auto mouse hide timer
     * @private
     */
    stopAutoMouseHide = function() {
        window.removeEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
        if(mouseTimeOut) {
            clearTimeout(mouseTimeOut);
        }
    };

    /**
     * Invoked mouse is moved over window
     * Called to check to hide mouse
     * @param event
     * @private
     */
    onWindowMouseMove = function(event)
    {
        if(event.webkitMovementX === 0 || event.webkitMovementY === 0) {
            return;
        }
        //console.log(event);
        if(mouseTimeOut) {
            clearTimeout(mouseTimeOut);
        }

        // show controls
        if(optionsContainer.style.display === "none") {
            console.log("mouse move");
            optionsContainer.style.display = "block";
            controlsContainer.style.display = "block";
            Mouse.show();

            context.resizeElements();
        }

        mouseTimeOut = setTimeout(function() {
            console.log("hide controls");

            optionsContainer.style.display = "none";
            controlsContainer.style.display = "none";
            //window.removeEventListener(MouseEvent.MOUSE_MOVE, onWindowMouseMove, false);
            Mouse.hide();

            //startAutoMouseHide();
            context.resizeElements();

        }, 5000);
    };

    /**
     * Invoked when Display selectbox is changed
     * @param event
     * @private
     */
    onDisplayBoxChange = function(event) {
        var displayData = document.getElementById("display").options[document.getElementById("display").selectedIndex].value;
        if(displayData === "3") {
            displayNContainer.style.display = "block";
        }
        else {
            displayNContainer.style.display = "none";
        }
    };

    /**
     * Invoked when Update button is clicked
     * @param event
     * @private
     */
    onUpdateClick = function(event) {
        var resData,
            types,
            displayData,
            numImage,
            reqData;

        resData = document.getElementById("resolution").options[document.getElementById("resolution").selectedIndex].value;
        if(resData === "1") {
            selectedRes = slide.Res.HIGH;
        }
        else if(resData === "2") {
            selectedRes = slide.Res.LOW;
        }


        types = document.getElementById("types").options[document.getElementById("types").selectedIndex].value;
        displayData = document.getElementById("display").options[document.getElementById("display").selectedIndex].value;
        numImage = 0;

        if(displayData === "1") {
            numImage = 1;
        }
        else if(displayData === "2") {
            numImage = 10;
        }
        else if(displayData === "3") {
            numImage = document.getElementById("numValue").value;
        }


        reqData = new RequestData();
        reqData.resolution = resData;
        if(numImage) {
            reqData.numImg = numImage;
        }
        reqData.types = types;

        console.log(reqData);

        context.setPending(true);
        showMessage(MessageType.FETCHING_DATA, true);
        server.send(reqData.generatePostData(), context.serverCallback);

    };

    /**
     * Initial Display
     * Called when the viewer is opened
     * @private
     */
    initialDisplay = function() {
        var resData,
            types,
            reqData;

        resData = document.getElementById("resolution").options[document.getElementById("resolution").selectedIndex].value;
        if(resData === "1") {
            selectedRes = slide.Res.HIGH;
        }
        else if(resData === "2") {
            selectedRes = slide.Res.LOW;
        }

        types = document.getElementById("types").options[document.getElementById("types").selectedIndex].value;
        reqData = new RequestData();

        reqData.resolution = resData;
        reqData.numImg = 1;
        reqData.types = types;

        console.log(reqData);

        context.setPending(true);
        showMessage(MessageType.FETCHING_DATA, true);
        server.send(reqData.generatePostData(), context.serverCallback);
    };


    /**
     * Displays toast like message
     * @param messageType some text
     * @param flag boolean true - show message, false - hide message
     * @private
     */
    showMessage = function(messageType, flag) {
        if(messageType === undefined) {
            messageType = MessageType.FETCHING_DATA;
        }
        if(flag === undefined) {
            flag = false;
        }

        if(flag === true) {
            statusMessage.innerHTML = MessageMap[messageType];
            statusMessage.style.display = "block";
        }
        else {
            statusMessage.style.display = "none";
        }

        context.resizeElements();
    };

    /**
     * ENTER_FRAME liek loop
     * @param event
     * @private
     */
    onLoop = function(event) {
        stage.update();
    };


    /**
     * Calls Request Full Screen
     * @param element
     * @private
     */
    launchFullScreen = function(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    };

    /**
     * Cancels Full Screen
     * @private
     */
    cancelFullScreen = function() {
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        }
        else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };

    /**
     * Invoked when window is re-sized
     * @param event
     * @private
     */
    onWindowResize = function(event) {
        if(resizeTimer)
        {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function()
        {
            console.log("resize");
            context.resizeElements();
        }, 50);

    };

    // ----------------------------
    // Public API starts
    // ----------------------------

    /**
     * Handles NOAA server callback
     * @param data
     * @public
     */
    Main.prototype.serverCallback = function(data) {
        console.log("NOAA callback" + data);
        showMessage(false);
        if(data === MessageMap.ERROR) {
            showMessage(MessageType.ERROR_DATA, true);
            return;
        }

        slide.stop();
        slide.start(data, selectedRes);
    };

    /**
     * Disables / Blocks the screen
     * @param state
     * @public
     */
    Main.prototype.setPending = function(state) {
        if(state === undefined) {
            state = true;
        }
        //draw blocker
        var blocker = document.getElementById("blocker");
        if(state === true) {
            blocker.style.display = "block";
        }
        else {
            blocker.style.display = "none";
        }


    };

    /**
     * Resize all elements to fit screen
     * @public
     */
    Main.prototype.resizeElements = function() {
        //console.log(optionsContainer.offsetHeight);
        //console.log(window.innerHeight);
        var canvasHeight = window.innerHeight - optionsContainer.offsetHeight - controlsContainer.offsetHeight - 10,
            canvasWidth = window.innerWidth;

        stage.canvas.height =  canvasHeight;
        stage.canvas.width = canvasWidth;

        progressBarContainer.style.left = ((canvasWidth >> 1) - (progressBarContainer.offsetWidth >> 1)) + "px";
        progressBarContainer.style.top = ((canvasHeight >> 1) - (progressBarContainer.offsetHeight >> 1)) + "px";

        statusMessage.style.left = ((canvasWidth >> 1) - (statusMessage.offsetWidth >> 1)) + "px";
        statusMessage.style.top = ((canvasHeight >> 1) - (statusMessage.offsetHeight >> 1)) + "px";

        canvasContainer.style.height = canvasHeight.toString() + "px";
        canvasContainer.style.width = canvasWidth.toString() + "px";

        if(slide) {
            slide.resize(canvasWidth, canvasHeight);
        }

        stage.update();

    };



    return Main;

}());

var main = new Main();

function onLoad(event) {
    'use strict';
    main.init();
}
window.addEventListener(Event.LOAD, onLoad, false);
