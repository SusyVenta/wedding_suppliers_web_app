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

## npm installations(No need to execute)
- npm init
- npm install -g express --saved
- npm install -g ejs --saved
- npm install -g firebase --saved
- npm install -g firebase-tools --saved


## Directory
- functions
    - index.js (The app configurations and routings)
    - views (html files)
- public
    - assests
    - components
    - js
    - styles