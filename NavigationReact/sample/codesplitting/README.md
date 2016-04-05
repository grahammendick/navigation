# Navigation Code Splitting
Loading all your JavaScript upfront can degrade performance. You can use Navigation React together with Webpack's Code Splitting to lazy load components. 

## Run
Once you've cloned the repository, you can install the dependencies and start the code splitting example:

    npm install
    npm run build
	
Then open app.html to see code splitting Navigation in action. Open up the Network tab in your browser's dev tools and watch as a JavaScript file request appears when you first navigate between views.