

var elem = document.getElementsByClassName('in-queue-calls-with-poor-quality')[0];

var element = document.querySelector('.company-id');
var companyId = element.querySelector('div').textContent;

var span3 = document.getElementsByClassName('span3')[0];



if(span3!=null)
{
    const regaxFullLog = /Лог ID: C-(\w+)/;
    const regaxSipServer = /SIP сервер: (\w+)/;
    var span3Text = span3.innerHTML;
    var logId = span3Text.match(regaxFullLog)[1];
    var sipServer = span3Text.match(regaxSipServer)[1];
    linkToFullLog = `https://panel.binotel.com/?module=commandExecution&action=grep-in-full-for-today&server=${sipServer}&subject=C-${logId}`;
    span3Text = span3Text.replace("C-"+logId,`<a target="_blank" href = "${linkToFullLog}">C-${logId}</a>`);
    span3.innerHTML = span3Text;

}


var listOfLogs = document.getElementById('diagnosticTabWithFullLog');



var dictionaryOfTag = {
    assignedToEmployeeEmail : "Еmail отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    assignedToEmployeeNumber : "Внутреняя линия отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    assignedToEmployeeID: "Идентификатор отвественного сотрудника в MyBinotel для обработки входящего звонка - ",
    linkToCrmUrl:"Ссылка, по которой доступна карточка клиента - ",
    linkToCrmTitle: "Текст ссылки, который отображатся сотруднику в плагине для Chrome - ",
    linkToCrm2Url:"Ссылка №2, по которой доступна карточка клиента - ", 
    linkToCrm2Title:"Текст ссылки №2, который отображатся сотруднику в плагине для Chrome - ",
    name: "Имя клиента отображенное на телефоне сотрудника и в плагине для Chrome - ",
    description:"Дополнительное описание в нотификации плагина - ",
    variables: "Данные для передачи в сценарий входящего звонка - ",
    URL:"Ссылка ACS - ",
    USERAGENT:"Устройство на котором зарегистрирована внутренняя линия которая ответила - ",
    CallerIdWas:"Вид номера в котором он к нам поступил - ",
    CallerIdBecame:"Вид номера который передан в ЛК - ",
    Declined:"Баланс на номерах Інтертелекому або SIP Life",
    limitOfOne: "Sip номер (або сім карта в шлюзі клієнта) не пропустив вихідний дзвінок з нього, так як він одноканальний і вже зайнятий іншим вхідним або вихідним дзвінком - ",
    response500: "Не коректна маршрутизація(якщо це сіп номер),  також таку  помилку може віддавати сімка в нашому обладнанні, коли вона вже зайняти іншим дзвінком",
    noRouteToDestination: "Немає маршруту для дзвінку",
    executing: "Вид номера в котором клиентом был набран номер - ",
    successNumbers: "Номер с которого осуществлен набор - ",
    errorNumbers: "Номер с которого была попытка набора - ",
    busyHere:"Номер набраного абоненту зайнятий",
    response503:"",
    NoChannelsAvailable: "Недостатньо каналів для вихідного дзвінка на номере - ",
    MovedTemporarily: "Установлена переадресация на внутренней линии",
    NobodyPicked: "Не кто не ответил за - "


};

var dictionaryKeysOfTag = Object.keys(dictionaryOfTag);

