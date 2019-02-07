/*
 * Inbenta SDK
 * (c) 2019 Inbenta <https://www.inbenta.com/>
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  /*--------------------------------------------------
  |          Functions + external libraries
  |---------------------------------------------------
  |
  | >> WARNING!
  |
  | Function and external libraries used to build the
  | application customizations. Please, be carefull if
  | you want to modify this section.
  |
  */

  /**
   *
   * Load script dynamically and instantly trigger a function
   *
   * @param {object} script
   *   Script attributes
   *
   * @param {function} callback
   *   Function to be triggered when the file is completely loaded
   *
   */

  function importScript (script, callback) {
    var dom = document.createElement("script");
    if (callback) { dom.onload = callback; }
    if (script.src) { dom.src = script.src; }
    if (script.type) { dom.type = script.type; }
    if (script.integrity) { dom.integrity = script.integrity; }
    if (script.crossorigin) { dom.crossOrigin = script.crossorigin; }
    document.getElementsByTagName("head")[0].appendChild(dom, document.currentScript);
  }

  /*--------------------------------------------------
  |                  BuildHTML
  |---------------------------------------------------
  |
  | This function creates all the HTML elements that Inbenta 
  | needs in order to work.
  | @components: object of the sdk components configuration
  |
  */
  function buildHTML(components){
    // Create wrapper for all the SDK application
    var inbentaDiv = document.createElement('div');
    inbentaDiv.setAttribute("id", "inbenta-search-wrapper");
    inbentaDiv.setAttribute("class", "inbenta-search-wrapper");

    if (document.querySelector(components.results.container)){
      var divMainTarget = document.querySelector(components.results.container);
      divMainTarget.parentNode.insertBefore(inbentaDiv, divMainTarget);
    } else {
      throw new ReferenceError("The element to load inbenta does not exist");
    }

    // Create div for the autocompleter component if its active
    if (components.autocompleter) {
      var autocompleterParent = document.createElement('div');
      autocompleterParent.setAttribute("id", "inbenta-search-wrapper-autocompleter");
      var inputDiv = document.querySelector(components.autocompleter.input);
      inputDiv.parentNode.insertBefore(autocompleterParent, inputDiv.nextSibling);

      var autocompleterDiv = document.createElement('div');
      autocompleterDiv.setAttribute("id", components.autocompleter.target.substring(1));
      autocompleterDiv.setAttribute("class", components.autocompleter.target.substring(1));

      autocompleterParent.appendChild(autocompleterDiv);
    }
      
    // Create wrapper for the SDK header
    var parentHeader = document.createElement('div');
    parentHeader.setAttribute("id", "inbenta-search-parent-header");
    parentHeader.setAttribute("class", "inbenta-search-parent-header");
    inbentaDiv.appendChild(parentHeader);

    // Create div for the stats component
    var statsDiv = document.createElement('div');
    if (components.stats) {
      statsDiv.setAttribute("id", components.stats.target.substring(1));
      statsDiv.setAttribute("class", components.stats.target.substring(1));
    }
    else {
      statsDiv.setAttribute("id", "inbenta-search-stats");
      statsDiv.setAttribute("class", "inbenta-search-stats");
    }
    parentHeader.appendChild(statsDiv);

    // Create div for the sortBy component if its active
    if (components.sortBy) {
      createDiv(parentHeader, components.sortBy);
    }

    // Create div for the resultsPerPage component if its active
    if (components.resultsPerPage) {
      createDiv(parentHeader, components.resultsPerPage);
    }

    // Create wrapper for the SDK results and filters
    var parentSearch = document.createElement('div');
    parentSearch.setAttribute("id", "inbenta-search-parent");
    parentSearch.setAttribute("class", "inbenta-search-parent");
    inbentaDiv.appendChild(parentSearch);

    // Create div for the filters component if its active
    if (components.filters) {
      createDiv(parentSearch, components.filters);
    }

    // Create wrapper for the SDK results
    var parentResults = document.createElement('div');
    parentResults.setAttribute("id", "inbenta-search-main-results");
    parentResults.setAttribute("class", "inbenta-search-main-results");
    parentSearch.appendChild(parentResults);

    // Create div for the filters component if its active
    if (components.tabs) {
      createDiv(parentResults, components.tabs);
    }

    // Create div for the results component, this component can't be deactivated
    createDiv(parentResults, components.results);

    // Create div for the noResults component if its active
    if (components.noResults) {
      createDiv(parentResults, components.noResults);
    }

    // Create div for the pagination component if its active
    if (components.pagination) {
      createDiv(inbentaDiv, components.pagination);
    }

    // Create div for the router component if its active
    if (components.router) {
      createDiv(parentSearch, components.router);
    }

    // Create div for the loader component if its active
    if (components.loader) {
      createDiv(parentSearch, components.loader);
    }

    // Create div for the instants component if its active
    if (components.instants) {
      createDiv(parentSearch, components.instants);
    }

    // Create div for the lastChance component if its active
    if (components.lastChance) {
      createDiv(parentSearch, components.lastChance);
    }
  }

  /*--------------------------------------------------
  |                  createDiv
  |---------------------------------------------------
  |
  | This function creates a div  
  | needs in order to work.
  | @parent: parent div 
  |
  */
  function createDiv(parent, component) {
    var div = document.createElement('div');
    div.setAttribute("id", component.target.substring(1));
    div.setAttribute("class", component.target.substring(1));
    parent.appendChild(div);
  }

  // EVENT TRIGGER GLOBAL FUNCTION
  function eventTrigger (el, eventName, options) {
    var event;

    // Polyfill CustomEvents for IE11
    (function () {
      if (typeof window.CustomEvent === 'function') { return false; }
      function CustomEvent(event, params) {
        var evt;

        params = params || { bubbles: false, cancelable: false, detail: undefined };
        evt = document.createEvent('CustomEvent');

        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
      return false;
    })();

    if (window.CustomEvent) {
      event = new CustomEvent(eventName, options);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, options);
    }
    el.dispatchEvent(event);
  }

  // EVENT LISTENER GLOBAL FUNCTION
  function eventListener (el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function () {
        handler.call(el);
      });
    }
  }

  /*--------------------------------------------------
  |                  Core Configuration
  |---------------------------------------------------
  |
  | Custom application development, Please, be carefull
  | if you want to modify this section.
  |
  */

  window.inbentaEventTrigger = eventTrigger;
  window.inbentaEventListener = eventListener;

  // Check if conf file exists
  if (typeof window.inbAppSdk === "undefined") {
    throw new ReferenceError("Inbenta SDK couldn't be started, please contact with support for more information.");
  }

  // Retrieve configuration data
  var app = window.inbAppSdk;
  // Declare global variables
  var sdkScript, sdk, results, autocompleter, instants, lastChance;

  if (!app.sdkIntegrity) {
  	sdkScript = {
  	  src: "https://sdk.inbenta.io/search/" + app.sdkVersion + "/inbenta-search-sdk.js",
  	  type: "text\/javascript",
  	};
  }
  else {
  	sdkScript = {
  	  src: "https://sdk.inbenta.io/search/" + app.sdkVersion + "/inbenta-search-sdk.js",
  	  type: "text\/javascript",
  	  integrity: app.sdkIntegrity,
  	  crossorigin: "anonymous"
  	};
  }

  // Import & build SDK
  importScript(sdkScript, function () {
  	switch (document.readyState) {
      case "complete":
        start();
        break;
      default:
        window.onload = function () {
          start();
        };
        break;
    }
  });

  /*--------------------------------------------------
  |                  start
  |---------------------------------------------------
  |
  | Gets the user type depending on the user role and start the SDK
  |
  */
  function start() {
  	// Get Zendesk profile
  	app.sdkConfig.userType = app.userTypes[HelpCenter.user.role];
  	sdk = InbentaSearchSDK.createFromDomainKey(app.sdkAuth.domainKey, app.sdkAuth.publicKey, app.sdkConfig);
    var components = app.appConfig;

    buildHTML(components);
    initSDK(sdk, components);
    initCustomEvents(sdk, components);
  }


  /*--------------------------------------------------
  |                  initSDK
  |---------------------------------------------------
  |
  | Function to initialize the SDK components
  | @sdk object with the sdk initialized
  | @components object with the sdk components configuration
  |
  */
  function initSDK(sdk, components) {
  	// Init results component, this component is required for the application to work
  	results = sdk.component('results', components.results.target, components.results.conf);

  	// Init stats component
  	if (components.stats) {
  		var stats = sdk.component('stats', components.stats.target, components.stats.conf);
  		results.linkTo(stats);
  	}

  	// Init sortBy component
  	if (components.sortBy) {
  		var sortBy = sdk.component('sort-by-selector', components.sortBy.target, components.sortBy.conf);
  		results.linkTo(sortBy);
  	}

  	// Init results per page component
  	if (components.resultsPerPageSelector) {
  		var resultsPerPageSelector = sdk.component('results-per-page-selector', components.resultsPerPageSelector.target, components.resultsPerPageSelector.conf);
  		results.linkTo(resultsPerPageSelector);
  	}

  	// Init filters component
  	if (components.filters) {
  		var filters = sdk.component('refinement-lists', components.filters.target, components.filters.conf);
  		results.linkTo(filters);
  	}

  	// Init tabs component
  	if (components.tabs) {
  		var tabs = sdk.component('refinement-tabs', components.tabs.target, components.tabs.conf);
  		results.linkTo(tabs);
  	}

  	// Init no results component
  	if (components.noResults) {
  		var noResults = sdk.component('no-results', components.noResults.target, components.noResults.conf);
  		results.linkTo(noResults);
  	}

  	// Init pagination component
  	if (components.pagination) {
  		var pagination = sdk.component('pagination', components.pagination.target, components.pagination.conf);
  		results.linkTo(pagination);
  	}

  	// Init router component
  	if (components.router) {
  		var router = sdk.component('router', components.router.target, components.router.conf);
  		results.linkTo(router);
  	}

  	// Init loader component
  	if (components.loader) {
  		var loader = sdk.component('loader', components.loader.target, components.loader.conf);
  		results.linkTo(loader);
  	}

  	// Init instants component
  	if (components.instants) {
  		instants = sdk.component('instants', components.instants.target, components.instants.conf);
  		var instantsInput;
  		components.instants.input.forEach(function(input){
  			instantsInput = document.querySelector(input);
  			instants.linkToInput(instantsInput);
  		});
  	}

  	// Init lastChance component
  	if (components.lastChance) {
  		lastChance = sdk.component('last-chance', components.lastChance.target, components.lastChance.conf);
  		var lastChanceInput;
  		components.lastChance.input.forEach(function(input){
  			lastChanceInput = document.querySelector(input);
  			lastChance.linkToInput(lastChanceInput);
  		});
  	}

  	// Init autocompleter component
  	if (components.autocompleter) {
  		autocompleter = sdk.component('autocompleter', components.autocompleter.target, components.autocompleter.conf);
  		var inputDiv = document.querySelector(components.autocompleter.input);
  		var inbentaSearchInput = inputDiv.cloneNode(false);
  		// If the search is activated replace the search bar
  		if (components.search && components.search.active) {
  			inputDiv.parentNode.insertBefore(inbentaSearchInput, inputDiv.nextSibling);
  			inputDiv.remove();
  			autocompleter.setInputElement(inbentaSearchInput);
  			results.linkTo(autocompleter);
  		}
  		else {
  			autocompleter.setInputElement(inputDiv);
  			results.linkTo(autocompleter);
  		}
  	}
  }

  /*--------------------------------------------------
  |                  initComponent
  |---------------------------------------------------
  |
  | Function to initialize the SDK components
  | @sdk object with the sdk initialized
  | @components object with the sdk components configuration
  |
  */

  /*--------------------------------------------------
  |                  initCustomEvents
  |---------------------------------------------------
  |
  | Function to initialize the SDK custom events
  | @sdk object with the sdk initialized
  | @components with the sdk components configuration
  |
  */
  function initCustomEvents(sdk, components) {
  	var inputDiv = document.querySelector(components.autocompleter.input);
  	if (inputDiv) {
  		inputDiv.addEventListener("keydown", function(e) {
  			// Show autocompleter when the user is typing
  			if (autocompleter) {
  				autocompleter.focus();
  			}
  			if (autocompleter && autocompleter.suggestion && e.which == 13) {
  	      e.preventDefault();
  	      autocompleter.trackClick(autocompleter.suggestion);
  	    }
  		}, true);

  		// Prevent submit of the form and perform a search
  		if (components.search && components.search.active) {
  			inputDiv.form.addEventListener("submit", function(e) {
  				e.preventDefault();
  				results.setQuery(inputDiv.value);
  			});
  		}
  	}

  	results.searchStore.on('result', function () {
  		if (document.querySelector(components.autocompleter.input)) {
  			// Auto scroll when there is a click on pagination
  			document.querySelector(components.autocompleter.input).scrollIntoView();
  			// Add the UQ to the search bar
  			document.querySelector(components.autocompleter.input).value = this.query;
  		}
      // Hide Client's targetelem
  		document.querySelector(components.results.container).style.display = 'none';
  		// Show sortBy and Results per page selector
  		if (this.hasResults) {
  			if (components.sortBy) { document.querySelector('.inbenta-search-sortby').style.display = 'block'; }
  			if (components.resultsPerPageSelector) { document.querySelector('.inbenta-search-results-per-page').style.display = 'block'; }
  		} else {
  			if (components.sortBy) { document.querySelector('.inbenta-search-sortby').style.display = 'none'; }
  			if (components.resultsPerPageSelector) { document.querySelector('.inbenta-search-results-per-page').style.display = 'none'; }
  		}

  		// Hide autocompleter when a search is done
  		if (components.autocompleter) { autocompleter.blur(); }
    });

    var hasSubmit = false;
    //Detect when form submit is clicked
    window.inbentaEventListener(document, 'lastChanceShow', function(e) {
      if (hasSubmit === false){
        if (lastChance) {
          //If there are Last Chances, show them.
          lastChance.show();

          var lastChancesShown = false;
          lastChance.searchStore.on("result", function(){
            lastChancesShown = true;
          });
          // Control if the last Chance have shown or there is a timeout
          setTimeout(function(e){
            if(!lastChancesShown){
              hasSubmit = logContactTicket(sdk, finalQuery, hasSubmit);
            }
          }, 5000);
        }
        else if(instants){
          //If there aren't Last Chances, log a contact_submit and a contact_ticket
          var finalQuery = instants.links[0].element.value;
          for (var i = 1; i < instants.links.length; i++){
            finalQuery += ' . ' + instants.links[i].element.value;
          }
          sdk.client.trackEvent("CONTACT_SUBMIT", {query: finalQuery});
          hasSubmit = logContactTicket(sdk, finalQuery, hasSubmit);
        }
      }
    });

    if (lastChance) {
  	  lastChance.on("submit", function() {
  	    // If the Last Chances submit is clicked log a contact_ticket data key
  	    var finalQuery = lastChance.targets[0].value;
  	    for (var i = 1; i < lastChance.targets.length; i++){
  	      finalQuery += ' . ' + lastChance.targets[i].value;
  	    }
  	    hasSubmit = logContactTicket(sdk, finalQuery, hasSubmit);
  	  });
  	}


  }

  /*--------------------------------------------------
  |                  logContactTicket
  |---------------------------------------------------
  |
  | Function to log the ticket creation (CONTACT_TICKET)
  | @sdk object with the sdk initialized
  | @finalQuery string with the query to log
  |
  */

  function logContactTicket(sdk, finalQuery, hasSubmit){
    sdk.client.trackEvent("CONTACT_TICKET", {query: finalQuery}).then(function(){
      hasSubmit = true;
      window.inbentaEventTrigger(document, 'lastChanceSubmit');
      return hasSubmit;
    });
    setTimeout(function(){
      if (!hasSubmit) {
        hasSubmit = true;
        window.inbentaEventTrigger(document, 'lastChanceSubmit');
        return hasSubmit;
      }
    }, 5000);
  }

  // Create Element.remove() function if not exist
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

})));