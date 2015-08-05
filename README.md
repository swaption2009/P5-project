# P5-FEND Project

URL link to live website: [Click Here](http://swaption2009.github.io/P5-project/) 


## Code Improvements

1. Asynchronous Data Usage
  * implement offline.js to notify User when browser is offline/online
  * show AJAX error in console.log
2. Code improvements
  * "use strict";
  * add var "len" for more efficient iteration (apps.js line 80)


## Implementations

1. Install bower_components to load dependencies, ie. Bootstrap CSS and KnockoutJS
2. Apply Bootstrap CSS for responsive design
  * index.html page
  * Google maps InfoWindow
3. KnockoutJS
  * Live search by restaurant name or address (KO filteredSearch)
  * Add URL link to restaurant's Yelp homepage (KO attr)
4. Google Maps API
  * Add markers from KO data-bind
  * Hover (mouseover) markers to open InfoWindow
  * Stylize InfoWindow using Bootstrap CSS
5. Yelp Business API
  * AJAX implementation
  * Create Bootstrap table to list budiness details, ie. rating, review counts, phone number
  * Click phone number to call restaurants from browser 