if(listOfLogs!=null)
{
    
    elem.style.color = "green";
    
    var originalText = listOfLogs.innerHTML;

    var element = document.querySelector('.company-id');
    var companyId = element.querySelector('div').textContent;
    var myListStrings = originalText.split("\n");
    var stringForManyId;
    
    regex = /outeID=(\d+)/; 
    var regexAux = /(.*Playing 'vOffice\/(\w+)\/production\/voice\/)(.*?)('.*)/;    
    var regexDTMF = /DTMF DTMF/g; 
    
    var regexNumberToCall = /VERBOSE Goto \(did2route,(\d+)/;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();
    const numberToCall = originalText.match(regexNumberToCall);


    try 
    {
        const outgoingLink = `https://${companyId}.gmmy.binotel.com/?module=cdrs&startDay=${day}&startMonth=${month}&startYear=${year}&showOnlyFilters=&callType=external&selectByTrunkNumber=${numberToCall[1]}`;
        const incomingLink = `https://${companyId}.gmmy.binotel.com/?module=cdrs&startDay=${day}&startMonth=${month}&startYear=${year}&showOnlyFilters=&callType=internal&selectByDidNumber=${numberToCall[1]}`
        originalText = originalText.replace(numberToCall[0],numberToCall[0]+`{ <a  target="_blank" href=${outgoingLink}>исход</a> | <a target="_blank" href=${incomingLink}>вход</a> }`);
    }
    catch (e) 
    {      
        console.log(e); 
    }


    for (let i = 0; i < dictionaryKeysOfTag.length; i++) 
    {    
        var position = 0;
        var secondPositionText = 0;
        var positionText = 1;
        var colorLink = "green";
        var hrefTo = "";
        var str = `"${dictionaryKeysOfTag[i]}":"(.*?)"`;
        var typeTag = "span";
        var needAddToDict = true;
        var secondText = "";
        var className = "ACS";
        var id =  `id = "${dictionaryKeysOfTag[i]}"`;
        var needGlobal = false;
        var needSpan = false;
        var newSpan = "";

        
        switch (dictionaryKeysOfTag[i]) {
            case "variables":
                str = `"${dictionaryKeysOfTag[i]}":{"(.*?)"}`;
                colorLink = "olive";
                break;
            case "URL":
                str = `${dictionaryKeysOfTag[i]}: (.*?). HTTP CODE`;
                position = 1;
                colorLink = "teal";
                break;
            case "USERAGENT":
                str = `"${dictionaryKeysOfTag[i]}: (.*?)"`;
                position = 0;
                colorLink = "#EA811D";
                break;
            case "CallerIdWas":
                str = `"Caller ID was (.*?)"`;
                position = 0;
                colorLink = "#EA811D";
                break;
            case "CallerIdBecame":
                str = `"Caller ID became (.*?)"`;
                position = 0;
                colorLink = "#EA811D";
                typeTag = "a";
                hrefTo = `target="_blank" href="https://${companyId}.gmmy.binotel.com/?module=history&subject=`;
                break;
            case "Declined":
                str = `Got SIP response 603 "Declined" back from ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+)`;
                position = 0;
                typeTag = "b";
                colorLink = "red";
                needAddToDict = false;
                needGlobal = true;  
                break; 
            case "limitOfOne":
                str = `NOTICE Call to peer '(.*?)' rejected due to usage limit of 1`;
                position = 0;
                typeTag = "b";
                colorLink = "red";
                break;
            case "response500":
                str = `VERBOSE Got SIP response 500 "Server Internal Error" back from ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+)`;
                position = 0;
                typeTag = "b";
                colorLink = "red";
                needAddToDict = false;
                needGlobal = true;
                break; 
            case "noRouteToDestination":
                str = `vOfficeSystem/production/voice/no-route-to-destination.alaw`;
                position = 0;
                typeTag = "b";
                colorLink = "red";
                needAddToDict = false;
                break;
            case "executing":
                str = `VERBOSE Executing \\[(\\d+)@external(\\w+):1\\]`;
                secondText = " Локаль клиента - external";
                secondPosition = 2;
                secondPositionText = 2;
                position = 0;
                colorLink = "violet";                    
                break;   
            case "successNumbers":
                str = `VERBOSE (\\w+) SIP/(\\w+)/(\\w+)`;
                secondText = " Вид номера на который был набор - ";
                secondPositionText = 3;
                positionText = 2;
                position = 0;
                colorLink = "violet"; 
                needSpan = true;
                needGlobal = true;
                needAddToDict = false;                                  
                break; 
            case "errorNumbers":
                str = `VERBOSE Couldn't call SIP/(\\w+)/(\\w+)`;
                secondText = " Вид номера на который был набор - ";
                secondPositionText = 2;
                colorLink = "violet";  
                needSpan = true; 
                needGlobal = true; 
                needAddToDict = false;                
                break;   
            case "busyHere":
                str = `VERBOSE Got SIP response 486 "Busy Here" back from (.*?)`;
                colorLink = "#e85f5f";  
                needGlobal = true; 
                typeTag = "b";
                needAddToDict = false;                
                break; 
            case "response503":
                str = `VERBOSE Got SIP response 503 "Service Unavailable" back from ([0-9]+\.[0-9]+)(\.[0-9]+\.[0-9]+:[0-9]+)`;
                colorLink = "#e85f5f";  
                needGlobal = true; 
                needSpan = true; 
                needAddToDict = false;
                typeTag = "b";               
                break;                 
            case "NoChannelsAvailable":
                str = `SIP/NoChannelsAvailableOnPbxNumber/(\\d+)`;
                colorLink = "#e85f5f";  
                needGlobal = true; 
                needSpan = true; 
                needAddToDict = false;
                typeTag = "b";               
                break;
            case "MovedTemporarily":
                str = `Got SIP response 302 "Moved Temporarily" `;
                colorLink = "#e85f5f";  
                needGlobal = true; 
                needAddToDict = false;
                typeTag = "b";               
                break; 
            case "NobodyPicked":
                str = `VERBOSE Nobody picked up in (\\d+) (\\w+)`;
                colorLink = "#51b869"; 
                secondText = "  ";
                secondPositionText = 2; 
                needGlobal = true;
                needSpan = true; 
                needAddToDict = false;
                typeTag = "b";               
                break;                      
            default:                
                break;
        }

        if(needGlobal) 
        {
            var reg = new RegExp(str,"g");
            
        }
        else
        {
            var reg = new RegExp(str);
        }

        if(originalText.match(reg))
        {  
            var changeText = originalText.match(reg);
            if(typeTag=="a"){hrefTo = hrefTo+changeText[positionText]+'"';}
            if(secondText!=""&&!needGlobal)
            {
                secondText += changeText[secondPositionText];
            
            }
            var textForResponse503;
            if(dictionaryKeysOfTag[i]=="response503")
            { 
                if(changeText[1]=="217.76"){textForResponse503 = "Номер Теле2 - Баланс , або якась складність з роботою номера";}
                else if(changeText[1]=="10.0"){textForResponse503 = "Сім карта в нашому обладнанні - Баланс , або якась складність обладнанні";}
                else if(changeText[1]=="195.128"){textForResponse503 = "Номер Интертелеком - Баланс , або якась складність з роботою номера";}
                else {textForResponse503 = "Баланс , або якась складність з роботою номера";}
            }
            if(needSpan)
            {
                reg = new RegExp(str);
                var oldSecondString = secondText;
                for(var q = 0;q < myListStrings.length;q++)
                { 
                    if(myListStrings[q].match(reg))
                    {
                        const oldString = myListStrings[q];
                        secondText = oldSecondString;
                        changeText = myListStrings[q].match(reg);
                        if(secondText!="")
                        {
                            secondText += changeText[secondPositionText];
                        }
                        var textToDict = dictionaryOfTag[dictionaryKeysOfTag[i]] + changeText[positionText];
                        if(needAddToDict){dictionaryOfTag[dictionaryKeysOfTag[i]] = textToDict+secondText;}
                        if(dictionaryKeysOfTag[i]=="response503")
                            {
                
                                if(changeText[1]=="217.76"){textForResponse503 = "Номер Теле2 - Баланс , або якась складність з роботою номера";}
                                else if(changeText[1]=="10.0"){textForResponse503 = "Сім карта в нашому обладнанні - Баланс , або якась складність обладнанні";}
                                else if(changeText[1]=="195.128"){textForResponse503 = "Номер Интертелеком - Баланс , або якась складність з роботою номера";}
                                else {textForResponse503 = "Баланс , або якась складність з роботою номера";}

                                textToDict = textForResponse503;
                            }
                        newSpan = `<span hidden="true"> ${textToDict+secondText}</span>`;
                        myListStrings[q] = myListStrings[q].replace(reg,` <${typeTag} ${hrefTo} style = "color:${colorLink}" ${id} class = "${className}">${changeText[position]} ${newSpan}</${typeTag}>`);
                        originalText = originalText.replace(oldString,myListStrings[q]);
                    }                    
                }
            }
            else
            {
                if(needAddToDict){dictionaryOfTag[dictionaryKeysOfTag[i]] = dictionaryOfTag[dictionaryKeysOfTag[i]] + changeText[positionText]+secondText;}
                originalText = originalText.replace(reg,` <${typeTag} ${hrefTo} style = "color:${colorLink}" ${id} class = "${className}">${changeText[position]} ${newSpan}</${typeTag}>`);
            }
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
    }
    originalText = originalText.replace(regexDTMF, `<b style = "color:#30D5C8;margin: 0">DTMF DTMF</b>`);
    originalText = originalText.replace(/Описание 8/g, `Дзвінок з номера , який вже видалили з компанії (його немаєв панелі)`)
    
    var regex = /vOfficeIncomingCall,s,1\((\d+,\d+,\d+)\)/; 
    var text = originalText.match(regex); 

    try 
    {
        var routeId = text[1].split(",")[1];
        var numberId = text[1].split(",")[2];  
    
        var myString = originalText.replace(originalText.match(regex)[1].split(",")[1], `<a title="Открыть сценарий ${routeId}" target="_blank" href="https://panel.binotel.com/?module=routes&companyID=${companyId}&action=edit&routeID=${routeId}&type=callRules">${routeId}</a>`);
        myString = myString.replace(originalText.match(regex)[1].split(",")[2], `<a title="Расш. настройки телефонного номера ${routeId}"target="_blank" href="https://panel.binotel.com/?module=pbxNumbersEnhanced&companyID=${companyId}&action=edit&pbxNumberID=${numberId}">${numberId}</a>`);
        listOfLogs.innerHTML = myString ;
    }
    catch (e) 
    {      
        listOfLogs.innerHTML = originalText;
    }
   



}
var helpTooltips = document.getElementById('diagnosticTabWithFullLog').getElementsByClassName('helpTooltip');

unableToCreateChannelString = "На линию вызов совершить не получилось так как она в оффлайне в момент попытка на нее позвонить";

for (let i = 0; i < helpTooltips.length; i++) {  
  
   
  if(unableToCreateChannelString == helpTooltips[i].dataset.originalTitle)
  {
    helpTooltips[i].style.color = "gray";
    break;

  }

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

  if(unableToCreateChannelString == helpTooltips[i].dataset.originalTitle)
  {
    

  }
}


var acs = document.getElementById('diagnosticTabWithFullLog').getElementsByClassName('ACS');

for (let i = 0; i < acs.length; i++) 
{  
    let div = document.createElement('div');  

    try {
        div.innerHTML = dictionaryOfTag[acs[i].id];
        
    } catch (error) {
        
    }
    

    if (acs[i].getElementsByTagName('span').length > 0) {
       
        const text = acs[i].getElementsByTagName('span')[0].textContent;
        div.innerHTML = text.trim();        
      } 
  
    acs[i].appendChild(div); 
    acs[i].style.position = "relative";
  
    if(acs[i].id == "executing"){ div.style.top = "15px";}
    else{div.style.bottom = "25px";}
  
    div.style.position = "absolute";
    div.style.left= "100px";  
    div.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
    div.style.color = "#fff"; 
    div.style.border = "1px solid #ccc"; 
    div.style.padding="10px"; 
    div.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"; 
    div.style.display = 'none';
  
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



