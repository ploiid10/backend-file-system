# Backend Service

## Overview

This backend service provides the core logic for our application. It interacts with MongoDB for data storage and exposes a set of API endpoints to handle various requests. The service is containerized with Docker for easy setup and deployment.

## Prerequisites

Before running the backend service, ensure that you have the following tools installed:

- **Docker**: To run the MongoDB container.
- **Node.js**: To install dependencies and run the application.

You can download Docker and Node.js from the following links:
- [Docker Installation](https://www.docker.com/get-started)
- [Node.js Installation](https://nodejs.org/)

## Setup

### 1. Start MongoDB with Docker

We use Docker to run MongoDB. In the project directory, you will find a `docker-compose.yml` file.

- First, ensure that Docker is installed and running on your machine.
- Run the following command to pull and start the MongoDB container:

```bash
docker-compose up -d
```

This will fetch and run the MongoDB image in the background.

### 2. Install Dependencies

Once MongoDB is running, you need to install the required dependencies for the backend service. Run the following command:
```bash
npm install
```


### 2. Run the applciation
```bash
npm run start
```


TODO
Implement a build script and integrate a bundler (e.g., Webpack, Rollup, Parcel) to optimize the code for production use.