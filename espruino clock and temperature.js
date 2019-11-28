// Enable 'Set Current Time' in Settings -> Communications before sending

function onSecond() {
  // Called every second
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

// Call onSecond every second
setInterval(onSecond, 1000);