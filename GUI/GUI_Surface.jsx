
// DLG
// ===
var Dlg = new Window("dialog"); 
    Dlg.text = "Dialog"; 
    Dlg.orientation = "column"; 
    Dlg.alignChildren = ["center","top"]; 
    Dlg.spacing = 10; 
    Dlg.margins = 16; 

// PANLE1
// ======
var panle1 = Dlg.add("panel", undefined, undefined, {name: "panle1"}); 
    panle1.text = "Message"; 
    panle1.orientation = "column"; 
    panle1.alignChildren = ["left","top"]; 
    panle1.spacing = 10; 
    panle1.margins = 10; 

var button1 = panle1.add("button", undefined, undefined, {name: "button1"}); 
    button1.text = "Push this button"; 
