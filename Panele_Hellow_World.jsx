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

// Ver.1.0 : 2026/02/07

#target illustrator
#targetengine "main"


// 最大保持数
var _MAX_INSTANCES = 5;


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


// --- グローバル関数 -----------------------------------------------------------------

//-----------------------------------
// クラス CGlobalArray
//-----------------------------------

// 1. コンストラクタ定義
function CGlobalArray(Max) {
    var self = this;

    this.ObjectNo = -1;
    this.MAX_INSTANCES = Max;

    // 1. 実行中のスクリプト名を取得（拡張子なし）
    var scriptName = decodeURI(File($.fileName).name).replace(/\.[^\.]+$/, "");

     // 2. グローバルに格納するためのユニークなキー名を作成
    self.storageKey = "store_" + scriptName;
    self.indexKey   = "idx_" + scriptName;

    // 3. ブラケット記法 [] を使って、動的に $.global のプロパティにアクセス
    if (!($.global[self.storageKey] instanceof Array)) {
        $.global[self.storageKey] = [];
        $.global[self.indexKey  ] = 0;       // 次に書き込むインデックスを管理
    }
}

/**
 * オブジェクトのプロトタイプを継承しつつ、プロパティをコピーする（ES3互換）
 * @param {Object} obj - コピー元のインスタンス
 * @returns {Object} - 新しく生成されたクローン
 */
CGlobalArray.prototype.cloneInstance = function(obj) {
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
 * $.global[self.storageKey] に、オブジェクトのクローンを登録する
 * @param {Object} newInst - インスタンス
 * @returns {数字} - 登録No(0〜)
 */
CGlobalArray.prototype.RegisterInstance = function(newInst) {
    var self = this;

    // newInstのプロパティに登録させたい値があれば、pushする前に、ここですること！！
    var idx = $.global[ self.indexKey ] ;

    // --- 上書き前の解放処理 ---
    if ($.global[self.storageKey] [idx]) {
        var oldInst = $.global[self.storageKey] [idx];
        
        // UI（ダイアログ）を閉じて破棄
        if (oldInst.m_Dialog) {
            try {
                oldInst.m_Dialog.close();
                oldInst.m_Dialog = null; 
            } catch(e) {
                $.writeln("Previous dialog close failed: " + e);
            }
        }
        
        // オブジェクトの全プロパティを削除して参照を切る
        for (var prop in oldInst) {
            if (oldInst.hasOwnProperty(prop)) {
                oldInst[prop] = null;
            }
        }
        $.global[self.storageKey] [idx] = null; // 明示的にnullを代入
    }

    // --- ガベージコレクションの実行 ---
    // 参照が切れたメモリを即座に回収対象にする
    $.gc(); 

    // クローンを作成する前に、設定が必要なプロパティに値を入れる
    newInst.m_ArrayOfObj.ObjectNo = idx;

    // クローンを作成して、指定した位置に代入（上書き）
    $.global[self.storageKey] [idx] = newInst.m_ArrayOfObj.cloneInstance(newInst);

    // 次の書き込み位置を更新（MAX_INSTANCES に達したら 0 に戻る）
    $.global[self.indexKey  ]  = (idx + 1) % self.MAX_INSTANCES;

    $.writeln("オブジェクト登録完了。No: " + newInst.m_ArrayOfObj.ObjectNo + " (次回の書き込み先: " + $.global[self.indexKey]  + ")");
    return newInst.m_ArrayOfObj.ObjectNo;;
}


/**
 * $.global[self.storageKey] への文字列を返します
 * @returns {文字列} - $.global[self.storageKey] への文字列
 */
CGlobalArray.prototype.GetGlobalClass = function() {
    var self = this;
    var name = "$.global['" + self.storageKey + "'][" + self.ObjectNo + "].";
    return name;
}


/**
 * 全てのインスタンスを一括で閉じるような操作も可能になります
 */
CGlobalArray.prototype.CloseAllInstances = function() {
    var self = this;

    if ( $.global[self.storageKey] .length > 0 ) {
        var instances = $.global[self.storageKey] ;
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].m_Dialog) {
                instances[i].m_Dialog.close();
            }
        }
        $.global[self.storageKey]  = []; // 配列をリセット
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
    this.m_ArrayOfObj = new CGlobalArray( _MAX_INSTANCES );

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
    $.writeln( "ObjectNo is " + self.m_ArrayOfObj.ObjectNo + " in show()." );
    self.CallFuncInGlobalArray( "m_Dialog.show()" );
} 

CHelloWorldDlg.prototype.CallFuncInGlobalArray = function( FuncName ) {
    var self = this;
    var name = self.m_ArrayOfObj.GetGlobalClass() + FuncName;
    eval( name );
}

CHelloWorldDlg.prototype.SayHelloWorld = function() {
    var self = this;
    self.HelloWorld( new CBoy() );
    self.HelloWorld( new CGirl() );
    self.m_Dialog.close();
} 

CHelloWorldDlg.prototype.CallFuncWithGlobalArray = function( FuncName ) {
    var self = this;
    if ( self.m_ArrayOfObj.ObjectNo >= 0 ) {
        var bt = new BridgeTalk;
        bt.target = BridgeTalk.appSpecifier;
        bt.body   = self.m_ArrayOfObj.GetGlobalClass() + FuncName + "();";
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
    try
    {
        var Obj  = new CHelloWorldDlg() ;

        // 実行するたびに配列に新しいインスタンスが追加されていきます
        // 戻り値は、登録された配列の番号です。
        Obj.m_ArrayOfObj.RegisterInstance( Obj );

        // 最新のインスタンスを表示
        Obj.show();
    }
    catch(e)
    {
        alert( e.message );
    }
}
