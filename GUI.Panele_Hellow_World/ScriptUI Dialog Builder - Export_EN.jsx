
/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":0,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"Dlg","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Hello world","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Button","parentId":0,"style":{"enabled":true,"varName":"button1","text":"Push this button","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,1],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":false,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 

// DLG
// ===
var Dlg = new Window("dialog"); 
    Dlg.text = "Hello world"; 
    Dlg.orientation = "column"; 
    Dlg.alignChildren = ["center","top"]; 
    Dlg.spacing = 10; 
    Dlg.margins = 16; 

var button1 = Dlg.add("button", undefined, undefined, {name: "button1"}); 
    button1.text = "Push this button"; 

