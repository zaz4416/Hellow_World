/*
<javascriptresource>
<name>Hello World</name>
</javascriptresource>
*/

/*
コピー処理を書く際、VSCodeの拡張機能「ESLint」を入れていると、$.global が
未定義で警告が出ることがあります。
その場合は、ファイルの先頭に 下記を記述すると警告が消えます。
*/
/* global $ */

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

// Ver.1.0 : 2026/02/08

#target illustrator
#targetengine "main"


// スクリプト実行時に外部のJSXを読み込む (#includeにすると、main関数が終了した時点で、ダイアログが表示されなくなる)
$.evalFile(GetScriptDir() + "ZazLib/PaletteWindow.jsx");


// 言語ごとの辞書を定義
var MyDictionary = {
    GUI_JSX: {
        en : "GUI/Panele_Hellow_World/ScriptUI Dialog Builder - Export_EN.jsx",
        ja : "GUI/Panele_Hellow_World/ScriptUI Dialog Builder - Export_JP.jsx"
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

// --- LangStringsの辞書から自動翻訳処理 ---
var LangStrings = GetWordsFromDictionary( MyDictionary );

// オブジェクトの最大保持数
var _MAX_INSTANCES = 5;


// --- グローバル関数 -----------------------------------------------------------------

/**
 * 実行中スクリプトの親フォルダ（Folderオブジェクト）を返す。
 * なお、戻り値の最後には/が付与される。
 */
function GetScriptDir() {
    var selfFile = null;
    try {
        selfFile = new File(decodeURI($.fileName || Folder.current.fullName));
    } catch (e) {
        return Folder.current.fullName.replace(/\/*$/, "/");
    }
    var dirPath = (selfFile !== null) ? selfFile.parent.fullName : Folder.current.fullName;

    // 末尾にスラッシュがなければ付与して返す
    return dirPath.replace(/\/*$/, "/");
}

// ---------------------------------------------------------------------------------


//-----------------------------------
// クラス CHuman
//-----------------------------------

// 1. コンストラクタ定義
function CHuman() {
}

// 2. プロトタイプメソッドの定義
CHuman.prototype.HayHelloAnyone = function( Anyone ) {
    alert(LangStrings.hello_world + "\n" + Anyone );
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
    this.HayHelloAnyone( LangStrings.boy );
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
    this.HayHelloAnyone( LangStrings.girl );
}


//-----------------------------------
// クラス CHelloWorldDlg
//-----------------------------------

// 1. コンストラクタ定義
function CHelloWorldDlg() {
    CPaletteWindow.call( this, _MAX_INSTANCES, false );      // コンストラクタ
    var self = this;                                         // クラスへののポインタを確保

    // GUI用のスクリプトを読み込む
    if ( self.LoadGUIfromJSX( GetScriptDir() + LangStrings.GUI_JSX ) )
    {
        // GUIに変更を入れる
        self.button1.onClick = function() { self.onSayHelloWorldClick(); }

        // 最後に、新しいインスタンスを追加
        self.RegisterInstance();
    }
    else {
        alert("GUIが未定です");
        return;
    }
}

// 2. クラス継承
ClassInheritance(CHelloWorldDlg, CPaletteWindow);


// 3. プロトタイプメソッドの定義
CHelloWorldDlg.prototype.SayHelloWorld = function() {
    var self = this;
    self.HelloWorld( new CBoy() );
    self.HelloWorld( new CGirl() );
    self.close();
} 

CHelloWorldDlg.prototype.onSayHelloWorldClick = function() {
    var self = this;
    try
    {
        self.CallFunc( ".SayHelloWorld()" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CHelloWorldDlg.prototype.HelloWorld = function( ClassOfSomeone ) {
    ClassOfSomeone.HayHello();
}


main();

function main()
{
    try
    {
        // 新しいインスタンスを生成
        var Obj  = new CHelloWorldDlg() ;

        // インスタンスを表示
        Obj.show();
    }
    catch(e)
    {
        alert( e.message );
    }
}
