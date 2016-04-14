# Isomorphic Navigation Code Splitting
Navigation works just as well on the server as it does on the client. Use it with React and Node to write SEO-friendly apps with fast initial load times. Loading all your JavaScript upfront can degrade performance. You can use Navigation React together with Webpack's Code Splitting to lazy load components. 

## Run
Once you've cloned the repository, you can install the dependencies and start the isomorphic code splitting example:

    npm install
    node NavigationServer.js
	
Then visit http://localhost:8080/ in your browser to see isomorphic Navigation code splitting in action.
* If you click a Hyperlink before the JavaScript loads, the navigation happens on the server. If you click a Hyperlink after the JavaScript loads, the navigation happens on the client. 
* Open up the Network tab in your browser's dev tools and watch as a JavaScript file request appears when you first navigate between views.