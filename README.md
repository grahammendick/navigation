# Navigation
Navigation is a Web library that adds a State machine layer on top of a Router. It associates a single source of data with the active State. Building Hyperlinks is as easy as changing the State and/or data. Navigation is available for ASP.NET or JavaScript.
## Configuring States

<img src="https://navigation4asp.files.wordpress.com/2015/03/configuringstates.png" alt="Configuring States" align="right" />

Each different view or page in your application is a State. For example, a _'master details'_ UI consists of a _'listing'_ State and a _'details'_ State. Each State has a Route. Navigation needs the Route to communicate with the underlying Router.

Group related States together inside a Dialog and mark one of them as the initial State. A Dialog's purpose will become clear in the next section. Pass your list of Dialogs to Navigation.
```JavaScript
var dialogs = 
[{ key: 'masterDetails', initial: 'listing', states: [
    { key: 'listing', route: 'listing'},
    { key: 'details', route: 'details' }]}];
Navigation.StateInfoConfig.build(dialogs);
```
## Changing State
Your application's home page no doubt has a menu of some kind. Each menu item takes the user to a different functional area. These items correspond to Dialogs. Navigating to a Dialog's initial State is like clicking a menu item. Use a Dialog's key to navigate or to build a Hyperlink that navigates when clicked.
```JavaScript
Navigation.StateController.navigate('masterDetails')
var href = Navigation.StateController.getNavigationLink('masterDetails');
```
<img src="https://navigation4asp.files.wordpress.com/2015/03/changingstate.png" alt="Changing State" align="right" />
Once inside a Dialog, you can use a Transition to move to any other State inside the same Dialog. In a _'master details'_ UI, selecting a record to move to the 'details' State is a Transition. A State has a list of Transitions. Assign a Transition to the State it moves from and specify the State it moves to.
```JavaScript
[{ key: 'masterDetails', initial: 'listing', states: [
    { key: 'listing', route: 'listing', transitions: [
        { key: 'select', to: 'details' }]},
    { key: 'details', route: 'details' }]
}];
```
The same methods used to navigate to a Dialog work for navigating along a Transition. But pass the Transition key instead of the Dialog key. i.e. _'select'_ rather than _'details'_.
```JavaScript
Navigation.StateController.navigate('select');
var href = Navigation.StateController.getNavigationLink('select');
```
Every Transition exits a State. Navigation keeps track of these visited States and builds a trail of a user's journey. You can navigate back along this trail. Pass a parameter indicating how far back to travel.
```JavaScript
Navigation.StateController.navigateBack(1);
var href = Navigation.StateController.getNavigationBackLink(1);
```
The ability to navigate back comes at a cost because the trail appears in the Url. Set a State's trackCrumbTrail property to false to turn it off.
## Changing Data
Usually when a State changes you need to pass some data to the new State. In a _'master details'_ UI, the _'details'_ State needs the id of the record selected from the _'listing'_ State. The navigate methods used to change State also accept the data to pass. 
```JavaScript
Navigation.StateController.navigate('select', { id: 10 });
var href = Navigation.StateController.getNavigationLink('select', { id: 10 });
```
Access the passed data from the StateContext.
```JavaScript
var id = Navigation.StateContext.data.id;
```
<img src="https://navigation4asp.files.wordpress.com/2015/03/changingdata.png" alt="Changing Data" align="right" />
You can't pass data when navigating back. But there's no need because the Navigation trail tracks the data along with the State and restores the old data for you.

Navigating does not have to involve a State change. Refreshing is where only the data changes. For example, going to the second page of master records on the _'listing'_ State.
```JavaScript
Navigation.StateController.refresh({ page: 2 });
var href = Navigation.StateController.getRefreshLink({ page: 2 });
```
That's covered the core Navigation concepts. The code snippets were in JavaScript, but the C# looks similar. Take a look at the _'master details'_ UI code examples for [ASP.NET](https://github.com/grahammendick/navigation/tree/master/NavigationSample) or [JavaScript](https://github.com/grahammendick/navigation/tree/master/NavigationJS/Sample) to see how it all fits together.
## Building Hyperlinks with Navigation Plugins
Navigation is good at generating hrefs. Your UI binding library of choice is good at rendering HTML. Navigation plugins bridge the gap so you can use binding syntax to build Hyperlinks. Take a look at a Hyperlink Component from the [React plugin](https://github.com/martynfrank/navigation/tree/master/NavigationJS/src/react).
```JavaScript
<NavigationLink action="select" toData={{ id: 10 }}>Select</NavigationLink>
```
There are ASP.NET plugins for MVC and Web Forms. There are JavaScript plugins for [Knockout](https://github.com/martynfrank/navigation/tree/master/NavigationJS/src/knockout) and [React](https://github.com/martynfrank/navigation/tree/master/NavigationJS/src/react). If you've written a plugin for any other UI library, please submit a pull request. If you'd like to write a plugin but aren't sure how to get started, get in touch [@grahammendick](https://twitter.com/grahammendick).
## Getting Started
Get Navigation for ASP.NET from NuGet, Install-Package Navigation. This install includes the plugins for MVC and Web Forms.

Navigation for JavaScript is not released yet. But all the code you need is in the [NavigationJS folder](https://github.com/grahammendick/navigation/tree/master/NavigationJS), including the plugins for Knockout and React.
