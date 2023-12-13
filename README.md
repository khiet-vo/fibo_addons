# Fibo Addons

A repo to demo the code for solving test from company.
This project only tested on Linux - Ubuntu@22.04

## Tech Stack

-   [NodeJS@18.18.2](https://nodejs.org/en)
-   [C++@11.4.0](https://en.cppreference.com/w/cpp/11)
-   [React](https://react.dev/)
-   [SocketIO](https://socket.io/)
-   [C++ Boost.org](https://www.boost.org/)

## Concept

-   Client connect to NodeJS by WebSocket(build with SocketIO).
-   If client connect success. User can send an integer number smaller than 1_000_000 to NodeJS by WS.
-   NodeJS receive the number and open a Worker with that number.
-   Worker will use addon C++(N-API) with EventEmitter. That allows C++ can send message to Worker during generate the Fibonacci.
-   C++ use the library `boost::multiprecision` to handle big number.

### Limitation Note

-   If my implementation is not good enough. Please let me know. I'm willing to learn and improve.
-   This my first time build an addons for NodeJS. So I only know 3 ways that N-API allows callback:
    -   AsyncWorker: Not allows to call callback during execute. Only callback on OnOk and OnError. Not fit to the requirements
    -   ThreadSafe: Callback but not really good. I don't know why it slower than EventEmitter.
    -   EventEmitter: Streaming data to NodeJS.

## Note issues

-   Slow on handle big number from 100_000th. Browser got a lot of socket events => lagging. Even the backend job already finished.
-   LIMIT_NUMBER is set at 1_000_000. You need to change in both backend `app.js` and frontend `App.js` by searching the `LIMIT_NUMBER`
-   Should kill the socket and the worker if Client quit during processing.
-   Sometime will got error: `JavaScript heap out of memory` if running too much request.

## Required Software

-   Ubuntu or Linux or MacOS
-   Git
-   [NodeJS@18.18.2](https://nodejs.org/en)
-   [node-gyp@8.2.0](https://www.npmjs.com/package/node-gyp)
-   [C++@11.4.0](https://en.cppreference.com/w/cpp/11)

## Install

-   Start from the root folder of project:
-   Install related package

```bash
./install.sh
```

-   Go to folder client and install package for client.

```bash
cd client
npm install
```

## How to run

Build version:

-   Start from root folder of project.
```bash
./build.sh
```
-   Start normal with node

```bash
npm start
```

-   Start with `forever`

```bash
npm run start-forever
```

-   Stop `forever`

```bash
npm run stop-forever
```

Development ENV:

-   Start from root folder of project.
-   Start backend nodejs by command below and leave that terminal.

```bash
npm start
```

-   Open new terminal for frontend

```bash
cd client
npm start
```
