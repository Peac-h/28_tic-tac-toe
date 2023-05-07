# Tic Tac Toe (jQuery Project)

This is a Tic Tac Toe game built with jQuery, where the user plays against the computer.

The `AIMove` method makes the computer move. It first checks if the board is empty, and if it is, it marks the center square with an "O". If the center square is already taken, it marks the square in the bottom-right corner with an "O".

If it's the second move of the game, the computer checks if the player has marked any squares. If the player has marked two squares in a winning line, the computer marks the third square. If the player has marked two squares in different winning lines, the computer marks a square in a random winning line. If the player has not marked any squares in a winning line, the computer marks a square in a random winning line.

If it's the third move of the game, the computer checks if it has marked two squares in a winning line. If it has, it marks the third square. If it has not, it checks if the player has marked two squares in a winning line, and if the player has, it marks the third square. If neither the player nor the computer has marked two squares in a winning line, the computer marks a random square.

**I designed and implemented the algorithm myself, without utilizing any third-party logic or algorithms.**

**The game is fully responsive to all screens** with using a single media query.

## Checkout The Live Demo

[Tic Tac Toe]()

![Tic Tac Toe - Desktop]()

![Tic Tac Toe - Small Screen]()

## Game Rules

The game is played on a 3x3 board. The first player to get three marks in a row (vertically, horizontally, or diagonally) wins the game. The player marks with an "X" and the computer with an "O". If there are no more available spaces to mark and no player has won, the game ends in a tie.

## Features

- Add notes by clicking on the map and entering text in the note area;
- View all notes on the map and in a list;
- Delete individual notes from the list;
- Edit the header of the app;
- Get your current location;
- Toggle instructions modal.

## Technologies Used

- HTML
- CSS
- Sass
- JavaScript
- jQuery (to manipulate the DOM and handle events).

## Author

- [Github](https://github.com/Peac-h)
- [LinkedIn](https://www.linkedin.com/in/tamta-lomidze-b336b9266/)
- [Twitter](https://twitter.com/p6eac_h)
