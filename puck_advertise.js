history = {"x":[], "y":[], "z":[]};
n = 5;

function updateBT() {
  
  magData = Puck.mag();

  data = [Puck.getBatteryPercentage(), E.getTemperature(), magData.x, magData.y, magData.z];
  
  console.log(data);
  
  NRF.setAdvertising({}, {
    manufacturer: 0x590,
    manufacturerData: data
  });
}

setInterval(updateBT, 2000);