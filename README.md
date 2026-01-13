# Firebase Real Time Chat App

## Overview

This project is a real time mobile chat application built with Expo React Native and Firebase. It allows users to authenticate, start conversations, and exchange messages instantly using Firebase Firestore.

The app focuses on simplicity, speed, and real time communication.

## Key Features
	1.	User authentication using Firebase Authentication
	2.	Real time messaging with Firebase Firestore
	3.	Instant message updates for both sender and receiver
	4.	Secure access rules using Firestore security rules
	5.	Mobile friendly interface built with Expo

## Tech Stack
	1.	React Native with Expo
	2.	Firebase Authentication
	3.	Firebase Firestore
	4.	JavaScript

## Project Structure
	1.	screens folder for UI screens such as Login, Register, Chat, and ChatList
	2.	components folder for reusable UI components
	3.	firebase configuration file for Firebase setup
	4.	navigation setup for screen routing

## Firebase Setup
	1.	Create a Firebase project from the Firebase Console
	2.	Enable Email and Password authentication
	3.	Create a Firestore database in production or test mode
	4.	Copy Firebase configuration keys into the app configuration file

### Firestore Data Model
	1.	users collection
Each document stores user id, name, email, and timestamp
	2.	chats collection
Each document represents a chat between two users
	3.	messages subcollection
Stores message text, sender id, receiver id, and created time

### Installation and Running the App
	1.	Clone the repository
	2.	Install dependencies using npm install or yarn install
	3.	Start the development server using expo start
	4.	Run the app on an Android emulator, iOS simulator, or physical device using Expo Go

### Authentication Flow
	1.	User registers or logs in using email and password
	2.	Firebase Authentication verifies credentials
	3.	Authenticated user is redirected to the chat list screen

### Messaging Flow
	1.	User selects a contact
	2.	Messages are fetched from Firestore in real time
	3.	New messages are written to Firestore
	4.	Firestore listeners update the chat instantly for both users

### Security
	1.	Firestore rules restrict users to read and write only their own messages
	2.	Authentication is required before accessing chat data

### Future Improvements
	1.	Read receipts
	2.	Typing indicators
	3.	Online and offline presence
	4.	Push notifications
	5.	Media sharing such as images and voice notes

Author

Built as a learning and practical project using Firebase and React Native.

License

This project is for educational purposes.
