MooTools fxSlide (Slideshow)
============================

fxSlide (Slideshow) - A very flexible, but simple mootools javascript plugin to slide and animate images or multiple images at once.

### Authors

* [Sebastian Marek Pieczona](http://www.iocron.com)

### Features

* Many Configurable Options
* Horizontal and Vertical Slides
* You can slide multiple Items at once (like 4x1 Image-Blocks)
* Automatic Slide Functionality
* Random Slide-Image Feature
* Slide Buttons and "Thumbnails" Functionality
* The slide buttons will be adjusted automatically to your slideshow
* Callback Functionality
* You can define your own html structure, so there is no need to change your existing html code if you have already one on your webpage
* Backward Compatible to old Mootool Versions (1.2+)
* You can use different html elements inside of a slide-block (not tested yet, but it should work without problems)

### Issues

  - The alpha slide function isn't implemented yet

How to use
----------

### Demos

* Open the "demo/" folder and have fun

### Installation

* First you need to include the following scripts
  * js/fxSlide.js (or the minified version fxSlide.min.js)
  * js/mootools.js (or your own mootools core version)
  * img/controller/
  * css/fxSlide.css

* See the "demo/demo.html" for examples, but basically you need to implement the fallowing code into your html file / head:
	<link rel="stylesheet" href="css/fxSlide.css" type="text/css" media="screen" />
	<script type="text/javascript" src="js/mootools.js"></script>
	<script type="text/javascript" src="js/fxSlide.js"></script>

* Implement the fallowing code into your Javascript File (use domready):
	window.addEvent("domready",function(){
		new fxSlide({ 
			elements:$$(".fxSlide")
		});
	});

* If you have a different directory structure, then don't forget to adjust the background-images in your fxSlide.css file

* If you want to change the width / height of your slide elements or the spacing between elements, then simply edit your fxSlide.css file and the fallowing line:
	.fxSlide .fxContent li,.fxSlide .fxContent div.fxImageContainerSingle { width:125px; height:125px; margin-right:10px; }

### Configurable Options

Options

* elements:[],					// Your slide Elements, e.g. $$(".fxSlide")
* tabs:true,					// Do you need a Tab-Navigation for your Gallery?
* buttons:true,					// Do you need a Button-Navigation for your Gallery?
* imageContainer:"ul",				// Your overall Image Container, e.g. "ul" selects ".fxSlide ul"
* imageContainerSingle:"li",			// Your Image Containers, e.g. "li" selects ".fxSlide ul li"
* slideEffect:"slide",				// Choose between different Slide Effects ("slide","alpha" or your own one)
* slideDuration:850,				// The duration of the slide effect
* slideTransition:false,			// The transition of your slide effect
* slideDirection:"x",				// Choose between a horizontal (y) or a vertical slide (x)
* slideSize:1,					// How many visible Slides do u want?
* slideStep:"auto",				// How many slides should be jumped forward per Step? (Number)
* slideStart:0,					// Choose where the slide should start
* slideStartRandom:false,			// The gallery starts with a random slide value
* slideAuto:true,				// AutoSlide on or off?
* slideAutoInterval:6000,			// Choose a duration / interval of your AutoSlide Effect
* slideAutoOnHoverIn:"stop",			// Stop the AutoSlide Effect when u hover over a Navigation Element (this includes the tabs, buttons and the slide elements itself)
* slideAutoOnHoverOut:"start",			// Continues the AutoSlide Effect when u hover outside of a Navigation Element

Events

* slideCallback:function(){},			// Use your own Callback when a slide starts, e.g. function(slideObject,slideNum,slideDuration,slideEffect,slideMode){ ... }
* initCallback:function(){}			// Use your own Callback on the Initialisation of the Class, e.g. function(slideObject){ ... }

