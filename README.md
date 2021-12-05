# Simple Lucky Draw
Simple lucky draw HTML page I cobbled together using code from various sources.


## Features
1) Possible to pick multiple names with single click for same-rank prizes.
2) Variable duration for animating random names.


## Preparation
1) Place all prize images in the `img` folder. Images should be named `prizeN.jpg` where N is the prize number.
2) Edit `luckydraw.html` file to reflect the correct prize description.


## Execution
1) Export list of lucky draw participants into a comma separated value (CSV) file. The file should only have 2 columns - `ID,Username`.<br />
Sample input: `sample-data\names.csv`
2) Open `luckydraw.html` file in a browser of choice. (Chrome & Firefox should work)
3) Select CSV file of participants from step 1.
4) Have fun drawing winners!
5) Remember to scroll to the very end to export and save the list of lucky draw winners!<br />
Sample output: `sample-data\winners.txt`


## Code credits
+ Name animation and random draw code - http://jsfiddle.net/yckelvin/6VA5e/
+ File handler (open and save) - https://github.com/GoogleChromeLabs/text-editor/blob/main/src/inline-scripts/fs-helpers.js
+ Confetti effect - https://www.codehim.com/animation-effects/javascript-confetti-explosion-effect/
+ Bootstrap Heroes layout with shadows - https://getbootstrap.com/docs/5.1/examples/heroes/
