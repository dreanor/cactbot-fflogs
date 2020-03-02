'use strict';
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

let count = 0;
let target;

function displayInfo(playername, world) {
  getJSON(url + playername + "/" + world + "/EU?api_key=" + apiKey,
  function(err, data)
  {
    if (err !== null)
    {
      document.getElementById('fflogs').innerText = "No logs";
      return false;
    }
    else
    {
      let br = "<br />";
      document.getElementById('fflogs').innerText = null;
      for (let i = 0; i < data.length; i++)
      {
        if (data[i].difficulty != 101){continue;}

        let fontTag = " <b><font color='" + getPercentileColor(data[i].percentile) + "'>";

        let content = br
            + "<b>" + data[i].encounterName + "</b>" + br
            + data[i].spec
            +  fontTag + data[i].percentile + "</font></b>%  "
            + "(" + data[i].rank + "/" + data[i].outOf + ") " + br;

        document.getElementById('fflogs').innerHTML += content;
        return true;
      }
    }
  });
}

addOverlayListener('onTargetChangedEvent', function(e) {
  document.getElementById('target').innerText = e.detail.name;
  if(e.detail.name == null)
  {
    document.getElementById('fflogs').innerText = null;
    count = 0;
    target = e.detail.name;
    return;
  }
  
  if (e.detail.level != 0 && (count == 0 || target != e.detail.name))
  {
    document.getElementById('fflogs').innerText = null;
    
    target = e.detail.name;

    let worlds = ["Phoenix", "Lich", "Odin", "Shiva", "Zodiark"];
    let i;
    let result = false;
    for (i = 0; i < worlds.length; i++) 
    {
      if(displayInfo(target, worlds[i]))
      {
        result = true;
        break;
      }
    }
    
    count++;
  }
});

callOverlayHandler({ call: 'cactbotRequestState' });
