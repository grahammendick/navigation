# Isomorphic Navigation
Navigation works just as well on the server as it does on the client. Use it with React and Node to write SEO-friendly apps with fast initial load times.

## Run
Once you've cloned the repository, you can install the dependencies and start the isomorphic example:

    npm install
    npm run build
    npm run start
	
Then visit http://localhost:8080/ in your browser to see isomorphic Navigation in action. If you click a Hyperlink before the JavaScript loads (use dev tools to slow down your connection), the navigation happens on the server. If you click a Hyperlink after the JavaScript loads, the navigation happens on the client. 
