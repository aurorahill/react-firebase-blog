# A blog application created with React using Firebase Realtime Database and Firebase Authentication.
This project is a fully functional blog application where users can create, view, and comment on blog posts. It features user authentication and secure data storage via Firebase.

## Features
* User authentication (login, register, logout)
* CRUD operations for blog posts
* Firebase Realtime Database integration
* Responsive design
* Smooth scrolling and pagination


## Tech Stack
* React
* Firebase (Realtime Database & Authentication)
* SCSS module
* React Router
* Swiper.js

## Installation Instructions
```
git clone <repo-url>
cd <project-folder>
npm install
npm start
```

## Firebase Configuration
```
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
export default firebaseConfig;
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


