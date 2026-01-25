/*
<javascriptresource>
<name>Hello World</name>
</javascriptresource>
*/

/*----------------------------------------------------------
    CPaletteWindowをつかって、”Hlloe world”

    https://scriptui.joonas.me/
      ↑ Script Bulderで生成されwたスクリプトをそのまま使用できます
------------------------------------------------------------*/

/*
 CPaletteWindowを基底クラスとして作成しました。
 ここでは、CHellowWorldDlgに継承させて、ボタンがひとつだけのダイアログを表示して、
 このボタンを押すことで、Hellow Worldと表示して終わります。

 ボタンが押されたが押された後の処理はおおまかには、下記のようになっています。
   ボタンが押された　→　onClick　→　CallFuncでBridgeTalkを使用してSayHelloWorldを呼ぶ　→　HelloWorldを呼ぶ
*/

// Ver.1.0 : 2026/01/24


#target illustrator
#targetengine "main"


SELF = (function(){
    try {app.documents.test()}
    catch(e) {return File(e.fileName)}
})();

// 外部のJSXを読み込む
$.evalFile(SELF.path + "/ZazLib/" + "PaletteWindow.jsx");


// 言語ごとの辞書を定義
var LangStrings = {
    confirm: {
        en: "Push this button",
        ja: "このボタンを押してください"
    },
    hello_world: {
        en: "Hello world",
        ja: "こんにちは世界"
    },
    boy: {
        en: "I'm boy",
        ja: "私は男の子です"
    },
    girl: {
        en: "I'm girl",
        ja: "私は女の子です"
    },
};


//-----------------------------------
// クラス CHuman
//-----------------------------------

// 1. コンストラクタ定義
function CHuman() { 
}

// 2. プロトタイプメソッドの定義
CHuman.prototype.HayHelloAnyone = function( Anyone ) {
    //alert($.locale);
    alert(localize(LangStrings.hello_world) + "\n" + Anyone );
}


//-----------------------------------
// クラス CBoy
//-----------------------------------

// 1. コンストラクタ定義
function CBoy() {
    CHuman.call(this);  // 親のプロパティを継承
}

// 2. クラス継承
ClassInheritance(CBoy, CHuman);

// 3. プロトタイプメソッドの定義
CBoy.prototype.HayHello = function() {
    //alert($.locale);
    this.HayHelloAnyone( localize(LangStrings.boy) );
}


//-----------------------------------
// クラス CGirl
//-----------------------------------

// 1. コンストラクタ定義
function CGirl() {
    CHuman.call(this); // 親のプロパティを継承
} // コンストラクタ (ここまで) 

// 2. クラス継承
ClassInheritance(CGirl, CHuman);

// 3. プロトタイプメソッドの定義
CGirl.prototype.HayHello = function() {
    this.HayHelloAnyone( localize(LangStrings.girl) );
}

 //-----------------------------------
// クラス CSurface
//-----------------------------------

// 1. コンストラクタ定義
function CSurface( DlgName ) {
    CPaletteWindow.call( this,false );       // コンストラクタ
    this.InitDialog( DlgName );              // イニシャライザ

    var self = this;            // クラスへののポインタを確保

    // インスタンスのコンストラクタ（子クラス自身）の静的プロパティに保存することで、動的に静的プロパティを定義
    self.constructor.TheObj = self;

    // GUI用のスクリプトを読み込む
    var selfFile = new File($.fileName);
    var currentDir = selfFile.parent;

    if ( self.LoadGUIfromJSX( currentDir.fullName + "/GUI.Panele_Hellow_World/ScriptUI Dialog Builder - Export.jsx" ) )
    {
        // GUIに変更を入れる
        self.button1.text = localize(LangStrings.confirm);
        self.button1.onClick = function() { self.onSayHelloWorldClick(); }
    }
    else{
        alert("GUIが未定です");
    }
}

// 2. クラス継承
ClassInheritance(CSurface, CPaletteWindow);


//-----------------------------------
// クラス CHelloWorldDlg
//-----------------------------------

// 1. コンストラクタ定義
function CHelloWorldDlg( DlgName ) {

    CSurface.call( this, DlgName );   // コンストラクタ

    var self = this;
}

// 2. クラス継承
ClassInheritance(CHelloWorldDlg, CSurface);

// 3. 静的メソッドの定義
CHelloWorldDlg.SayHelloWorld = function() {
    var Dlg = CHelloWorldDlg.TheObj;    // 動的に生成された静的プロパティ
    Dlg.HelloWorld( new CBoy() );
    Dlg.HelloWorld( new CGirl() );
    Dlg.CloseDlg();
}  

// 4. プロトタイプメソッドの定義
CHelloWorldDlg.prototype.onSayHelloWorldClick = function() {
    try
    {
        this.CallFunc( "SayHelloWorld" ); // 静的メソッドを呼び出すこと
    }
    catch(e)
    {
        alert( e.message );
    }
}
CHelloWorldDlg.prototype.HelloWorld = function( Human ) {
    Human.HayHello();
}
 

//インスタンスを生成。
var DlgHello = new CHelloWorldDlg( "HelloWorld" );

main();

function main()
{    
    DlgHello.ShowDlg();
}
