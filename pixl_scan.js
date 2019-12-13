  function scanForDevices() {
    NRF.findDevices(function(devs) {
      g.clear();
      var idx = 0;
      devs.forEach(function(dev) {
        console.log(dev);
        if (dev.manufacturer!=0x590) return;
        var d = new DataView(dev.manufacturerData);
        g.drawString(`${dev.name}: ${d.getInt8(1)}'C (${d.getUint8(0)}% bat)\nx=${d.getInt8(2)}`,0,idx*6);
        idx++;
      });
      if (!idx) g.drawString("(no devices found)");
      g.flip();
    }, 1000); // scan for 1 sec
  }

  setInterval(scanForDevices, 2000); // update once a second