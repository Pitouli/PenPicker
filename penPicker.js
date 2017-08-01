// call as : var myPenPicker = new PenPicker(callback(color,width){}, DOMelement [,options]);

// Create an immediately invoked functional expression to wrap our code
(function () {

	// Define our constructor
	this.PenPicker = function () {

		// Create global element references

		this.penWidth = null;
		this.penColor = null;
		this.penWidthPreview = null;
		this.penColorPreview = null;

		this.callback = null;
		this.options = null;

		// The Plugin DOM
		this.penPicker = null;
		this.penPickerBox = null;
		this.penPreviewBox = null;
		this.penPreview = null;
		this.widthSelectorBox = null;
		this.widthSelectorHead = null;
		this.widthSelector = null;
		this.widthHandle = null;
		this.colorSelectorBox = null;
		this.colorSelectorRainbow = null;
		this.colorSelectorNB = null;
		this.colorSelectorEraser = null;
		this.colorHandle = null;
		this.doubleSelectorBox = null;

		// Binded Listeners
		this.bindedSelectorMove = selectorMove.bind(this);

		// Define option defaults
		var defaults = {
			penWidth: 30,
			penColor: "hsl(0,100%,50%)",
			maxWidth: 260,
			maxHeight: 260,
			colorRainbow: true,
			colorBlackWhite: true,
			colorEraser: true,
			debug: false
		}

		// We check we have a first parameter and it is a callback function
		if (arguments[0] && typeof arguments[0] === "function") {
			this.callback = arguments[0];
		}
		else {
			throw "Callback Undefined";
		}

		// We check we have a second parameter and it is a DOM element
		if (arguments[1] && typeof arguments[1] === "object" && arguments[1].tagName) {
			this.penPicker = arguments[1];
		}
		else {
			throw "DOM Element Undefined";
		}

		// Create options by extending defaults with the passed in arugments
		if (arguments[2] && typeof arguments[2] === "object") {
			this.options = extendDefaults(defaults, arguments[2]);
		}
		else {
			this.options = defaults;
		}

		// Define start width and color
		this.penWidth = this.options.penWidth;
		this.penWidthPreview = this.penWidth;
		this.penColor = this.options.penColor;
		this.penColorPreview = this.penColor;

		// Start
		buildDOM.bind(this)();
		setPenPreview.bind(this)(this.penWidth, this.penColor);
		enablePenPicker.bind(this)();

		if (this.options.debug) { console.log("Picker created") };
	};

	// PUBLIC METHODS

	PenPicker.prototype.doNothing = function () {
		// open code goes here
	};

	// PRIVATE METHODS

	// Build the DOM tree
	function buildDOM() {

		this.penPicker.classList.add("PP-penPicker");

		this.penPickerBox = document.createElement("div");
		this.penPicker.appendChild(this.penPickerBox);
		this.penPickerBox.classList.add("PP-penPickerBox");

		this.penPreviewBox = document.createElement("div");
		this.penPickerBox.appendChild(this.penPreviewBox);
		this.penPreviewBox.classList.add("PP-penPreviewBox");

		this.penPreview = document.createElement("div");
		this.penPreviewBox.appendChild(this.penPreview);
		this.penPreview.classList.add("PP-penPreview");

		this.widthSelectorBox = document.createElement("div");
		this.penPickerBox.appendChild(this.widthSelectorBox);
		this.widthSelectorBox.classList.add("PP-widthSelectorBox");

		this.widthSelectorHead = document.createElement("div");
		this.widthSelectorBox.appendChild(this.widthSelectorHead);
		this.widthSelectorHead.classList.add("PP-widthSelectorHead");

		this.widthSelector = document.createElement("div");
		this.widthSelectorBox.appendChild(this.widthSelector);
		this.widthSelector.classList.add("PP-widthSelector");

		this.widthHandle = document.createElement("div");
		this.widthSelectorBox.appendChild(this.widthHandle);
		this.widthHandle.classList.add("PP-widthHandle");
		this.widthHandle.classList.add("PP-handle");
		this.widthHandle.classList.add("PP-vertical");

		this.colorSelectorBox = document.createElement("div");
		this.penPickerBox.appendChild(this.colorSelectorBox);
		this.colorSelectorBox.classList.add("PP-colorSelectorBox");

		this.colorSelectorRainbow = document.createElement("div");
		this.colorSelectorBox.appendChild(this.colorSelectorRainbow);
		this.colorSelectorRainbow.classList.add("PP-colorSelectorRainbow");

		this.colorSelectorNB = document.createElement("div");
		this.colorSelectorBox.appendChild(this.colorSelectorNB);
		this.colorSelectorNB.classList.add("PP-colorSelectorNB");

		this.colorSelectorEraser = document.createElement("div");
		this.colorSelectorBox.appendChild(this.colorSelectorEraser);
		this.colorSelectorEraser.classList.add("PP-colorSelectorEraser");

		this.colorHandle = document.createElement("div");
		this.colorSelectorBox.appendChild(this.colorHandle);
		this.colorHandle.classList.add("PP-colorHandle");
		this.colorHandle.classList.add("PP-handle");
		this.colorHandle.classList.add("PP-horizontal");

		this.doubleSelectorBox = document.createElement("div");
		this.penPickerBox.appendChild(this.doubleSelectorBox);
		this.doubleSelectorBox.classList.add("PP-doubleSelectorBox");

	};

	function enablePenPicker() {
		if (this.options.debug) { console.log("Enable Picker") };
		// PenPicker listen to opening events
		this.penPicker.addEventListener("mouseenter", openPenPicker.bind(this), false);
		this.penPicker.addEventListener("mousedown", openPenPicker.bind(this), false);
		this.penPicker.addEventListener("touchstart", openPenPicker.bind(this), false);
		// PenPicker listen to closing events
		this.penPicker.addEventListener("mouseleave", closePenPicker.bind(this), false);
		this.penPicker.addEventListener("touchleave", closePenPicker.bind(this), false);
		this.penPicker.addEventListener("touchcancel", closePenPicker.bind(this), false);
		this.penPicker.addEventListener("mouseup", saveAndClosePenPicker.bind(this), false);
		this.penPicker.addEventListener("touchend", saveAndClosePenPicker.bind(this), false);
	};

	function openPenPicker() {
		if (this.options.debug) { console.log("Open Picker") };
		this.penPicker.classList.add("PP-open");
		this.penPicker.addEventListener("mousemove", this.bindedSelectorMove, false);
		this.penPicker.addEventListener("touchmove", this.bindedSelectorMove, false);
	};

	function saveAndClosePenPicker() {
		if (this.options.debug) { console.log("Save Picker") };
		this.penWidth = this.penWidthPreview;
		this.penColor = this.penColorPreview;
		this.callback(this.penColor, this.penWidth);
		closePenPicker.bind(this)();
	};

	function closePenPicker() {
		if (this.options.debug) { console.log("Close Picker") };
		setPenPreview.bind(this)(this.penWidth, this.penColor);
		this.penPicker.classList.remove("PP-open");
		this.penPicker.classList.add("PP-colorTransition");
		this.penPicker.classList.add("PP-widthTransition");
		this.penPicker.removeEventListener("mousemove", this.bindedSelectorMove, false);
		this.penPicker.removeEventListener("touchmove", this.bindedSelectorMove, false);
	};

	function selectorMove(e) {

		if (!(e.pageX || e.pageY)) {
			e.pageX = e.touches[0].pageX;
			e.pageY = e.touches[0].pageY;
		}

		var widthSelectorRect = this.widthSelectorBox.getBoundingClientRect();
		var y = widthSelectorRect.bottom - e.pageY;

		var colorSelectorRect = this.colorSelectorBox.getBoundingClientRect();
		var x = e.pageX - colorSelectorRect.left;

		if (this.options.debug) { console.log("X : "+x+" ; Y : "+y) };

		if (x < -60 || y < -60 || x > 200 || y > 200 || (x < 0 && y < 0)) {
			this.penPicker.classList.add("PP-colorTransition");
			this.penPicker.classList.add("PP-widthTransition");
			setPenPreview.bind(this)(this.penWidth, this.penColor);
		}
		else if (y < 0) {
			this.penPicker.classList.remove("PP-colorTransition");
			this.penPicker.classList.add("PP-widthTransition");
			setPenPreview.bind(this)(this.penWidth, xToColor.bind(this)(x));
		}
		else if (x < 0) {
			this.penPicker.classList.add("PP-colorTransition");
			this.penPicker.classList.remove("PP-widthTransition");
			setPenPreview.bind(this)(yToWidth.bind(this)(y), this.penColor);
		}
		else {
			this.penPicker.classList.remove("PP-colorTransition");
			this.penPicker.classList.remove("PP-widthTransition");
			setPenPreview.bind(this)(yToWidth.bind(this)(y), xToColor.bind(this)(x));
		}

	};

	function xToColor(x) {
		if (x < 10) {
			this.colorHandle.style.left = "10px";
			return "hsl(0,100%,50%)";
		}
		else if (x < 112.5) {
			x = Math.min(x, 110);
			this.colorHandle.style.left = x + "px";
			return "hsl(" + Math.round((x - 10) * 3.6) + ",100%,50%)";
		}
		else if (x < 157.5) {
			x = Math.max(Math.min(x, 155), 115);
			this.colorHandle.style.left = x + "px";
			return "hsl(360,0%," + Math.round(100 - (x - 115) / 40 * 100) + "%)";
		}
		else {
			this.colorHandle.style.left = "170px";
			return "transparent";
		}
	};

	function yToWidth(y) {
		if (y < 10) {
			this.widthHandle.style.bottom = "10px";
			return 1;
		}
		else if (y > 170) {
			this.widthHandle.style.bottom = "170px";
			return 40;
		}
		else {
			this.widthHandle.style.bottom = y + "px";
			return ((y - 10) / 160) * 40;
		}
	};

	function setPenPreview(width, color) {
		if (this.options.debug) { console.log("Preview") };
		if (width) {
			this.penWidthPreview = width;
			this.penPreview.style.width = width + "px";
			this.penPreview.style.height = width + "px";
		}
		if (color) {
			this.penColorPreview = color;
			this.penPreview.style.backgroundColor = color;
			if (color == "transparent") {
				this.penPreview.style.borderWidth = "1px";
			}
			else {
				this.penPreview.style.borderWidth = "0px";
			}
		}
	};

	// Utility method to extend defaults with user options
	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	};

}());

// Prevent Safari scroll
document.ontouchmove = function (event) {
	event.preventDefault();
}