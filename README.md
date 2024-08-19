# Tracker Project

This project consists of a tracking script and a server component. It uses TypeScript, Webpack, and Express.js.

## Installation

Clone the repository and install dependencies `yarn`

## Development

### Start the server with hot-reloading

`yarn start`

### In a separate terminal, start the tracker build process with watch mode

`yarn start:tracker`

## Building the Project

### This will build the server, copy static files, and build the tracker

`yarn build`

### Serving the Built Project

Start the Node.js server using the built files in the dist directory

`yarn serve`

## Running Tests:

`yarn test`

### Environment Variables:

-   PORT: Set to 8888 in the build scripts
-   FRONT_PORT: Set to 50000

### Additional Notes:

-   Server port is specified in your server configuration

-   Ensure MongoDB is running if used

-   For development, use two terminal windows: one for server, one for tracker
