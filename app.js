var elem = document.getElementsByClassName('in-queue-calls-with-poor-quality')[0];
elem.style.color = "green";

var element = document.querySelector('.company-id');
var companyId = element.querySelector('div').textContent;


var listOfLogs = document.getElementById('diagnosticTabWithFullLog');

if(listOfLogs!=null){

var originalText = listOfLogs.innerHTML;

var element = document.querySelector('.company-id');
var companyId = element.querySelector('div').textContent;

var regex = /vOfficeIncomingCall,s,1\((\d+,\d+,\d+)\)/; 
var text = originalText.match(regex); 

var routeId = text[1].split(",")[1];
var numberId = text[1].split(",")[2];

var myString = originalText.replace(originalText.match(regex)[1].split(",")[1], `<a href="https://panel.binotel.com/?module=routes&companyID=${companyId}&action=edit&routeID=${routeId}&type=callRules">${routeId}</a>`);
var myString = myString.replace(originalText.match(regex)[1].split(",")[2], `<a href="https://panel.binotel.com/?module=pbxNumbersEnhanced&companyID=${companyId}&action=edit&pbxNumberID=${numberId}">${numberId}</a>`);

var myListStrings = myString.split("\n");
regex = /ivrRouteID=(\d+)/; 
var regexAux = /(.*Playing 'vOffice\/\d+\/production\/voice\/)(.*?)('.*)/;
for (var i = 0; i < myListStrings.length; i++) 
{
    routeId = myListStrings[i].match(regex);
    audioSrc = myListStrings[i].match(regexAux);
    var oldString = myListStrings[i];
    if(myListStrings[i].match(regex))
    {
        myListStrings[i] = myListStrings[i].replace(myListStrings[i].match(regex)[1], `<a href="https://panel.binotel.com/?module=routes&companyID=${companyId}&action=edit&routeID=${routeId[1]}&type=callRules">${routeId[1]}</a>`);
        myString = myString.replace(oldString,myListStrings[i]);
    }
    if(myListStrings[i].match(regexAux))
    {
       var audioSrc = myListStrings[i].match(regexAux);
       var textBefore = audioSrc[1];
       var textAfter = audioSrc[3];
       console.log(audioSrc);
       var audioSrc = `https://panel.binotel.com/public/vOffice/${companyId}/origin/voice/${audioSrc[2].replace('.alaw','.wav').replace('.gsm','.wav')}`;

       myListStrings[i] = oldString + `<audio controls src="${audioSrc}">${audioSrc[2].replace('.alaw','.wav')}</audio><br>`;
       myString = myString.replace(oldString,myListStrings[i]);
    }


}

//myString = myListStrings;

listOfLogs.innerHTML = myString ;

}