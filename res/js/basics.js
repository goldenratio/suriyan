/**
 * Basics.js
 * A simple helper javascript file which contains following:
 * - all the event name constants (mimics AS3 events).
 *
 * - Disable console log.
 * @usage:
 *      console.disable();
 *
 * - Show / Hide Mouse Cursor
 * @usage:
 *      Mouse.hide();
 *      Mouse.show();
 *
 * @author: Karthik VJ
 **/


// Event name constants (mimics AS3 Events)
/**
 * Window related events
 */
var Event = {
    LOAD : 'load',
    UNLOAD : 'unload',
    COMPLETE : 'complete',
    PROGRESS : 'progress',
    FILE_PROGRESS : 'fileprogress',
    FILE_LOAD : 'fileload',
    FILE_START : 'filestart',
    LOADS_START : 'loadstart',
    ERROR : 'error',
    ABORT : 'abort',
    RESIZE : 'resize',
    FULLSCREEN : 'fullscreenchange',
    WEBKIT_FULLSCREEN : 'webkitfullscreenchange',
    ENTER_FRAME : 'tick' //for createjs
};

/**
 * Mouse Related Events
 */
var MouseEvent = {
    CLICK : 'click',
    RIGHT_CLICK : 'contextmenu',
    DOUBLE_CLICK : 'dblclick',
    MOUSE_DOWN : 'mousedown',
    MOUSE_UP : 'mouseup',
    MOUSE_MOVE : 'mousemove',
    MOUSE_OVER : 'mouseover',
    MOUSE_OUT : 'mouseout',
    DRAG_MOVE : 'drag',
    DRAG_START : 'dragstart',
    DRAG_END : 'dragend',
    DRAG_ENTER : 'dragenter',
    DRAG_LEAVE : 'dragleave',
    DRAG_OVER : 'dragover',
    DRAG_DROP : 'drop',
    MOUSE_WHEEL : 'mousewheel',
    SCROLL : 'scroll'
};

/**
 * Keyboard related events
 */
var KeyboardEvent = {
    KEY_DOWN : 'keydown',
    KEY_UP : 'keyup',
    KEY_PRESS : 'keypress'
};

/**
 * Form related events
 */
var FormEvent = {
    BLUR : 'blur',
    CHANGE : 'change',
    FOCUS : 'focus',
    RESET : 'reset',
    SELECT : 'select',
    SUBMIT : 'submit'
};


var console = console || {};
/**
 * Disable console log
 */
console.disable = function()
{
    console.log = function() {};
    console.warn = function() {};
    console.info = function() {};
    console.error = function() {};
};

/**
 * Mouse related stuffs
 * @usage:
 * Mouse.hide();
 * Mouse.show();
 */
function Mouse()
{

}
Mouse.hide = function()
{
    if(document)
    {
        document.body.style.cursor = "none";
    }
}

Mouse.show = function()
{
    if(document)
    {
        document.body.style.cursor = "auto";
    }
}

var Point = function(x, y)
{
    this.x = x;
    this.y = y;
};

var Rectangle = function(x, y, width, height)
{
    if(x === undefined) x = 0;
    if(y === undefined) y = 0;
    if(width === undefined) width = 0;
    if(height === undefined) height = 0;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};




