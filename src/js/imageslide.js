/**
 * @author: Karthik VJ
 */

var ImageSlide = (function() {
   "use strict";

    /**
     * @private
     */
    var stage,
        container,
        selectedRes,
        queue,
        context,
        progressBar,
        progressBarContainer,
        canvasProp,
        currentImageCount = 0,
        totalImages = 0,
        timeDelay = 100,
        timer,
        timeLine,
        thisObject,
        /**
         * Private methods
         */
        onSliderChange,
        clearImage,
        onError,
        handleComplete,
        showImage,
        startTimer,
        onProgress;

    /**
     * Image Slide
     * @param stageRef
     * @param contextRef
     * @constructor
     */
    function ImageSlide(stageRef, contextRef) {
        if(stageRef === undefined) {
            console.log("stage ref is required");
            return;
        }

        this.Res = {
            LOW : 512,
            HIGH : 1024
        };

        thisObject = this;

        canvasProp = new Rectangle();
        progressBarContainer = document.getElementById("progressBarContainer");
        progressBar = document.getElementById("progressBar");
        progressBar.value = 0;

        timeLine = document.getElementById("timeLine");
        context = contextRef;

        stage = stageRef;
        console.log("slide");

        container = new createjs.Container();
        stage.addChild(container);

        timeLine.addEventListener(FormEvent.CHANGE, onSliderChange, false);

    }

    /**
     * Invoked when Range UI is changed
     * @param event
     * @private
     */
    onSliderChange = function(event) {
        //console.log(event);
        //console.log(timeLine.value);
        thisObject.pause();
        if(totalImages > 1) {
            showImage(timeLine.value - 1);
        }

    };

    /**
     * Starts loading sequence of images
     * @param imageList
     * @param res
     * @public
     */
    ImageSlide.prototype.start = function(imageList, res) {
        context.setPending(true);
        clearImage();

        progressBarContainer.style.display = "block";
        progressBarContainer.style.left = ((canvasProp.width >> 1) - (progressBarContainer.offsetWidth >> 1)) + "px";
        progressBarContainer.style.top = ((canvasProp.height >> 1) - (progressBarContainer.offsetHeight >> 1)) + "px";

        currentImageCount = 0;
        totalImages = imageList.length;
        timeLine.min = 1;
        timeLine.max = totalImages;
        timeLine.value = 1;

        selectedRes = res;
        queue = new createjs.LoadQueue(true);
        queue.addEventListener(Event.COMPLETE, handleComplete);
        queue.addEventListener(Event.PROGRESS, onProgress);
        queue.addEventListener(Event.ERROR, onError);
        var i;
        for(i = 0; i < imageList.length; i++) {
            queue.loadManifest([
                {id: "image_" + i, src: imageList[i]}
            ], false);
        }

        queue.load();

    };

    /**
     * Stops the image slide timer
     * @public
     */
    ImageSlide.prototype.stop = function() {
        clearImage();
        if(timer)
        {
            clearTimeout(timer);
        }

        totalImages = 0;
        currentImageCount = 0;
    };

    /**
     * Pauses the image slide
     * @public
     */
    ImageSlide.prototype.pause = function() {
        if(timer) {
            clearTimeout(timer);
        }
    };

    /**
     * Plays image slide
     * @public
     */
    ImageSlide.prototype.play = function() {
        if(totalImages > 1) {
            showImage();
        }

    };

    /**
     * Clear the display container of image and clear timer
     * @private
     */
    clearImage = function() {
        if(timer) {
            clearTimeout(timer);
        }

        container.removeAllChildren();
    };

    /**
     * Invoked when a image fails to load
     * @private
     */
    onError = function() {
        console.log(queue.type);
        console.log(queue.item);
        console.log(queue.error);
    };

    /**
     * Invoked when all images are loaded, preloaded is done loading
     * @private
     */
    handleComplete = function() {
        console.log("all load complete");
        progressBarContainer.style.display = "none";
        context.setPending(false);

        currentImageCount = 0;
        showImage();
    };

    /**
     * Displays image to canvas
     * @param index
     * @private
     */
    showImage = function(index) {
        clearImage();
        if(index !== undefined) {
            currentImageCount = index;
        }

        if(currentImageCount >= totalImages) {
            currentImageCount = 0;
        }
        var result,
            image;

        result = queue.getResult("image_" + currentImageCount);
        if(!result) {
            console.log("image not loaded");
            // next image
            currentImageCount++;
            showImage();
            return;
        }

        image = new createjs.Bitmap(result);
        container.addChild(image);

        if(index === undefined) {
            timeLine.value = currentImageCount + 1;
        }


        thisObject.resize();

        if(totalImages > 1 && index === undefined) {
            startTimer();
        }

    };

    /**
     * Starts the image slide timer
     * @private
     */
    startTimer = function() {
        //console.log("timer");

        timer = setTimeout(function() {
            currentImageCount++;
            showImage();
        }, timeDelay);
    };

    /**
     * Invoked when image loading is in progress
     * @private
     */
    onProgress = function() {
        console.log("loading.. " + queue.progress);
        progressBar.value = Math.floor(queue.progress * 100);
    };

    /**
     * Invoked when window is re-sized
     * @param canvasWidth
     * @param canvasHeight
     * @public
     */
    ImageSlide.prototype.resize = function(canvasWidth, canvasHeight) {
        //var selectedRes = Res.HIGH;
        if((canvasWidth !== undefined) && (canvasHeight !== undefined)) {
            canvasProp.width = canvasWidth;
            canvasProp.height = canvasHeight;
        }


        if(canvasProp.width < selectedRes || canvasProp.height < selectedRes) {
            var val,
                percent;

            val = canvasProp.width < canvasProp.height ? canvasProp.width : canvasProp.height;
            percent = ((val / selectedRes) * 100) / 100;

            container.scaleX = percent;
            container.scaleY = container.scaleX;

            container.x = (canvasProp.width >> 1) - (val >> 1);
            container.y = (canvasProp.height >> 1) - (val >> 1);
        }
        else {
            container.scaleX = 1;
            container.scaleY = container.scaleX;

            container.x = (canvasProp.width >> 1) - (selectedRes >> 1);
            container.y = (canvasProp.height >> 1) - (selectedRes >> 1);
        }


    };


    return ImageSlide;
}());