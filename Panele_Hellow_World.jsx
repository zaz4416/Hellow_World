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
   ボタンが押された　→　onClick　→　CallFuncWithGlobalArrayでBridgeTalkを使用してSayHelloWorldを呼ぶ　→　HelloWorldを呼ぶ
*/

// Ver.1.0 : 2026/02/06

#target illustrator
#targetengine "main"


// $.global.myInstancesが定義されていたら、解放する
//CloseAllInstances();


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


// スクリプト実行時に外部のJSXを読み込む
//$.evalFile(GetScriptDir() + "ZazLib/PaletteWindow.jsx");

// 外部のスクリプトを埋め込む
#include "zazlib/PaletteWindow.jsx"


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



if (!($.global.myInstances instanceof Array)) {
    $.global.myInstances = [];
}


// --- グローバル関数 -----------------------------------------------------------------
/**
 * オブジェクトのプロトタイプを継承しつつ、プロパティをコピーする（ES3互換）
 * @param {Object} obj - コピー元のインスタンス
 * @returns {Object} - 新しく生成されたクローン
 */
function cloneInstance(obj) {
    if (obj === null || typeof obj !== "object") return obj;

    // 1. プロトタイプを継承した新しいオブジェクトを作成
    var F = function() {};
    F.prototype = obj.constructor ? obj.constructor.prototype : Object.prototype;
    var clone = new F();

    // 2. 自身のプロパティをコピー (Object.assignの代用)
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = obj[key];
        }
    }
    return clone;
}


/**
 * $.global.myInstancesに、オブジェクトのクローンを登録する
 * @param {Object} newInst - インスタンス
 * @returns {数字} - 登録No(0〜)
 */
function RegisterInstance(newInst) {
    // newInstのプロパティに登録させたい値があれば、pushする前に、ここですること！！
    if (typeof $.global.myInstances === "undefined") {
        newInst.ObjectNo = 0;
    } else{
        newInst.ObjectNo = $.global.myInstances.length;
    }

    // newInstをpush
    $.global.myInstances.push( cloneInstance(newInst) );

    $.writeln("オブジェクト登録完了。現在の登録数:" + $.global.myInstances.length + ", 登録No=" + newInst.ObjectNo);
    return newInst.ObjectNo;;
}


/**
 * $.global.myInstancesへの文字列を返します
 * @param {数字} No - 配列の番号(0〜)
 * @returns {文字列} - $.global.myInstancesへの文字列
 */
function GetGlobalClass(No) {
    var name = "$.global.myInstances[" + No + "].";
    return name;
}


/**
 * 全てのインスタンスを一括で閉じるような操作も可能になります
 */
function CloseAllInstances() {
    if ( $.global.myInstances.length > 0 ) {
        var instances = $.global.myInstances;
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].m_Dialog) {
                instances[i].m_Dialog.close();
            }
        }
        $.global.myInstances = []; // 配列をリセット
    }
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
    CPaletteWindow.call( this, false );      // コンストラクタ
    var self = this;                         // クラスへののポインタを確保
    this.ObjectNo = -1;

    // GUI用のスクリプトを読み込む
    if ( self.LoadGUIfromJSX( GetScriptDir() + LangStrings.GUI_JSX ) )
    {
        // GUIに変更を入れる
        self.button1.onClick = function() { self.onSayHelloWorldClick(); }
    }
    else {
        alert("GUIが未定です");
        return;
    }
}

// 2. クラス継承
ClassInheritance(CHelloWorldDlg, CPaletteWindow);


// 3. プロトタイプメソッドの定義
CHelloWorldDlg.prototype.show = function() {
    var self = this;
    $.writeln( "ObjectNo is " + self.ObjectNo + " in show()." );
    self.m_Dialog.show();
} 

CHelloWorldDlg.prototype.SayHelloWorld = function() {
    var self = this;
    self.HelloWorld( new CBoy() );
    self.HelloWorld( new CGirl() );
    self.m_Dialog.close();
} 

CHelloWorldDlg.prototype.CallFuncWithGlobalArray = function( FuncName ) {
    var self = this;
    if ( self.ObjectNo >= 0 ) {
        var bt = new BridgeTalk;
        bt.target = BridgeTalk.appSpecifier;
        bt.body   = GetGlobalClass( this.ObjectNo ) + FuncName + "();";
        bt.send();
    } else {
        alert("Undefine ObjectNo in CallFuncWithGlobalArray.");
    }
}

CHelloWorldDlg.prototype.onSayHelloWorldClick = function() {
    var self = this;
    try
    {
        self.CallFuncWithGlobalArray( "SayHelloWorld" );
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
    // 実行するたびに配列に新しいインスタンスが追加されていきます
    // 戻り値は、登録された配列の番号です。
    var No = RegisterInstance( new CHelloWorldDlg() );

    // 最新のインスタンスを表示
    eval( GetGlobalClass( No ) + "show()" );
}
