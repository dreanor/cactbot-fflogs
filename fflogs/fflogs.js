'use strict';

this.partyTracker = new PartyTracker();

let apiKey="f825a9c2520b37fd37141c0ead1db332";
let url = "https://www.fflogs.com/v1/rankings/character/";

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

function getPercentileColor(percentile){
  if (percentile <= 24){
    return "grey";
  }

  if (percentile <= 49){
    return "green";
  }

  if (percentile <= 74){
    return "blue";
  }

  if (percentile <= 94){
    return "purple";
  }

  if (percentile <= 99){
    return "pink";
  }
  
  if (percentile == 100){
    return "yellow";
  }
  
  return "error";
}

function getWorld(worldId){
  if(worldId == 56)  {
    return "Phoenix";
  }
  if(worldId == 66)  {
    return "Odin";
  }
  if(worldId == 42)  {
    return "Zodiark";
  }
  if(worldId == 33)  {
    return "Twintania";
  }
  if(worldId == 67)  {
    return "Shiva";
  }
}
function displayInfo(player) {
  console.log("Writing:" +JSON.stringify(player));
  
  getJSON(url + player.name + "/" + getWorld(player.worldId) + "/EU?api_key=" + apiKey,
  function(err, data)
  {
    if (err !== null)
    {
      return false;
    }
    else
    {
            
      let content = "<br />";
      for (let i = 0; i < data.length; i++)
      {
        if (data[i].difficulty == 101) //Savage
        {
          let fontTag = " <b><font color='" + getPercentileColor(data[i].percentile) + "'>";
          
        content += "<tr><td>"+ data[i].encounterName +"</td>"
        + "<td>"+ data[i].spec +"</td>"
        + "<td>"+ fontTag + Math.round(data[i].percentile) + "</font>%</td>"
        + "<td>"+ data[i].rank + "/" + data[i].outOf + "</td></tr>";
        }
      }

      let html = "<center><h2>"+ player.name + "</h2></center><hr><table>"+
          "<thead>" +
          "<tr>"+
          "<th>Boss</th>"+
          "<th>Job</th>" +
          "<th>Percentage</th>"+
          "<th>Rank</th>"+
          "</tr>"+
          "</thead>"+
          "<tbody>"+
          content +
          "</tbody>"+
          "</table>";
      document.getElementById('fflogs').innerHTML += html;
    }
  });
}

addOverlayListener('PartyChanged', (e) => {
  this.partyTracker.onPartyChanged(e);
  console.log(JSON.stringify(e));
  let players = partyTracker.details;
  
  for (let i = 0; i < players.length; i++) 
  {
    displayInfo(players[i]);
  }
});

callOverlayHandler({ call: 'cactbotRequestState' });
