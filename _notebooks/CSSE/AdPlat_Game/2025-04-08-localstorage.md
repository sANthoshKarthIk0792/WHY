---
toc: true
comments: true
layout: post
title: Local Storage in JS
description: Learn how Local Storage works and how to use it.
categories: [AdPlat] 
permalink: /adplat/localstorage
author: Ruhaan Bansal, Zhengji Li
courses: { csse: {week: 17} }
type: ccc
---
# Lesson on Local Storage in JavaScript

Local Storage allows web applications to store data in the browser for persistent access. This data is stored in key-value pairs and persists even when the browser is closed and reopened. Local Storage is part of the Web Storage API, along with Session Storage.

## What is Local Storage?

Local Storage is a simple and efficient way to store data in the browser without needing a database or server. Unlike cookies, the data stored in Local Storage is not sent to the server with every request, making it ideal for storing user preferences, session data, or temporary settings.

## Key Features of Local Storage

- **Persistent Data**: Data stored in Local Storage is persistent, meaning it will remain even after the user closes the browser or refreshes the page.
- **Size Limit**: Most browsers allow Local Storage to store about 5MB of data per origin (domain).
- **Key-Value Pair**: Data is stored as strings, and each item consists of a key and a corresponding value.

## How to Use Local Storage

### Storing Data

To store data in Local Storage, use the `setItem()` method. It requires two parameters: a key (string) and a value (string).




```python
%%js
localStorage.setItem('username', 'pika43');
```


    <IPython.core.display.Javascript object>


## Retrieving Data

To retrieve stored data, use the `getItem()` method, passing in the key of the item you want to retrieve.



```python
%%js 
let username = localStorage.getItem('username');
console.log(username);  // Output: pika43

```


    <IPython.core.display.Javascript object>


## Removing Data

To remove an item from Local Storage, use the `removeItem()` method, passing in the key of the item to be removed.



```python
%%js 
localStorage.removeItem('username');

```


    <IPython.core.display.Javascript object>


## Clearing All Data

To clear all data stored in Local Storage for a particular origin, use the `clear()` method.



```python
%%js 
localStorage.clear();

```


    <IPython.core.display.Javascript object>


## Working with JSON Data

Local Storage only stores strings, so if you need to store more complex data like objects or arrays, you must convert the data to a string using `JSON.stringify()` before storing it, and then parse it back into a JavaScript object with `JSON.parse()` when retrieving it.

### Example: Storing and Retrieving an Object





```python
%%js 
// Storing an object
const user = { name: "pika43", age: 15 };
localStorage.setItem('user', JSON.stringify(user));

// Retrieving the object
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // Output: Mr. Mortensen
```


    <IPython.core.display.Javascript object>


## Checking for Local Storage Support

Before using Local Storage, it's good practice to check if the browser supports it.


```python
%%js 
if (typeof(Storage) !== 'undefined') {
  // Local Storage is available
} else {
  // Local Storage is not available
}
```


    <IPython.core.display.Javascript object>


## Use Cases for Local Storage

- **User Preferences**: Store settings like dark mode or language selection.
- **Form Data**: Store incomplete form data so the user can pick up where they left off.
- **Session Management**: Keep track of user authentication states across sessions.
- **Caching**: Store API responses to reduce load times for subsequent visits.

## Limitations of Local Storage

- **Size Limit**: The 5MB storage limit might not be sufficient for large applications.
- **Security**: Data stored in Local Storage is not encrypted, so it can be accessed by any JavaScript code running on the page. Sensitive information should never be stored in Local Storage.
- **Synchronous API**: Local Storage operations are synchronous, which can cause performance issues if large amounts of data are stored or retrieved.

## Conclusion

Local Storage provides a simple and effective way to store data on the client side. While it's great for storing non-sensitive data, developers should always consider security and size constraints when using it. Remember that data in Local Storage persists across sessions, so be mindful of how and when you clear stored data.

## Hacks

### Popcorn Hack 1: Auto-Complete with Local Storage

Use Local Storage to store recent search terms in a search bar. When the user types a query, show a list of previously searched terms from Local Storage, making it easier for users to quickly search again.

### Popcorn Hack 2: Save Progress in Games

For games that don’t require server-side saving, use Local Storage to store player progress, high scores, and level information. This way, even if the user closes the game or their browser, their progress is saved.

## Homework

### Create a To-Do List with Local Storage:

- Create a basic to-do list application where users can add and remove tasks.
- Store the to-do list in Local Storage so that the tasks persist even when the page is reloaded.
- When the user adds a task, update the Local Storage data and re-render the list on the page.

### User Preferences Application:

- Build a simple application that allows users to choose a theme (light or dark mode).
- Save their theme preference in Local Storage and apply the theme on page load based on the stored preference.

