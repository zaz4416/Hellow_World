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

function RegisterInstance(obj) {

    /*
    // メソッドも含めて完全に複製（推奨）
    const newInst = new MyDialogClass();

    // プロトタイプ（メソッド）を維持したまま、中身をコピー
    $.global.myInstances[this.ObjectNo] = Object.assign(
        Object.create(Object.getPrototypeOf(newInst)), 
        newInst
    );
    */
    obj.ObjectNo = $.global.myInstances.length;
    $.global.myInstances.push(obj);
    var No = $.global.myInstances.length -1;
    $.writeln("オブジェクト登録完了。現在の登録数:" + $.global.myInstances.length + ", 登録No=" + No);

    return No;
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

// 3. 静的メソッドの定義
CHelloWorldDlg.prototype.SayHelloWorld = function() {
    var self = CHelloWorldDlg.self;
    self.HelloWorld( new CBoy() );
    self.HelloWorld( new CGirl() );
    eval( self.GetGlobalClass()+"m_Dialog.close()" );
} 

CHelloWorldDlg.prototype.CallFuncByGlobal = function( FuncName ) {
    var self = this;
    var bt = new BridgeTalk;
    bt.target = BridgeTalk.appSpecifier;
    bt.body   = self.GetGlobalClass() + FuncName + "();";
    bt.send();
}

CHelloWorldDlg.prototype.GetGlobalClass = function() {
    var name = "$.global.myInstances[" + this.ObjectNo + "].";
    return name;
}

// 4. プロトタイプメソッドの定義
CHelloWorldDlg.prototype.onSayHelloWorldClick = function() {
    try
    {
        this.CallFuncByGlobal( "SayHelloWorld" );
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
    var Obj = new CHelloWorldDlg();

    // 実行するたびに配列に新しいインスタンスが追加されていきます
    var No = RegisterInstance( Obj );

    // 最新のインスタンスを表示
    //$.global.myInstances[ No ].m_Dialog.show();
    eval( Obj.GetGlobalClass()+"m_Dialog.show()" );
}
