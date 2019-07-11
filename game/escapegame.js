var EscapeGame = function()
{
	var preloadimgs = [];		// 事前読み込みの画像オブジェクトのリスト
	var scenes = [];			// シーンのIDリスト
	var messagebox = null;		// メッセージボックス
	var messagetimerid = null;	// メッセージを自動的に消すタイマーのID
	var history = [];			// 最近の履歴（シーンのIDリスト）
	var historymax = 16;		// 履歴の最大保存数
	var drags = [];				// ドラッグ化したオブジェクトのIDリスト
	var forms = [];				// フォームのIDリスト

	// お決まりの
	var $ = function( id ){ return document.getElementById( id ); };

	// バブリングを抑止
	// この部分はoz-riddleさんのコードを参考にさせていただきました
	// http://ozriddle.web.fc2.com/

	function stopEvent( evt )
	{
		if( evt.stopPropagation ) evt.stopPropagation();
		else if( window.event ) window.event.cancelBubble = true;

		if( evt.preventDefault ) evt.preventDefault();
		else if( window.event ) window.event.returnValue = false;
	};
	// クロスブラウザでaddEventListenerを行う
	function addEvent( obj, type, listener, useCapture )
	{
		if( obj.addEventListener ) obj.addEventListener( type, listener, useCapture );
		else if( obj.attachEvent ) obj.attachEvent( 'on' + type, listener );
	};

	// styleを取得
	// elemet.styleだとインラインで指定したものしか取得できないため
	function getStyle( e )
	{
		if( document.defaultView && document.defaultView.getComputedStyle )
			return document.defaultView.getComputedStyle( e, '' );
		else if( e.currentStyle )
			return e.currentStyle;
		return e.style;
	};

	// 文字列sのハッシュ(MD2)。通常128bitのところ144bitをbase64で返す
	// http://www.ietf.org/rfc/rfc1319.txt
	// 下のページが非常に参考になりました
	// http://user1.matsumoto.ne.jp/~goma/js/hash.html
	function messageDigest2( s )
	{
		var i, j, k, c, n, t, len;

		// 円周率をもとに作成された乱数テーブルらしい
		var PI_SUBST = [
		0x29, 0x2E, 0x43, 0xC9, 0xA2, 0xD8, 0x7C, 0x01, 0x3D, 0x36, 0x54, 0xA1, 0xEC, 0xF0, 0x06, 0x13,
		0x62, 0xA7, 0x05, 0xF3, 0xC0, 0xC7, 0x73, 0x8C, 0x98, 0x93, 0x2B, 0xD9, 0xBC, 0x4C, 0x82, 0xCA,
		0x1E, 0x9B, 0x57, 0x3C, 0xFD, 0xD4, 0xE0, 0x16, 0x67, 0x42, 0x6F, 0x18, 0x8A, 0x17, 0xE5, 0x12,
		0xBE, 0x4E, 0xC4, 0xD6, 0xDA, 0x9E, 0xDE, 0x49, 0xA0, 0xFB, 0xF5, 0x8E, 0xBB, 0x2F, 0xEE, 0x7A,
		0xA9, 0x68, 0x79, 0x91, 0x15, 0xB2, 0x07, 0x3F, 0x94, 0xC2, 0x10, 0x89, 0x0B, 0x22, 0x5F, 0x21,
		0x80, 0x7F, 0x5D, 0x9A, 0x5A, 0x90, 0x32, 0x27, 0x35, 0x3E, 0xCC, 0xE7, 0xBF, 0xF7, 0x97, 0x03,
		0xFF, 0x19, 0x30, 0xB3, 0x48, 0xA5, 0xB5, 0xD1, 0xD7, 0x5E, 0x92, 0x2A, 0xAC, 0x56, 0xAA, 0xC6,
		0x4F, 0xB8, 0x38, 0xD2, 0x96, 0xA4, 0x7D, 0xB6, 0x76, 0xFC, 0x6B, 0xE2, 0x9C, 0x74, 0x04, 0xF1,
		0x45, 0x9D, 0x70, 0x59, 0x64, 0x71, 0x87, 0x20, 0x86, 0x5B, 0xCF, 0x65, 0xE6, 0x2D, 0xA8, 0x02,
		0x1B, 0x60, 0x25, 0xAD, 0xAE, 0xB0, 0xB9, 0xF6, 0x1C, 0x46, 0x61, 0x69, 0x34, 0x40, 0x7E, 0x0F,
		0x55, 0x47, 0xA3, 0x23, 0xDD, 0x51, 0xAF, 0x3A, 0xC3, 0x5C, 0xF9, 0xCE, 0xBA, 0xC5, 0xEA, 0x26,
		0x2C, 0x53, 0x0D, 0x6E, 0x85, 0x28, 0x84, 0x09, 0xD3, 0xDF, 0xCD, 0xF4, 0x41, 0x81, 0x4D, 0x52,
		0x6A, 0xDC, 0x37, 0xC8, 0x6C, 0xC1, 0xAB, 0xFA, 0x24, 0xE1, 0x7B, 0x08, 0x0C, 0xBD, 0xB1, 0x4A,
		0x78, 0x88, 0x95, 0x8B, 0xE3, 0x63, 0xE8, 0x6D, 0xE9, 0xCB, 0xD5, 0xFE, 0x3B, 0x00, 0x1D, 0x39,
		0xF2, 0xEF, 0xB7, 0x0E, 0x66, 0x58, 0xD0, 0xE4, 0xA6, 0x77, 0x72, 0xF8, 0xEB, 0x75, 0x4B, 0x0A,
		0x31, 0x44, 0x50, 0xB4, 0x8F, 0xED, 0x1F, 0x1A, 0xDB, 0x99, 0x8D, 0x33, 0x9F, 0x11, 0x83, 0x14
		];

		// base64変換用の文字列
		var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		// s が文字列でないのなら '' にする
		if( typeof( s ) != typeof( 'string' ) ) s = '';

		// 文字列 s を UTF-8 のバイナリデータ（配列）にする
		len = s.length;
		j = 0;
		var data = [];
		for( i = 0; i < len; i++ )
		{
			n = s.charCodeAt( i ); // ユニコードなので注意
			if( n <= 0x7F ) // アスキーコードと同じ
			{
				data[j++] = n;
			}
			// 以下はユニコードをUTF-8に変換している
			else if( n <= 0x07FF )
			{
				data[j++] = 0xC0 | ((n >>>  6) & 0x1F);
				data[j++] = 0x80 | ((n       ) & 0x3F);
			}
			else if( n <= 0xFFFF )
			{
				data[j++] = 0xE0 | ((n >>> 12) & 0x0F);
				data[j++] = 0x80 | ((n >>>  6) & 0x3F);
				data[j++] = 0x80 | ((n       ) & 0x3F);
			}
			else if( n <= 0x1FFFFF )
			{
				data[j++] = 0xF0 | ((n >>> 18) & 0x07);
				data[j++] = 0x80 | ((n >>> 12) & 0x3F);
				data[j++] = 0x80 | ((n >>>  6) & 0x3F);
				data[j++] = 0x80 | ((n       ) & 0x3F);
			}
			else if( n <= 0x03FFFFFF )
			{
				data[j++] = 0xF8 | ((n >>> 24) & 0x03);
				data[j++] = 0x80 | ((n >>> 18) & 0x3F);
				data[j++] = 0x80 | ((n >>> 12) & 0x3F);
				data[j++] = 0x80 | ((n >>>  6) & 0x3F);
				data[j++] = 0x80 | ((n       ) & 0x3F);
			}
			else
			{
				data[j++] = 0xFC | ((n >>> 30) & 0x01);
				data[j++] = 0x80 | ((n >>> 24) & 0x3F);
				data[j++] = 0x80 | ((n >>> 18) & 0x3F);
				data[j++] = 0x80 | ((n >>> 12) & 0x3F);
				data[j++] = 0x80 | ((n >>>  6) & 0x3F);
				data[j++] = 0x80 | ((n       ) & 0x3F);
			}
		}
		// ブロックサイズ(16byte)の半端に詰め物をする
		j = data.length;
		n = 16 - (j & 0xF);
		for( i = 0; i < n; i++ ) data[j++] = n;

		// チェックサムを付加
		j = data.length;
		len = j;
		for( i = 0; i < 16; i++ ) data[j++] = 0;
		t = 0;
		for( i = 0; i < len; i += 16 )
			for( k = 0; k < 16; k++ )
			{
				data[len+k] ^= PI_SUBST[data[i+k] ^ t];
				t = data[len+k];

				// ↑を下のようにするとOpera(10.63で確認)の動作が他と違うので注意
				// t = data[len+k] ^= PI_SUBST[data[i+k] ^ t];
			}

		// 回す
		var X = [];
		for( i = 0; i < 48; i++ ) X[i] = 0;
		j = data.length;
		len = j;
		for( i = 0; i < len; i += 16 )
		{
			for( j = 0; j < 16; j++ )
			{
				X[16 + j] = data[i + j];
				X[32 + j] = X[16 + j] ^ X[j];
			}
			t = 0;
			for( j = 0; j < 18; j++ )
			{
				for( k = 0; k < 48; k++ )
				{
					X[k] ^= PI_SUBST[t];
					t = X[k];
				}
				t = ( t + j ) & 0xFF;
			}
		}

		// 結果を文字列にする
		// 144bitをbase64
		var result = '';
		for( i = 0; i < 18; i += 3 )
		{
			n = (X[i+0] << 16) | (X[i+1] << 8) | X[i+2];
			result += B64.charAt( (n >>> 18) & 0x3F )
					+ B64.charAt( (n >>> 12) & 0x3F )
					+ B64.charAt( (n >>>  6) & 0x3F )
					+ B64.charAt(  n         & 0x3F );
		}

		return result;
	};

	// メッセージのタイマーが設定されているならクリア
	function messageTimerClear()
	{
		if( messagetimerid != null )
		{
			clearTimeout( messagetimerid );
			messagetimerid = null;
		}
	};

	// 指定したidにメッセージを表示するように設定
	this.setMessageBox = function( id )
	{
		var elm = $( id );
		messagebox = elm ? elm : null;

		messageTimerClear();
	};

	// メッセージを更新
	// timer:消えるまでの時間(ms単位)。省略ならずっと表示
	this.message = function( str, timer )
	{
		if( messagebox ) messagebox.innerHTML = str;

		messageTimerClear();

		// タイマー設定
		if( timer )
		{
			var func = function()
			{
				if( messagebox ) messagebox.innerHTML = '';
				messagetimerid = null;
			};
			messagetimerid = setTimeout( func, timer );
		}
	};

	// シーンのidを追加
	this.addScenes = function( id )
	{
		// idが文字列なら配列にする
		if( typeof( id ) == typeof( 'string' ) ) id = [id];

		// 重複は追加しないようにして追加
		var storage = {};
		for( var i = 0; i < scenes.length; i++ ) storage[scenes[i]] = true;
		for( var i = 0; i < id.length; i++ )
		{
			var val = id[i];
			if( !(val in storage) )
			{
				storage[val] = true;
				scenes.push( val );
			}
		}
	};

	// シーンチェンジする
	// 指定idだけvisibility:visibleにして表示。他はvisibility:hidden
	// displayにしない理由はdisplay:noneだとgetComputedStyleで座標などを取得できないブラウザがあるため
	this.changeScene = function( id )
	{
		for( var i = 0; i < scenes.length; i++ )
		{
			var elm = $( scenes[i] );
			if( !elm ) continue;
			elm.style.visibility = ( scenes[i] == id ) ? 'visible' : 'hidden';
		}

		// 最近の履歴に保存
		history.push( id );
		while( history.length > historymax ) history.shift();

		// メッセージを自動的にクリアする
		// 以前のタイマーが設定されているならクリア
		if( messagebox ) messagebox.innerHTML = '';
		messageTimerClear();
	};

	// シーンをnum個巻き戻す
	this.backScene = function( num )
	{
		var id = '';

		// numが数字でないもしくは0以下なら 1 にする
		if( typeof( num ) != typeof( 0 ) || num <= 0 ) num = 1;

		// 履歴を遡る
		for( var i = 0; i <= num && history.length > 0; i++ ) id = history.pop();

		// シーンチェンジ
		this.changeScene( id );
	};

	// 指定したidのオブジェクトをクリックするとtriggerを実行するようにする
	this.setTrigger = function( id, trigger )
	{
		var clickTrigger = function( evt )
		{
			var obj = evt.target ? evt.target : evt.srcElement;
			if( obj.trigger ) obj.trigger();
			stopEvent( evt );
			return false;
		};

		var elm = $( id );
		if( !elm ) return;

		elm.trigger = trigger;
		addEvent( elm, 'click', clickTrigger, false );
	};

	// 指定したidのオブジェクトをドラッグできるようにする
	// mode==1ならはマウスを放すと元の位置に戻る
	// rectで稼動範囲を指定（rectの各要素が数字以外なら無限移動可能）
	this.setDrag = function( id, mode, rect )
	{
		var dragStart = function( evt )
		{
			var obj = evt.target ? evt.target : evt.srcElement;
			obj.drag_flag = true;
			obj.drag_x = evt.clientX - parseInt( obj.style.left );
			obj.drag_y = evt.clientY - parseInt( obj.style.top );
			// z-indexの優先度を上げて手前に表示されるようにする
			obj.style.zIndex = parseInt( obj.style.zIndex ) + 256 + '';
			stopEvent( evt );
			return false;
		};
		var dragMove = function( evt )
		{
			var obj = evt.target ? evt.target : evt.srcElement;
			if( !obj.drag_flag ) return false;
			var x = evt.clientX - obj.drag_x;
			var y = evt.clientY - obj.drag_y;
			var width = obj.offsetWidth;;
			var height = obj.offsetHeight;
			if( obj.drag_rect )
			{
				var typeofnum = typeof( 0 );
				if( typeof( obj.drag_rect[2] ) == typeofnum && x > obj.drag_rect[2] - width)
				{
					x = obj.drag_rect[2] - width;
				}
				if( typeof( obj.drag_rect[0] ) == typeofnum && x < obj.drag_rect[0] )
				{
					x = obj.drag_rect[0];
				}
				if( typeof( obj.drag_rect[3] ) == typeofnum && y > obj.drag_rect[3] - height)
				{
					y = obj.drag_rect[3] - height;
				}
				if( typeof( obj.drag_rect[1] ) == typeofnum && y < obj.drag_rect[1] )
				{
					y = obj.drag_rect[1];
				}
			}
			obj.style.left = x + 'px';
			obj.style.top = y + 'px';
			stopEvent( evt );
			return false;
		};
		var dragEnd = function( evt )
		{
			var obj = evt.target ? evt.target : evt.srcElement;
			if( !obj.drag_flag ) return;
			obj.drag_flag = false;
			if( obj.drag_mode == 1 )
			{
				obj.style.left = obj.drag_orgleft;
				obj.style.top = obj.drag_orgtop;
			}
			// 何かの役に立つかもしれないのでドラッグした回数をカウント
			obj.drag_count = obj.drag_count + 1;
			// z-indexを元に戻す
			obj.style.zIndex = parseInt( obj.style.zIndex ) - 256 + '';
			stopEvent( evt );
		};

		// rect配列でないかどうかの判定
		// ===:厳密等価演算子
		// !==:厳密非等価演算子
		if( typeof( rect) != typeof( [] ) || rect.constructor !== [].constructor ) rect = [null, null, null, null];

		var elm = $( id );
		if( !elm ) return;

		elm.style.cursor = 'move';
		elm.style.position = 'absolute';
		elm.drag_flag = false;
		elm.drag_mode = mode;
		elm.drag_rect = rect;
		elm.drag_count = 0;
		var style = getStyle( elm ); // elm.styleでは外部CSSも含めたstyleを取得できないので
		var z = parseInt( style.zIndex );
		elm.style.left   = parseInt( style.left ) + 'px';
		elm.style.top    = parseInt( style.top ) + 'px';
		elm.style.zIndex = (z <= 0) ? 1 : z;
		elm.drag_orgleft = elm.style.left;
		elm.drag_orgtop = elm.style.top;
		addEvent( elm, 'mousedown', dragStart, false );
		addEvent( elm, 'mouseout', dragEnd, false );
		addEvent( elm, 'mouseup', dragEnd, false );
		addEvent( elm, 'mousemove', dragMove, false );

		// IDをリストに保存
		// 重複は追加しないようにしする
		var storage = {};
		for( var i = 0; i < drags.length; i++ ) storage[drags[i]] = true;
		if( !(id in storage) ) drags.push( id );
	};

	// 全てのドラッグ化したオブジェクトの座標やカウンタをリセット
	// 注：ドラッグ化を解くわけではないので名前はrestart
	this.restartAllDrag = function()
	{
		for( var i = 0; i < drags.length; i++ )
		{
			var e = $( drags[i] );
			e.style.left = e.drag_orgleft;
			e.style.top  = e.drag_orgtop;
			e.drag_count = 0;
		}
	};

	// プリロードする画像をファイル名で追加
	// ファイル名は配列でも可
	this.addPreLoadImages = function( src )
	{
		// srcが文字列なら配列にする
		if( typeof( src ) == typeof( 'string' ) ) src = [src];

		// 重複しないようにしながら追加
		var storage = {};
		var i, val, img;
		for( i = 0; i < preloadimgs.length; i++ ) storage[preloadimgs[i].src] = true;
		for( var i = 0; i < src.length; i++ )
		{
			img = new Image();
			img.src = src[i];
			val = img.src;
			if( !(val in storage) )
			{
				storage[val] = true;
				preloadimgs.push( img );
			}
		}
	};

	// プリロード指定した画像が全てロード完了ならfuncを実行
	this.ifLoadComplete = function( func )
	{
		checkLoaded();

		function checkLoaded()
		{
			var count = 0;

			for( var i = 0; i < preloadimgs.length; i++ )
				if( preloadimgs[i].complete ) count++;

			(count == preloadimgs.length) ? func() : setTimeout( checkLoaded, 333 );
		};
	};

	// 指定したidの入力フォームでキーワードを受け付けるようにする
	// md2:salt+キーワードをMD2にしたもの
	// salt:salt
	// maxlength:受け付ける最大文字数（これを超える入力は全てNGにする）
	// okFunc:キーワードが一致したときに実行する関数
	// ngFunc:キーワードが一致しなかったときに実行する関数
	this.setForm = function( id, md2, salt, maxlength, okFunc, ngFunc )
	{
		var submit = function( evt )
		{
			var obj = evt.target ? evt.target : evt.srcElement;

			do
			{
				// input要素の中で最初のtype=(text|password)を入力キーワードとみなす
				var i;
				var input_str = null;
				var elms = document.getElementsByTagName( 'input' );
				if( !elms ) break;
				for( i = 0; i < elms.length; i++ )
				{
					if( elms[i].type == 'text' || elms[i].type == 'password' )
					{
						input_str = elms[i].value;
						break;
					}
				}
				if( (input_str+'').length <= obj.form_maxlength && messageDigest2( obj.form_salt + input_str ) == obj.form_md2 )
				{
					obj.form_okFunc();
				}
				else
				{
					obj.form_ngFunc();
				}
			} while( false );

			stopEvent( evt );
			return false;
		};

		var elm = $( id );
		if( !elm ) return;
		if( typeof( elm.reset ) == typeof( submit ) ) elm.reset();
		if( typeof( maxlength ) != typeof( 0 ) ) maxlength = 16;
		if( maxlength <= 0 ) maxlength = 1;
		if( !okFunc ) okFunc = function(){};
		if( !ngFunc ) ngFunc = function(){};
		elm.form_md2       = md2;
		elm.form_salt      = salt;
		elm.form_maxlength = maxlength;
		elm.form_okFunc    = okFunc;
		elm.form_ngFunc    = ngFunc;
		addEvent( elm, 'submit', submit, false );

		// IDをリストに保存
		// 重複は追加しないようにしする
		var storage = {};
		var i;
		for( i = 0; i < forms.length; i++ ) storage[forms[i]] = true;
		if( !(id in storage) ) forms.push( id );
	};

	// 全てのフォームをリセット
	// 注：設定を解くわけではないので名前はrestart
	this.restartAllForm = function()
	{
		for( var i = 0; i < forms.length; i++ ) $( forms[i] ).reset();
	};

};

//TimeOut
function timeOut(){
		 function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);

  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}
	function isTime(){
		alert("TimeOut");
	}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      isTime();
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date(Date.parse(new Date()) +  5 * 60 * 1000);
initializeClock('clockdiv', deadline);
}
