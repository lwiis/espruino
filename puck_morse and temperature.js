var doMorseCode = true;
var doDistance = false;

var total = 5;
var history = new Int16Array(total);
var k=0;

function logTemperature() {
  temp = E.getTemperature();
  history[k++] = temp;
  k=k%total;
  let avg = history.reduce((previous, current) => current += previous)/total;
  console.log( temp + ' - ' + avg);
  
  //turn off morse code and turn on light
  if(avg>=28) {
    doMorseCode = false;
    LED1.set();
    
    if(!doDistance) {
      doDistance = true;
      clearInterval(temperatureInterval);
    } 
  }
}

temperatureInterval = setInterval(logTemperature, 1000);


/*
International Morse code is composed of five elements:[1]

short mark, dot or "dit": "dot duration" is one time unit long
longer mark, dash or "dah": three time units long
inter-element gap between the dots and dashes within a character: one dot duration or one unit long
short gap (between letters): three time units long
medium gap (between words): seven time units long
*/

var charCodes = new Array(37);
charCodes["a"]=". _";
charCodes["b"]="_ . . .";
charCodes["c"]="_ . _ .";
charCodes["d"]="_ . .";
charCodes["e"]=".";
charCodes["f"]=". . _ .";
charCodes["g"]="_ _ .";
charCodes["h"]=". . . .";
charCodes["i"]=". .";
charCodes["j"]=". _ _ _";
charCodes["k"]="_ . _";
charCodes["l"]=". _ . .";
charCodes["m"]="_ _";
charCodes["n"]="_ .";
charCodes["o"]="_ _ _";
charCodes["p"]=". _ _ .";
charCodes["q"]="_ _ . _";
charCodes["r"]=". _ .";
charCodes["s"]=". . .";
charCodes["t"]="_";
charCodes["u"]=". . _";
charCodes["v"]=". . . _";
charCodes["w"]=". _ _";
charCodes["x"]="_ . . _";
charCodes["y"]="_ . _ _";
charCodes["z"]="_ _ . .";
charCodes["1"]=". _ _ _ _";
charCodes["2"]=". . _ _ _";
charCodes["3"]=". . . _ _";
charCodes["4"]=". . . . _";
charCodes["5"]=". . . . .";
charCodes["6"]="_ . . . .";
charCodes["7"]="_ _ . . .";
charCodes["8"]="_ _ _ . .";
charCodes["9"]="_ _ _ _ .";
charCodes["0"]="_ _ _ _ _";
charCodes[" "] = "      ";

function encode(text) {
    var chars = text.toLowerCase().split("");
    var result = "";
    var letter = "";
    var code = "";

    for (a = 0; a < chars.length; a++) {
        letter = chars[a];
        code = charCodes[letter];
        if (code) {
            result += code;
            if(a<chars.length-1 && letter!=" ") {
                result += "   ";
            }
        }
    }
    console.log(text + " = " + result);
    return result;
}

// Morse code to output
var morseInProgress = "";
// Output beeps for the morse code
function doMorseCode(str, dit) {
  // if we're already doing something, just append our extra code and return
  if (morseInProgress.length>0) {
    morseInProgress += str;
    return;
  }
  // otherwise start beeping...
  morseInProgress = str+" ";
  // do a beep and move onto the next character
  var light = function () {
    LED1.reset();
    var time = 0;
    // look at first character to see what beep to use
    switch(morseInProgress[0]) {
      case ".":
        time = dit;
        LED1.set();
        break;
      case "_":
        time = 3*dit;
        LED1.set();
        break;
      case " ":
        time = dit;
        break;
    }

    // remove the first character
    morseInProgress = morseInProgress.substr(1);
    // if there's anything left, carry on
    if (morseInProgress.length>0)
      setTimeout(light,time);
    else
      setTimeout(()=>LED1.reset(), time);
  };
  light();

  //setTimeout(()=>{morseInProgress="";doMorseCode(str,dit);}, 7*dit);
}

setWatch(function() {
  console.log('button pressed');
  if(doMorseCode) {
    console.log('doing morse code');
    var morseInProgress = "";
    setTimeout(()=>doMorseCode(encode("heatme"), 250), 500);
  } else if(doDistance) {
    console.log('doing distance');
    //LED1.reset();
  }
}, BTN, {edge:"rising", debounce:50, repeat:true});
