
## component Diagram
./component.jpeg
./schema.jpeg

## required (Installed)
nodejs 
mongodb


## How to Deploy 

 - clone the repo
 - npm init
 - npm i pm2 -g

## How to run
  - start mongod server 
  - run command to start the server
    pm2 start ecosystem.config.js (running server with cluster mode with max node upto 5)

## How to monitor
  - pm2 monit



## How to use APIS
 please visit <componet_name>.route.controller.js in /api  directory 



## test case (using jasmine)
  - not completed