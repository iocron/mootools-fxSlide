/**
Script: fxSlide.js
	fxSlide (Slideshow) - A very flexible, but simple mootools javascript plugin to slide and animate images or multiple images at once.
	
Version:
	0.3.13

License:
	MIT License (http://www.opensource.org/licenses/mit-license.php)
	
Github:
	https://github.com/iocron/mootools-fxSlide

Copyright:
	Copyright (c) 2009-2013 [ioCron](http://www.iocron.com) and [Pixelmount]http://www.pixelmount.com

Author:
	Sebastian Marek Pieczona

Dependencies:
	Mootools 1.2 Core (or higher): Fx.Tween, Selectors, Element.Dimensions
*/

var fxSlide = new Class({
	Implements: [Options, Events],

	options:{
		elements:[],						// Your slide Elements, e.g. $$(".fxSlide")
		tabs:true,							// Do you need a Tab-Navigation for your Gallery?
		buttons:true,						// Do you need a Button-Navigation for your Gallery?
		imageContainer:"ul",				// Your overall Image Container, e.g. "ul" selects ".fxSlide ul"
		imageElement:"li",					// Your Image Containers, e.g. "li" selects ".fxSlide ul li"
		slideEffect:"slide",				// Choose between different Slide Effects ("slide","alpha" or your own one)
											// If u are using your own effect, then create just a new Method, e.g.:
											// effectExample:function(slideObject,slideElement,slideNum,slideDuration,slideEffect,slideMode){ ... }
		slideDuration:850,					// The duration of the slide effect
		slideTransition:false,				// The transition of your slide effect
		slideDirection:"x",					// Choose between a horizontal (y) or a vertical slide (x)
		slideSize:1,						// How many visible Slides do u want?
		slideStep:"auto",					// How many slides should be jumped forward per Step? (Number)
		slideStart:0,						// Choose where the slide should start
		slideStartRandom:false,				// The gallery starts with a random slide value
		slideAuto:true,						// AutoSlide on or off?
		slideAutoInterval:6000,				// Choose a duration / interval of your AutoSlide Effect
		slideAutoOnHoverIn:"stop",			// Stop the AutoSlide Effect when u hover over a Navigation Element
											// (this includes the tabs, buttons and the slide elements itself)
		slideAutoOnHoverOut:"start",		// Continues the AutoSlide Effect when u hover outside of a Navigation Element
		slideCallback:function(){},			// Use your own Callback when a slide starts, e.g. function(slideObject,slideElement,slideNum,slideDuration,slideEffect,slideMode){ ... }
		initCallback:function(){}			// Use your own Callback on the Initialisation of the Class, e.g. function(slideObject){ ... }
	},
	
	initialize:function(options){
		var self = this;
		this.setOptions(options);
		this.options.elements.each(function(eli,cnt){
			self.initSlide(eli);
		});
	},
	
	initSlide:function(element){
		var self = this;
		var slide = element;
		this.slide = element;
		if(this.options.slideStep == "auto") this.options.slideStep = this.options.slideSize;
		//if(this.options.slideEffect == "alpha") this.options.slideSize = 1;
		slide['options'] = this.options;
		slide['slideAuto'] = this.options.slideAuto;
		slide['slideDirectionXY'] = (this.options.slideDirection == "y") ? "y" : "x";
		slide['slideDirectionCSS1'] = (this.options.slideDirection == "y") ? "top" : "left";
		slide['slideDirectionCSS2'] = (this.options.slideDirection == "y") ? "height" : "width";
		slide['slideDirectionCSS3'] = (this.options.slideDirection == "y") ? "vertical" : "horizontal";
		slide['slideMode'] = "strict";
		slide['content'] = slide.getElement(".fxContent");
		slide['ul'] = slide['content'].getElement(this.options.imageContainer);
		slide['li'] = slide['ul'].getElements(this.options.imageElement);
		slide['liLength'] = slide['li'].length;
		slide['liFirstElement'] = slide['li'][0].addClass("first");
		slide['liLastElement'] = slide['li'][slide['liLength']-1].addClass("last");
		slide['imageDifferenceWidth'] = slide['liFirstElement'].getStyle((this.options.slideDirection == "y") ? "margin-bottom" : "margin-right").toInt();
		slide['liSize'] = slide['liFirstElement'].getSize();
		slide['liWidth'] = slide['liSize'][slide['slideDirectionXY']] + slide['imageDifferenceWidth'];
		slide['liSteps'] = Math.ceil(slide['liLength']/this.options.slideSize);
		slide['contentWidth'] = (slide['liFirstElement'].getStyle("width").toInt() + slide['imageDifferenceWidth']) * slide['liLength'];
		slide['contentOverflowWidth'] = slide['liWidth'] * this.options.slideSize;
		slide['buttons'] = new Element("div",{ "class":"fxButtons" }).inject(slide['content'],"before");
		slide['buttonsPrev'] = new Element("a",{ "class":"fxButtonsBtn fxPrev", "text":"Prev" }).inject(slide['buttons']);
		slide['buttonsNext'] = new Element("a",{ "class":"fxButtonsBtn fxNext", "text":"Next" }).inject(slide['buttons']);
		slide['navCurrent'] = (this.options.slideStartRandom) ? 0 + parseInt(Math.random() * (slide['liLength']-this.options.slideSize+1)) : this.options.slideStart;
		slide['fx'] = new Fx.Tween(slide['ul'],{ duration:this.options.slideDuration, link:"chain", transition:this.options.slideTransition });
		slide['tabs'] = (slide.getElement(".fxTabs") != undefined) ? slide.getElement(".fxTabs") : new Element("div",{ "class":"fxTabs", "html":"<ul></ul>" });
		slide['slideNeeded'] = slide['liLength'] > this.options.slideSize ? true : false;
		
		// DEFAULT INIT for the Different Effects
		switch(this.options.slideEffect){
			case "slide": break;
			case "alpha": break;
			default: break;
		}
		
		// DEFAULT INIT
		if(slide['slideDirectionXY'] == "y") { 
			slide['buttons'].setStyle("width",slide['liSize']['x']+"px");
		} else {
			slide['buttons'].setStyle("height",slide['liSize']['y']+"px");
		}
		
		if(!this.options.tabs || slide['liSteps'] <= 1){
			slide['tabs'].setStyle("display","none");
		} else if(this.options.tabs && slide['tabs'].getElement("ul li") == undefined){
			var tmpLength = slide['liSteps'];
			slide['tabs'].inject(slide,"top");
			
			for(i=0;i<tmpLength;i++){
				new Element("li",{ "html":"<a href='#'>"+(i+1)+"</a>" }).inject(slide['tabs'].getElement("ul"));
			}
		}
		
		slide['ul'].setStyle(slide['slideDirectionCSS2'],slide['contentWidth']+"px");
		([slide['content'],slide['buttons']]).each(function(eli,cnt){ eli.setStyle(slide['slideDirectionCSS2'],slide['contentOverflowWidth']-slide['imageDifferenceWidth']+"px"); });
		slide['buttons'].setStyle("display",(slide['liSteps'] > 1 && this.options.buttons) ? "block" : "none");
		slide['tabs'].setStyle("width",slide['contentOverflowWidth']-slide['imageDifferenceWidth']+"px");
		slide.addClass(slide['slideDirectionCSS3']);
		slide.addClass(this.options.slideEffect);
		
		// BUTTONS and TABS
		if(this.options.buttons){
			slide['buttonsPrev'].addEvent("click",this.prevSlide.bind(this));
			slide['buttonsNext'].addEvent("click",this.nextSlide.bind(this));
		} else {
			slide['buttons'].setStyle("display","none");
		}
		
		if(this.options.tabs && slide['tabs']){
			var tmpTabs = slide['tabs'].getElements("li a").length > 0 ? slide['tabs'].getElements("li a") : slide['tabs'].getElements("li");
			
			tmpTabs.each(function(eli,cnt){
				eli.addEvents({
					"click":function(e){
						e.stop();
						self.showSlide(self.varNavCurrent("strict",cnt));
					},
					"focus":function(e){
						this.blur();
					}
				})
			});
		}
		
		// SET RANDOM / CURRENT PICTURE
		this.showSlide(slide['navCurrent'],0);
		
		// AUTO-SLIDE
		this.autoSlideEvents();
		this.autoSlideStart();
		
		// Init Callback
		this.options.initCallback(self);
	},
	
	autoSlideEvents:function(){
		var self = this;
		var slide = this.slide;
		
		// AUTO-SLIDE on HOVER
		([slide['buttons'],slide['ul'],slide['tabs']]).each(function(eli,cnt){
			eli.addEvent("mouseenter",function(){
				if(self.options.slideAutoOnHoverIn == "start" && self.options.slideAutoOnHoverOut != "start") {
					self.autoSlideStart();
				} else if(self.options.slideAutoOnHoverIn == "stop") {
					self.autoSlideStop();
				}
			})
			eli.addEvent("mouseleave",function(){
				if(self.options.slideAutoOnHoverOut == "start" && self.options.slideAutoOnHoverIn != "start") {
					self.autoSlideStart();
				} else if(self.options.slideAutoOnHoverOut == "stop"){
					self.autoSlideStop();
				}
			})
		});
	},
	
	autoSlideStart:function(){
		var slide = this.slide;
		if(slide['slideAuto']){
			this.autoSlideStop();
			slide['slideAutoID'] = (function(){
				if(this.options.slideAuto){
					this.nextSlide();
				}
			}).periodical(this.options.slideAutoInterval,this,slide);
		}
	},
	
	autoSlideStop:function(){
		var slide = this.slide;
		if(slide['slideAuto']){
			window.clearInterval(slide['slideAutoID']);
		}
	},
	
	prevSlide:function(){
		this.showSlide(this.varNavCurrent("prev"),this.options.slideDuration);
	},
	
	nextSlide:function(){
		this.showSlide(this.varNavCurrent("next"),this.options.slideDuration);
	},
	
	showSlide:function(num,duration){
		var self = this;
		var slide = this.slide;
		var dur = (duration || duration == 0) ? duration : this.options.slideDuration;
		var ef = this.options.slideEffect;
		
		if(slide['slideNeeded']){
			slide['navCurrent'] = num;
			
			switch(ef){
				case "slide": this.effectSlide(num,dur,slide); break;
				case "alpha": this.effectAlpha(num,dur,slide); break;
				default: this[ef](self,slide,num,dur,ef,slide['slideMode']); break;
			}
			
			this.effectTabs(num,slide);
			this.options.slideCallback(self,slide,num,dur,ef,slide['slideMode']);
		}
	},
	
	effectTabs:function(num,slide){
		if(this.options.tabs && slide['tabs']){
			var tabCurrent = Math.ceil(slide['navCurrent']/this.options.slideSize);
			var tabs = slide['tabs'].getElements("ul li");
			
			tabs.removeClass("active");
			if(tabs[tabCurrent]) tabs[tabCurrent].addClass("active");
		}
	},
	
	effectSlide:function(num,duration,slide){
		slide['fx'].options.duration = duration;
		slide['fx'].start(slide['slideDirectionCSS1'],-slide['li'][num].getPosition(slide['ul'])[slide['slideDirectionXY']]+"px");
	},
	
	effectAlpha:function(num,duration,slide){
		
	},
	
	varNavCurrent:function(mode,num){
		var slide = this.slide;
		var navCurrent = navCurrent || navCurrent == 0 ? num : slide['navCurrent'];
		var slideSize = this.options.slideSize;
		var slideStep = this.options.slideStep;
		
		switch(mode){
			case "prev": 
				if(navCurrent == 0){ navCurrent = slide['liLength']-slideSize; }
				else if(navCurrent-slideStep-1 < 0){ navCurrent = 0; }
				else { navCurrent -= slideStep; }
				slide['slideMode'] = "prev";
				break;
				
			case "next":
				if(navCurrent == slide['liLength']-slideSize){ navCurrent = 0; }
				else if(navCurrent+slideStep > slide['liLength']-slideSize){ navCurrent = slide['liLength']-slideSize; }
				else { navCurrent += slideStep; }
				slide['slideMode'] = "next";
				break;
				
			case "strict":
				if(num == 0){ navCurrent = 0; }
				else if(num*slideStep > slide['liLength']-slideSize){ navCurrent = slide['liLength']-slideStep; } 
				else { navCurrent = num*slideStep; }
				slide['slideMode'] = "strict";
				break;
				
			default: break;
		}
		
		return navCurrent;
	}
});