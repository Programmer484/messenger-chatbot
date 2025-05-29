# Source Code Documentation

This directory contains the main source code for the Messenger Chatbot application. Here's an overview of each component:

## Directory Structure

### `appConfig/`
Contains application configuration and settings.
- `settings.ts`: Manages environment variables and application settings like port numbers and API tokens.

### `bot/`
Contains the core chatbot logic and message handling.
- `handlers.ts`: Implements message processing logic and response generation for user interactions.

### `utils/`
Contains utility functions and helper methods used throughout the application.
- `helpers.ts`: Provides common utility functions like message validation and response formatting.

### Root Files
- `index.ts`: The main entry point of the application. Sets up the Express server and handles webhook endpoints for the Messenger API.

## Type Definitions

The application uses TypeScript interfaces to ensure type safety:

- `Message`: Represents an incoming message from a user
- `ResponseMessage`: Represents a message to be sent back to the user
- `AppSettings`: Defines the structure of application configuration

## Usage

To start the application:
1. Development mode: `npm run dev`
2. Production mode: `npm run build` followed by `npm start`

Make sure to set up your environment variables in a `.env` file before running the application. 