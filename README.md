# Navigation
Navigation is a Web library that adds a State machine layer on top of a Router. It associates a single source of data with the active State. Building Hyperlinks is as easy as changing the State and/or data. Navigation is available for ASP.NET or JavaScript.

## [Navigation for JavaScript](http://grahammendick.github.io/navigation/)
The best way to get started is with the [interactive tutorial](http://grahammendick.github.io/navigation/tutorial/configuringstates.html). It's a set of coding exercises that will turn you from Navigation zero to Navigation hero in next to no time.

### Build
Once you've cloned the repository, you can install the dependencies and run the build:

    npm install
    npm run build

Running `npm test` will execute the unit tests.

### Code
You'll find the source code in the NavigationJS folder. It's written in TypeScript and is built on top of node.js. The NavigationAngular, NavigationKnockout and NavigationReact folders contain the source code for the plugins. 

### Examples
There are some basic [live examples](http://grahammendick.github.io/navigation/example/angular/navigation.html) for Angular, Knockout and React to get you going. There are more sophisticated examples in the sample folder of each plugin.

## Navigation for ASP.NET
Navigation started out as an ASP.NET project on CodePlex. The Navigation for ASP.NET [documentation](https://navigation.codeplex.com/documentation) still lives on CodePlex - for now.

### Code
After opening the Navigation solution, you'll find the source code in the Navigation project. This contains all the Web Forms, MVC and Web Api code. There are plans to restructure it so that the Navigation project contains just the core code, with separate projects for the NavigationWebForms, NavigationMVC and NavigationWebApi plugins.

### Examples
You can see the code in action by downloading the basic [samples](https://navigation.codeplex.com/documentation) for Web Forms and MVC. Alternavitely, you can debug through the Navigation code by running the more sophisticated examples in the NavigationSample project.
