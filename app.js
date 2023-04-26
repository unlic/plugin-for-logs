var elem = document.getElementsByClassName('in-queue-calls-with-poor-quality')[0];

var element = document.querySelector('.company-id');
var companyId = element.querySelector('div').textContent;


var listOfLogs = document.getElementById('diagnosticTabWithFullLog');

var massACS = {
    assignedToEmployeeEmail : "Еmail отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    assignedToEmployeeNumber : "Внутреняя линия отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    assignedToEmployeeID: "Идентификатор отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    linkToCrmUrl:"Ссылка, которая будет отображатся сотруднику в плагине для Chrome - ",
    linkToCrmTitle: "Текст ссылки, которая отображатся сотруднику в плагине для Chrome - ",
    linkToCrm2Url:"Ссылка №2, которая отображатся сотруднику в плагине для Chrome - ", 
    linkToCrm2Title:"Текст ссылки №2, которая отображатся сотруднику в плагине для Chrome - ",
    name: "Имя клиента отображенное на телефоне сотрудника и в плагине для Chrome - ",
    description:"Дополнительное описание в нотификации плагина - ",
    variables: "Данные для передачи в сценарий входящего звонка - ",
    URL:"Ссылка ACS - "
};

var massKeysACS = Object.keys(massACS);

if(listOfLogs!=null)
{
    
    elem.style.color = "green";
    
    var originalText = listOfLogs.innerHTML;

    var element = document.querySelector('.company-id');
    var companyId = element.querySelector('div').textContent;

    

    var myListStrings = originalText.split("\n");
    regex = /outeID=(\d+)/; 
    var regexAux = /(.*Playing 'vOffice\/(\w+)\/production\/voice\/)(.*?)('.*)/;    
    var regexDTMF = /DTMF DTMF/; 


    

    for (let i = 0; i < massKeysACS.length; i++) 
    {    
        var position = 0;
        var colorLink = "green";
        var str = `"${massKeysACS[i]}":"(.*?)"`;
        if (massKeysACS[i] =="variables")
        {
            str = `"${massKeysACS[i]}":{"(.*?)"}`;
            colorLink = "olive"
        }
        if (massKeysACS[i] =="URL")
        {
            str = `${massKeysACS[i]}: (.*?). HTTP CODE`;
            position = 1;
            colorLink = "teal"
        }
        var reg = new RegExp(str);
        console.log(reg);

        if(originalText.match(reg))
        {
            var p = originalText.match(reg);

            massACS[massKeysACS[i]] = massACS[massKeysACS[i]] + p[1];
            originalText = originalText.replace(p[0],` <span style = "color:${colorLink}" id = "${massKeysACS[i]}" class = "ACS">${p[position]}</span>`);
        }

    }
    




    for (var i = 0; i < myListStrings.length; i++) 
    {
        routeId = myListStrings[i].match(regex);
        audioSrc = myListStrings[i].match(regexAux);
        var oldString = myListStrings[i];

        if(myListStrings[i].match(regex))
        {
            myListStrings[i] = myListStrings[i].replace(myListStrings[i].match(regex)[1], `<a title="Открыть сценарий ${routeId[1]}" target="_blank" href="https://panel.binotel.com/?module=routes&companyID=${companyId}&action=edit&routeID=${routeId[1]}&type=callRules">${routeId[1]}</a>`);
            originalText = originalText.replace(oldString,myListStrings[i]);
        }
        if(myListStrings[i].match(regexAux))
        {
            var audioSrc = myListStrings[i].match(regexAux);           

            var linkCompanyFromAudio = audioSrc[2];
            var auxLink = audioSrc[3].replace('.alaw','.wav').replace('.gsm','.wav');
            var audioSrc = `https://panel.binotel.com/public/vOffice/${linkCompanyFromAudio}/origin/voice/${auxLink}`;

            myListStrings[i] = oldString + `<div ><audio controls src="${audioSrc}">${auxLink}</audio></div>`;
            originalText = originalText.replace(oldString,myListStrings[i]);
        }       
        if(myListStrings[i].match(regexDTMF))
        {
            var newText = myListStrings[i].replace("DTMF DTMF", `<b style = "color:#30D5C8;margin: 0">DTMF DTMF</b>`);
            originalText = originalText.replace(myListStrings[i], newText);
        }
    
    }
    
    var regex = /vOfficeIncomingCall,s,1\((\d+,\d+,\d+)\)/; 
    var text = originalText.match(regex); 

    var routeId = text[1].split(",")[1];
    var numberId = text[1].split(",")[2];  

    var myString = originalText.replace(originalText.match(regex)[1].split(",")[1], `<a title="Открыть сценарий ${routeId}" target="_blank" href="https://panel.binotel.com/?module=routes&companyID=${companyId}&action=edit&routeID=${routeId}&type=callRules">${routeId}</a>`);
    myString = myString.replace(originalText.match(regex)[1].split(",")[2], `<a title="Расш. настройки телефонного номера ${routeId}"target="_blank" href="https://panel.binotel.com/?module=pbxNumbersEnhanced&companyID=${companyId}&action=edit&pbxNumberID=${numberId}">${numberId}</a>`);

    
    listOfLogs.innerHTML = myString ;


}
var helpTooltips = document.getElementById('diagnosticTabWithFullLog').getElementsByClassName('helpTooltip');

for (let i = 0; i < helpTooltips.length; i++) {  
  let div = document.createElement('div'); 
   
   
  
  div.innerHTML = helpTooltips[i].dataset.originalTitle; 

  helpTooltips[i].appendChild(div); 
  helpTooltips[i].style.position = "relative";


  div.style.position = "absolute";
  div.style.left= "100px";  
  div.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
  div.style.color = "#fff"; 
  div.style.border = "1px solid #ccc"; 
  div.style.padding="10px"; 
  div.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"; 
  div.style.display = 'none';
  div.style.bottom = "25px";


  helpTooltips[i].addEventListener('mouseover', function(event) {
    showDiv(div);
  });

  helpTooltips[i].addEventListener('mouseout', function(event) {
    hideDiv(div);
  });
}

var acs = document.getElementById('diagnosticTabWithFullLog').getElementsByClassName('ACS');

for (let i = 0; i < acs.length; i++) {  
    let div = document.createElement('div'); 
     



   /* switch (acs.document.id) {
        case value:
            
            break;
    
        default:
            break;
    }*/
     
    
    div.innerHTML = massACS[acs[i].id]; 
  
    acs[i].appendChild(div); 
    acs[i].style.position = "relative";
  
  
    div.style.position = "absolute";
    div.style.left= "100px";  
    div.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
    div.style.color = "#fff"; 
    div.style.border = "1px solid #ccc"; 
    div.style.padding="10px"; 
    div.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"; 
    div.style.display = 'none';
    div.style.bottom = "25px";
  
  
    acs[i].addEventListener('mouseover', function(event) {
      showDiv(div);
    });
  
    acs[i].addEventListener('mouseout', function(event) {
      hideDiv(div);
    });
  }




function showDiv(div) {
  div.style.display = 'block';
}

function hideDiv(div) {
  div.style.display = 'none';
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}



