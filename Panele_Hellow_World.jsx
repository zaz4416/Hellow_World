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
   ボタンが押された　→　onClick　→　CallFuncでBridgeTalkを使用してHelloWorld2を呼ぶ　→　HelloWorldを呼ぶ
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


//-----------------------------------
// クラス CBoy
//-----------------------------------

// コンストラクタ (ここから) 
function CBoy() { 
} // コンストラクタ (ここまで) 

// 追加したいメソッドをここで定義
CBoy.prototype.HayHello = function() {
    //alert($.locale);
    alert(localize(LangStrings.hello_world) + "\n" + localize(LangStrings.boy));
}


//-----------------------------------
// クラス CGirl
//-----------------------------------

// コンストラクタ (ここから) 
function CGirl() { 
} // コンストラクタ (ここまで) 

// 追加したいメソッドをここで定義
CGirl.prototype.HayHello = function() {
    alert(localize(LangStrings.hello_world) + "\n" + localize(LangStrings.girl));
}


//-----------------------------------
// クラス CHelloWorldDlg
//-----------------------------------

// コンストラクタ (ここから) 
function CHelloWorldDlg( DlgName, InstanceName ) { 
       
    // 初期化
    const TheObj = this;
    CPaletteWindow.call( TheObj );          // コンストラクタ
    TheObj.InitDialog( DlgName );           // イニシャライザ
    TheObj.InitInstance( InstanceName );    // インスタンス初期化
    const TheDialog = TheObj.GetDlg();      // ダイアログへのオブジェクトを得る

    // ダイアログにボタン追加
    myButton = TheObj.AddButton( localize(LangStrings.confirm) );
    myButton.onClick = function() {
        try {
            TheObj.CallFunc( "SayHelloWorld" );
        }
        catch(e) {
            alert( e.message );
        }
    }

} // コンストラクタ (ここまで) 


CHelloWorldDlg.prototype = CPaletteWindow.prototype;   // サブクラスのメソッド追加よりも先に、継承させること


// 追加したいソッドをここで定義
CHelloWorldDlg.prototype.HelloWorld = function( Human ) {
    Human.HayHello();
}
    
// 追加したいメソッドをここで定義
CHelloWorldDlg.prototype.SayHelloWorld = function() {
    const TheObj = this;
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
