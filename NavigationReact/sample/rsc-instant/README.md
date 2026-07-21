# Navigation RSC Instant 
Try out instant Navigation in RSC's.

## Run
Once you've cloned the repository, you can install the dependencies and start the instant Navigation RSC example:

    npm install
    npm run build
    npm run start
	
Then visit http://localhost:3001/ in your browser to see instant Navigation in RSC's in action. Client `SceneViews` with `Suspense` boundaries are shown instantly with fallbacks while child server `SceneViews` stream in.
