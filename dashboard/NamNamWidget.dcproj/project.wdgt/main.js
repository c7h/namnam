/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */
 
var currentTagesmenue = null;
var currentMenues = null;
 
//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    var mensa = widget.preferenceForKey("selectedMensa");
    var ort = widget.preferenceForKey("selectedOrt");
    
    if(mensa == undefined && ort == undefined) showBack();
    else showFront();
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        initSettingsUI(widget.preferenceForKey("selectedOrt"), widget.preferenceForKey("selectedMensa"));
        widget.setPreferenceForKey(new Date().getTime(),"lastUpdate"); // reload always after settings change.
        setTimeout('widget.performTransition();', 0);
    }    
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        var mensa = widget.preferenceForKey("selectedMensa");
        var ort = widget.preferenceForKey("selectedOrt");
        var lastUpdate = widget.preferenceForKey("lastUpdate");
        var lastData = widget.preferenceForKey("currentMensaMenues");
        
        var now = new Date();
        
        if(lastUpdate == null || ((now.getTime() - lastUpdate) > ONE_DAY) || lastData == null ) {
            var url = getURLForMensa(ort,mensa);
            loadMensa(url, setCurrentTagesmenue);
            lastUpdate = new Date().getTime();
            widget.setPreferenceForKey(lastUpdate,"lastUpdate");
        } else {
            var currentMensaMenues = widget.preferenceForKey("currentMensaMenues");
            setCurrentTagesmenue(getCurrentTagesmenue(currentMensaMenues));
        }
        
        if(mensa == null)
            mensaNameText.innerHTML = ort;
        else
            mensaNameText.innerHTML = ort + " - " + mensa;
    
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function setCurrentTagesmenue(tm) {
    if(!tm) {
        alert("Invalid tagesmenue is invalid!");
        return;
    }
    currentTagesmenue = tm;
    var date = document.getElementById("currentDateText");
    date.innerHTML = prettyDate(tm.tag);
    
    //foods.innerHTML = '';
    centerRectangleShape.innerHTML = '';
    for(var n = 0; n < tm.Mensaessen.length; n++ ) {
            centerRectangleShape.appendChild(createMenueDiv(tm.Mensaessen[n]));
    }
    
    //scrollArea.object.refresh();
    
    // en/disable prev/next buttons
    if(getNextTagesMenueDate(currentMenues,currentTagesmenue.tag)) nextButton.object.setEnabled(true); 
    else nextButton.object.setEnabled(false);
    if(getPreviousTagesMenueDate(currentMenues,currentTagesmenue.tag)) prevButton.object.setEnabled(true);
    else prevButton.object.setEnabled(false);
}


function prevButtonClickHandler(event)
{
    setCurrentTagesmenue(getPreviousTagesmenue(currentMenues,currentTagesmenue.tag));
}


function nextButtonClickHandler(event)
{
    setCurrentTagesmenue(getNextTagesmenue(currentMenues,currentTagesmenue.tag));
}


function onOrtChangeHandler(event)
{
    var ostr = ortListPopup.value;
    widget.setPreferenceForKey(ostr,"selectedOrt") 
    initSettingsUI(ostr,null);
}

function initSettingsUI(ort,mensa) {
    var ortOptIdx = findOptionIndex(ortListPopup,ort);
    if(!ortOptIdx) {
        ortOptIdx = 0;
        ort = ortListPopup.options[0].value;
    }
    ortListPopup.selectedIndex = ortOptIdx;


    removeAllOptions(mensaListPopup.options);
    switch(ort) {
        case 'Ingolstadt':
        case 'Eichstätt':
        case 'Ansbach':
            mensaListPopup.disabled = true;
            break;
        case 'Erlangen':
            mensaListPopup.disabled = false;
            mensaListPopup.options.add(createOption("Langemarkplatz"));
            mensaListPopup.options.add(createOption("Süd"));
            break;
        case 'Nürnberg':
            mensaListPopup.disabled = false;
            mensaListPopup.options.add(createOption("Mensateria"));
            mensaListPopup.options.add(createOption("Regensburgerstr."));
            mensaListPopup.options.add(createOption("Schütt"));
            break;
        default:
            mensaListPopup.disabled = true;
    }

    if(mensaListPopup.disabled) { 
        widget.setPreferenceForKey(null,"selectedMensa");    
        mensaNameText.innerHTML = ort;
    } else {
        var er_idx =  findOptionIndex(mensaListPopup,mensa);
        if(!er_idx) {
            // mensa gone. set to first in list!
            mensaListPopup.selectedIndex = 0;
            mensa = mensaListPopup.options[0].value;
            widget.setPreferenceForKey(mensa,"selectedMensa");
        } else {
            mensaListPopup.selectedIndex = er_idx;
        }
        mensaNameText.innerHTML = ort + " - " + mensa;
    }
}

function createOption(value) {
    var op = document.createElement("option");
    op.text=value;
    return op;
}

function removeAllOptions(select) {
    while(select.length > 0) {
        select.remove(select.length - 1);
    }
}

function findOptionIndex(select,value) {
    for(var n = 0; n < select.length; n++) {
        if(select.options[n].value == value) return n;
    }
    return false;
}

function onMensaChangeHandler(event)
{
    // mensa selected (if ort is not specific enough)
    var mstr = mensaListPopup.value;
    widget.setPreferenceForKey(mstr,"selectedMensa");
    var ort = widget.preferenceForKey("selectedOrt");
    mensaNameText.innerHTML = ort + " - " + mstr;
}


function createMenueDiv(food) {

    var foodEntry = document.createElement("div");
    
    var style ="background-color: white; font-family: Helvetica Neue; font-size: 10pt; " +
               "border: solid gray 1px; padding: 5px; height: 38px;";
    if(food.moslem) {
        style += "background: white url('Images/nopork.png') no-repeat bottom right;";
    } else if (food.vegetarisch) {
        style += "background: white url('Images/veggie.png') no-repeat bottom right;";
    } else if (food.rind) {
        style += "background: white url('Images/rind.png') no-repeat bottom right;";
    }
    foodEntry.setAttribute("style", style);
    var innerHtml = "<b>"+food.beschreibung+"</b><br/>"+priceFormat(food.studentenPreis)+" / " + priceFormat(food.normalerPreis);
    foodEntry.innerHTML = innerHtml;
    return foodEntry;
}

function priceFormat(cents) {
    var float = (cents / 100).toFixed(2);
    return float.replace('.',',') + " €";
}


function openNamNamPage(event)
{
  if ( window.widget ) {
    widget.openURL( "http://namnam.bytewerk.org" );
    return false;
  }
}


function onMouseOverLinkHandler(event)
{
    link.style.color = "#b78da3";
    link.style.textDecoration = "underline";
}


function onMouseOutOfLinkHandler(event)
{
    link.style.color = "white";
    link.style.textDecoration = "none";
}
