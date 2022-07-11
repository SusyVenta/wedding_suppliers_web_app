# WeddingSuppliersWebApp
Prototype of online retail platform to connect users and wedding suppliers

# Development

## Windows

1) Install node.js (https://nodejs.org/en/download/)
2) add node installation folder to environment variables

## To run:
### Execute `npm init` inside the functions folder, which installs all required modules for you
```
$npm init
```

### Run `firebase emulators:start` to set up firebase emulator for local development

```
$firebase emulators:start
```
This hosts firebase on  http://localhost:5004

## Additional steps for Windows:

```
$firebase serve -p 8080
```

## npm installations(No need to execute)
- npm init
- npm install -g express --save
- npm install -g ejs --save
- npm install -g firebase --save
- npm install -g firebase-tools --save


## Directory
- functions
    - index.js (The app configurations)
    - routings 
    - controllers
    - views (ejs files)
- public
    - assests
    - components
    - js
    - styles

## Reference
- MVC pattern  
  - https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/  
- express.js: routes and controllers 
    - https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

- EJS(Embedded JavaScript templating)
    - https://ejs.co/