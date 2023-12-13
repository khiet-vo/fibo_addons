# Fibo Addons

A repo to demo the code for solving test from company.
This project only tested on Linux - Ubuntu@22.04

## Tech Stack

-   NodeJS@18.18.2
-   C++@11.4.0
-   React
-   SocketIO Library
## Not issues:
- Slow on handle from 10_000. Browser got a lot of sockets event with huge data => Lag and slow. Event the backend job already finished.
## Required Software

-   [NodeJS@18.18.2](https://nodejs.org/en)
-   [node-gyp@8.2.0](https://www.npmjs.com/package/node-gyp)
-   [C++@11.4.0](https://en.cppreference.com/w/cpp/11)
-   [C++ Boost.org](https://www.boost.org/)

## Install

-   Start from the root folder of project:
-   Install related package

```bash
./install_boost.sh
npm install
```

-   Go to folder client and install package for client.

```bash
cd client
npm install
```

## How to run

Development ENV:
-   Start from root folder of project.
-   Start backend nodejs by command below and leave that terminal.

```bash
npm start
```

- Open new terminal for frontend

```bash
cd client
npm start
```
