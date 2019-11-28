
// MENU
// Two variables to update
var boolean = false;
LED1.write(boolean);

var number = 50;
// First menu
var mainmenu = {
  "" : {
    "title" : "-- Main Menu --"
  },
  //"Backlight On" : function() { LED1.set(); },
  //"Backlight Off" : function() { LED1.reset(); },
  //"Submenu" : function() { Pixl.menu(submenu); },
  "Backlight" : {
    value : boolean,
    format : v => v?"On":"Off",
    onchange : v => { backlight(v); }
  },
  "A Number" : {
    value : number,
    min:0,max:100,step:10,
    onchange : v => { number=v; }
  },
  "Clock" : function() { Pixl.menu(); clock(); },
  //"Exit" : function() { Pixl.menu(); },
  "Puck scanner": function() { Pixl.menu(); puck(); },
};

// Submenu
var submenu = {
  "" : {
    "title" : "-- SubMenu --"
  },
  "One" : undefined, // do nothing
  "Two" : undefined, // do nothing
  "< Back" : function() { Pixl.menu(mainmenu); },
};

function backlight(v) {
  LED1.write(v);
  boolean=v;
}



// CLOCK
function clock() {
  function onTick() {
    // Called on a timer
    var t = new Date(); // get the current date and time
    g.clear();

    // Draw the time
    g.setFontVector(30);
    var time = t.getHours()+":"+("0"+t.getMinutes()).substr(-2);
    var seconds = ("0"+t.getSeconds()).substr(-2);
    g.drawString(time,95 - g.stringWidth(time),10);
    g.setFontVector(20);
    g.drawString(seconds,95,20);
    // Draw the date
    // Get the date as a string by removing the time from the end of it
    var date = t.toString().replace(/\d\d:.*/,"");
    g.setFontBitmap();
    g.drawString(date,0,0);

    // draw temperature
    // Get the temperature as a string
    var temp = E.getTemperature().toFixed(1);
    // Use the small font for a title
    g.setFontBitmap();
    g.drawString("Temperature: " + temp, 0, g.getHeight()-6);

    g.flip();
  }
  
  setInterval(onTick, 1000);
}



// READ PUCK.JS
function puck() {
  function scanForDevices() {
    NRF.findDevices(function(devs) {
      g.clear();
      var idx = 0;
      devs.forEach(function(dev) {
        if (dev.manufacturer!=0x590) return;
        var d = new DataView(dev.manufacturerData);
        g.drawString(`${dev.name}: ${d.getInt8(1)}'C (${d.getUint8(0)}% bat)`,0,idx*6);
        idx++;
      });
      if (!idx) g.drawString("(no devices found)");
      g.flip();
    }, 1000); // scan for 1 sec
  }

  setInterval(scanForDevices, 1000); // update once a minute
}

// Actually display the menu
Pixl.menu(mainmenu);
