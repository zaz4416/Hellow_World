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

// Ver.1.0 : 2026/01/18


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


// プロパティ・メソッドをコピーする汎用関数
function ClassInheritance(subClass, superClass) {
    for (var prop in superClass.prototype) {
        if (superClass.prototype.hasOwnProperty(prop)) {
            subClass.prototype[prop] = superClass.prototype[prop];
        }
    }
}


//-----------------------------------
// クラス CHuman
//-----------------------------------

// コンストラクタ (ここから) 
function CHuman() { 
} // コンストラクタ (ここまで) 

// 追加したいメソッドをここで定義
CHuman.prototype.HayHelloAnyone = function( Anyone ) {
    //alert($.locale);
    alert(localize(LangStrings.hello_world) + "\n" + Anyone );
}


//-----------------------------------
// クラス CBoy
//-----------------------------------

// コンストラクタ (ここから) 
function CBoy() {
    CHuman.call(this);  // 親のプロパティを継承
} // コンストラクタ (ここまで) 

// CHumanのメソッドをコピー
ClassInheritance(CBoy, CHuman);

// ClassInheritanceの後ろで、追加したいメソッドを定義
CBoy.prototype.HayHello = function() {
    //alert($.locale);
    this.HayHelloAnyone( localize(LangStrings.boy) );
}


//-----------------------------------
// クラス CGirl
//-----------------------------------

// コンストラクタ (ここから) 
function CGirl() {
    CHuman.call(this); // 親のプロパティを継承
} // コンストラクタ (ここまで) 

// CHumanのメソッドをコピー
ClassInheritance(CGirl, CHuman);

// ClassInheritanceの後ろで、追加したいメソッドを定義
CGirl.prototype.HayHello = function() {
    this.HayHelloAnyone( localize(LangStrings.girl) );
}


//-----------------------------------
// クラス CHelloWorldDlg
//-----------------------------------

// コンストラクタ (ここから) 
function CHelloWorldDlg( DlgName, InstanceName ) { 
       
    // 初期化
    var TheObj = this;                      // クラスインスタンスを指す this を退避
    CPaletteWindow.call( TheObj, false );   // 親のプロパティを継承
    TheObj.InitDialog( DlgName );           // イニシャライザ
    TheObj.InitInstance( InstanceName );    // インスタンス初期化

    // ダイアログにボタン追加
    var myButton = TheObj.AddButton( localize(LangStrings.confirm) );
    myButton.onClick = function() {
        try {
            TheObj.CallFunc( "SayHelloWorld" );
        }
        catch(e) {
            alert( e.message );
        }
    }

} // コンストラクタ (ここまで) 

// CHumanのメソッドをコピー
ClassInheritance(CHelloWorldDlg, CPaletteWindow);

// 追加したいソッドをここで定義
CHelloWorldDlg.prototype.HelloWorld = function( Human ) {
    Human.HayHello();
}
    
// 追加したいメソッドをここで定義
CHelloWorldDlg.prototype.SayHelloWorld = function() {
    var TheObj = this;
    TheObj.HelloWorld( new CBoy() );
    TheObj.HelloWorld( new CGirl() );
    TheObj.CloseDlg();
}
 

//インスタンスを生成。なお、CHelloWorldDlgの引数にも、インスタンス名(DlgPaint)を記入のこと！！
var DlgPaint = new CHelloWorldDlg( "HelloWorld", "DlgPaint" );

main();

function main()
{    
    // バージョン・チェック
    if( appVersion()[0]  >= 24)
    {
        DlgPaint.ShowDlg();
    }
    else
    {
         var msg = {en : 'This script requires Illustrator 2020.', ja : 'このスクリプトは Illustrator 2020以降に対応しています。'} ;
        alert(msg) ; 
     }
}
