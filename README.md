# OXBH Communication Rules Engine

## Development

Start a dev server hosting the lambda localy
```bash
# make a proper .env file - make sure the variables are defined as needed
cp .env.example .env
# start the local env
npm run dev
```

Run a message payload through the lambda
```bash
curl -X POST -d '{"messages":[]}' http://localhost:8080/src/handler.setupZnodes
# or
curl -X POST -d '{"messages":[]}' http://localhost:8080/src/handler.readData
```

Note that if the `.env` `HANDLERS` variable exposes more than one handler
entry point (multiple lambdas from a single repository), then the local server
must be invoked with the handlers name as the path:

```bash
# e.g. HANDLERS=index.handlerOne,index.handlerTwo
curl -X POST -d '{"messages":[]}' http://localhost:8080/index.handlerOne
curl -X POST -d '{"messages":[]}' http://localhost:8080/index.handlerTwo
```

---

# Communication_Rules_Engine
Communication rules engine local Installation.

1) The system assumes you have node v18 and zookeeper installed.
2) The best way to manage node version is to use nvm (node version manager) nvm installation guide
once installed run the command nvm use 18.
3) Run zookeeper as described below
     * Go to the bin folder which is inside zookeeper downloaded folder.
     * Open command prompt in the same location and run below command to start the zookeeper
         ``` zkserver.sh start```
     * Open command prompt in the same location and run below command to get the zookeeper CLI
         ``` zkcli.sh```
4) Clone the project git clone: https://github.com/oxbridgehealth/Communication_Rules_Engine.git# .
7) To install all the dependencies run below command.
    ```npm install -- this will install all requirements.```
8) paste the attached excel in path "C:/Oxbridge/Communication_Rules_Engine"
9) To start the API endpoints
    ```npm run start ```
