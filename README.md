# JS-Slot

A slot machine simulation web-app running under Google Chrome.
Has been written with main tools: TypeScript, Pixi JS, Tween JS, RxJS.

### Detailed description
Slot machine page has current interface elements: 
1. Slot machine;
2. Paytable;
3. Balance indicator;
4. Spin button;
5. Debugging (by dat.gui controller library).

### Slot machine
Slot machine has 3 reels and 3 win lines, each having following 5 symbols in order: 3xBAR, BAR, 2xBAR, 7, CHERRY
There are horizontal win-lines on visible part of reel: top, center, bottom.
A reel can stop only in fixed positions. A stopped reel has either:
1. A symbol on center win line;
2. Symbols on top and bottom win-line positions.

### Paytable
When a particular win happens the winning sum on paytable starts blinking and the win-line on reels is marked.

### Balance area
Players current balance is shown on balance text are bellow the slot machine. If the balance is 0, the button becomes inactive and players sees a corresponding message.  

### Spin button
After click on the spin button all three reels start spinning. Each spin costs players 1 coin. The spinning must last 2 seconds, after that reels start to stop one by one (starting from left) having 0.5 sec delay between landings. Players can't skip the spinning.

### Debugging
The slot machine has two modes: random mode and fixed mode. 
In case of random mode, the reels must land random positions.
For fixed mode, players can use the GUI controller in the top left corner (just click on 'Open controls'). 
There are two main parameters here:
1. Players can set the current balance in a range from 1 to 5000. Changes are applied after clicking on the "save" button.
2. Choose for each symbol from set { BAR, 2xBAR, 3xBAR, 7, CHERRY }a landing position from set { TOP, MIDDLE, BOTTOM }. Players will see a "Reels" folder in the GUI controller, inside which are the parameters for each reel. After the settings are completed for the result, just click the Spin button in this GUI controller below. The changes will be applied immediately and the slot machine will start to spin. After that, players will see the expected result. Just for the information: changes data in the GUI doesn't save in the local storage, but these settings are easily configurable.

Below the main spin button is an on/off button that collapses a small field with information about the current result. Data is loaded only during the expansion of the current field and data is reset immediately after closing.

***
As a plan:
- Make all dynamic text as a bitmap text;
- Redraw graphic reels or find assets to make the reels look more like reels, add a background and some ui stuff.

***
### You can try it from [here](https://hedfan.github.io/JS_Slot/) 

***
#### More description:

###### Garbage bag
The garbage bag needs to avoid memory leaks during error cases. Especially it could be useful for the whole game platform - if the garbage bag couches an error from the platform side, it can easily reload a game.
This version here it’s more like a prototype.

