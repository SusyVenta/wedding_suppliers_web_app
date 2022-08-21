# WeddingSuppliersWebApp
Prototype of online retail platform to connect users and wedding suppliers
Commit history: https://github.com/SusyVenta/wedding_suppliers_web_app/commits/main

Project Console: https://console.firebase.google.com/project/wedding-suppliers-web-app/overview
Hosting URL: https://wedding-suppliers-web-app.web.app


# Development   

## Windows

1) Install node.js (https://nodejs.org/en/download/)
2) add node installation folder to environment variables

## To run:
### Execute `npm init` inside the functions folder, which installs all required modules for you
```
$npm init
```

## To deploy:

```
$cd /functions/
$firebase deploy
```

### Configurations needed when testing

1) add file `functions\firebaseConfig.js` to your repository. Content of this file can be found in Trello board, first column. This file contains the necessary config info in order to connect to the database. Content:

```
const config = {
    apiKey: '<key>',
    authDomain: '<key>',
    projectId: '<key>',
    storageBucket: '<key>',
    messagingSenderId: '<key>',
    appId: '<key>',
    measurementId: '<key>'
};

module.exports = {
    testConfig: config
}
```

2) add file `public\firebaseConfig.js` to your repository. Content of this file can be found in Trello board, first column. This file contains the necessary config info in order to be able to authenticate from frontend

```
const config = {
    apiKey: '<key>',
    authDomain: '<key>',
    projectId: '<key>',
    storageBucket: '<key>',
    messagingSenderId: '<key>',
    appId: '<key>',
    measurementId: '<key>'
};
```


### Run `firebase emulators:start` to set up firebase emulator for local development

```
$firebase emulators:start
```
This hosts firebase on  http://localhost:5004


## npm installations(No need to execute)
- npm init
- npm install express --save
- npm install ejs --save
- npm install firebase --save
- npm install firebase-tools --save
- npm install country-state-city --save  (https://openbase.com/js/country-state-city)
- npm install moment --save


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
