/*
<javascriptresource>
<name>Hello World</name>
</javascriptresource>
*/

/*-----------------------------------------
    CPaletteWindowをつかって、”Hlloe world”
-------------------------------------------*/

/*
 CPaletteWindowを基底クラスとして作成しました。
 ここでは、CHellowWorldDlgに継承させて、ボタンがひとつだけのダイアログを表示して、
 このボタンを押すことで、Hellow Worldと表示して終わります。

 ボタンが押されたが押された後の処理はおおまかには、下記のようになっています。
   ボタンが押された　→　onClick　→　CallFuncでBridgeTalkを使用してSayHelloWorldを呼ぶ　→　HelloWorldを呼ぶ
*/

// Ver.1.0 : 2026/01/23


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
// クラス CHelloWorldDlg
//-----------------------------------

// 1. コンストラクタ定義
function CHelloWorldDlg( DlgName ) {
      
    // 初期化
    CPaletteWindow.call( this, false );   // 親のプロパティを継承
    this.InitDialog( DlgName );           // イニシャライザ

    // インスタンスのコンストラクタ（子クラス自身）の静的プロパティに保存することで、動的に静的プロパティを定義
    this.constructor.TheObj = this;

    var self = this;

    // ダイアログにボタン追加
    var myButton = this.AddButton( localize(LangStrings.confirm) );
    myButton.onClick = function() {
        try {
            self.CallFunc( "SayHelloWorld" ); // 静的メソッドを呼び出すこと
        }
        catch(e) {
            alert( e.message );
        }
    }

}

// 2. クラス継承
ClassInheritance(CHelloWorldDlg, CPaletteWindow);

// 3. 静的メソッドの定義
CHelloWorldDlg.SayHelloWorld = function() {
    var Dlg = CHelloWorldDlg.TheObj;    // 動的に生成された静的プロパティ
    Dlg.HelloWorld( new CBoy() );
    Dlg.HelloWorld( new CGirl() );
    Dlg.CloseDlg();
}  

// 4. プロトタイプメソッドの定義
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
