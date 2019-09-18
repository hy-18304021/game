var esc = new EscapeGame();
esc.addPreLoadImages( ['images/gameover1.png'] );
var flag = [];
var $$ = function( id ){ return document.getElementById( id ); };
esc.addScenes( ['nowloading', 'title', 'sea', 'beach', 'forest','house', 'ome','over'] );
//アイテムid
var atem_id=null;
//ズームid
var zoom_id=0;
(function()
{
var load = function()
{
esc.setMessageBox( 'messagebox' );
				
var turnSea = function()
{
	esc.changeScene( 'sea' );
	esc.message( '海だ。', 1000 );
};
var turnBeach = function()
{
	esc.changeScene( 'beach' );
	esc.message( '海岸だ。', 1000 );
};
var turnForest = function()
{
	esc.changeScene( 'forest' );
	esc.message( '森だ。', 1000 );
};
var turnHouse = function()
{
	esc.changeScene( 'house' );
	esc.message( '小屋の中にいる。', 1000 );
};
		
var back = function()
{
	esc.backScene();
};

//初期化用
var reset=function(){
	esc.restartAllForm();
	esc.message( '' );
	flag = [];
	resetgame();
	esc.changeScene('title');
}
				
				
//sea
esc.setTrigger( 'sea_left_trigger', turnBeach );
esc.setTrigger( 'sea_right_trigger', turnForest );
// bottle is clicked
esc.setTrigger( 'closed_bottle',
	function()
	{
		$$('item_closed_bottle').style.display='block';
		$$('item_closed_bottle').style.visibility = 'inherit';
		$$('closed_bottle').style.visibility = 'hidden';
		esc.message( 'ボトルを拾った',3000 );
		}
);
//beach
esc.setTrigger( 'beach_left_trigger', turnForest );
esc.setTrigger( 'beach_right_trigger', turnSea );
				
//forest
esc.setTrigger( 'forest_left_trigger', turnSea );
esc.setTrigger( 'forest_right_trigger', turnBeach );
esc.setTrigger( 'forest_previous_trigger', turnHouse );
esc.setTrigger( 'boxkey',
	function()
	{
		$$('item_boxkey').style.display='block';
		$$('item_boxkey').style.visibility = 'inherit';
		$$('boxkey').style.visibility = 'hidden';
		esc.message( '鍵を拾った',3000 );
	}
);
//house
esc.setTrigger( 'house_down_trigger', turnForest );
esc.setTrigger( 'house_door', turnHouse);
esc.setTrigger( 'dynamite', function(){						
	$$('item_dynamite').style.display='block';
	$$('item_dynamite').style.visibility = 'inherit';
	$$('dynamite').style.visibility = 'hidden';
	esc.message( 'ダイナマイトを拾った',3000 );
});
esc.setTrigger( 'alcohol',
	function()
	{
		$$('item_alcohol').style.display='block';
		$$('item_alcohol').style.visibility = 'inherit';
		$$('alcohol').style.visibility = 'hidden';
		esc.message( '消毒用アルコールを拾った',3000 );
	}
);
//初期スポーン地点
esc.setTrigger( 'start',function(){
	
	turnSea();
});
					
//ゲームオーバーからタイトルへ
esc.setTrigger('over_title',reset);

//クリアからタイトルへ
esc.setTrigger('ome_title',reset);

//アイテム拡大
esc.setTrigger('item_closed_bottle',function(){
	setMid('cbm');
	esc.message( 'フタの閉じた瓶だ。',3000 );
});
esc.setTrigger('item_open_bottle',function(){
	setMid('opm');
	esc.message( '空き瓶だ。',3000 );
});
esc.setTrigger('item_filled_bottle',function(){
	setMid('fbm');
	esc.message( '水の入った瓶だ。',3000 );
});
esc.setTrigger('item_alcohol',function(){
	setMid('am');
	esc.message( '消毒用アルコールだ。',3000 );
});
esc.setTrigger('item_letter',function(){
	setMid('lm');
	esc.message( '手紙だ。',3000 );
});
esc.setTrigger('item_alcohol_letter',function(){
	setMid('alm');
	esc.message( 'アルコールの染みた手紙だ。',3000 );
});
esc.setTrigger('item_kindled_letter',function(){
	setMid('klm');
	esc.message( '火のついた手紙だ。',3000 );
});
esc.setTrigger('item_dynamite',function(){
	setMid('dm');
	esc.message( 'ダイナマイトだ。',3000 );
});
esc.setTrigger('item_boxkey',function(){
	setMid('bkm');
	esc.message( '鍵だ。',3000 );
});
//アイテム変換
//item_closed_bottleからアイテム変換
esc.setTrigger('modal_closed_bottle',function(){
    $$('modal_closed_bottle').style.display = 'none';
	$$('item_closed_bottle').style.display = 'none';
	$$('item_open_bottle').style.display = 'inherit';
	$$('item_letter').style.display = 'inherit';
	$$('close_modal').style.display = 'none';
	esc.message( 'フタをはずした。',3000 );
	zoom_id=0;
});

//item_open_bottleをitem_filled_bottleに変換
esc.setTrigger('water',function(){
	//item_open_bottleを選択している時
	if(atem_id=='opm'){
		$$('item_open_bottle').style.display = 'none';
		$$('item_filled_bottle').style.display = 'inherit';
		$$('item_zoom').style.display = 'none';
		esc.message( '瓶に水を入れた。',3000 );
		zoom_id=0;
	}else{
		esc.message( '海だ。沖に船が見える。',3000 );
	}

});

//boxを開ける
esc.setTrigger('closed_box',function(){
	if(atem_id=='bkm'){
		$$('item_boxkey').style.display = 'none';
		$$('closed_box').style.display = 'none';
		$$('open_box').style.display = 'inherit';
		$$('item_zoom').style.display = 'none';
		zoom_id=0;
		esc.message( '箱を開けた',3000 );
	}
});

//item_alcohol_letterにする
esc.setTrigger( 'modal_letter', function(){					
	//item_alcoholを選択している時
	if(atem_id=='am'){
		$$('modal_letter').style.display = 'none';
		$$('item_letter').style.display = 'none';
		$$('item_alcohol').style.display = 'none';
		$$('item_alcohol_letter').style.display = 'inherit';
		$$('close_modal').style.display = 'none';
		esc.message( '手紙にアルコールを染み込ませた。',3000 );
		$('.js-modal').fadeOut();
		zoom_id=0;
	}else{
		esc.message( '瓶に守られてここまでたどり着いたのだろうが、文字は掠れてしまっている。',3000 );
	}
});

//item_kindled_letterに変換
esc.setTrigger( 'modal_alcohol_letter', function(){	
	if(atem_id=="fbm"){
		$$('modal_alcohol_letter').style.display = 'none';
		$$('item_alcohol_letter').style.display = 'none';
		$$('item_filled_bottle').style.display = 'none';
		$$('item_kindled_letter').style.display = 'inherit';
		$$('close_modal').style.display = 'none';
		esc.message( '光が集まり、煙があがった。',3000 );
		$('.js-modal').fadeOut();
		zoom_id=0;
	}
});

//クリアまで
esc.setTrigger( 'modal_dynamite', function(){	
	if(atem_id=="klm"){
		$$('modal_dynamite').style.display = 'none';
		$$('item_dynamite').style.display = 'none';
		$$('item_kindled_letter').style.display = 'none';
		$$('close_modal').style.display = 'none';
		$('.js-modal').fadeOut();
		esc.changeScene('ome');
		//クリア処理に飛ばす
    }
});

esc.ifLoadComplete( function(){ esc.changeScene('title'); } );
};
				
if( window.addEventListener )
	{
		window.addEventListener( 'load', load, false );
    }
else if( window.attachEvent )
	{
		window.attachEvent( 'on'+'load', load );
	}
	load = null; // なんとなく
})();

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
	esc.changeScene( 'over' );
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

function popupImage() {
	var popup = document.getElementById('js-popup');
	if(!popup) return;
		var blackBg = document.getElementById('js-black-bg');

		var blackBg = document.getElementById('js-black-bg');
		var closeBtn = document.getElementById('js-close-btn');
		var showBtn = document.getElementById('js-show-popup');

		closePopUp(blackBg);
		closePopUp(closeBtn);
		closePopUp(showBtn);
		function closePopUp(elem) {
   		if(!elem) return;
    		elem.addEventListener('click', function() {
	    	popup.classList.toggle('is-show');
   	    });
    }
}

popupImage();

function setMid(m_img){
atem_id=m_img;
console.log(atem_id);

bordernone();

switch(atem_id){
    case "cbm":
        $$('item_closed_bottle').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;
                        
    case "opm":
        $$('item_open_bottle').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;

    case "lm":
        $$('item_letter').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;

    case "am":
        $$('item_alcohol').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;

    case "fbm":
        $$('item_filled_bottle').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;

    case "alm":
        $$('item_alcohol_letter').style.border = 'solid';
        console.log(atem_id+'クリック');
		break;
	
	case "klm":
		$$('item_kindled_letter').style.border = 'solid';
        console.log(atem_id+'クリック');
		break;

    case "dm":
        $$('item_dynamite').style.border = 'solid';
        console.log(atem_id+'クリック');
        break;
	
	case "bkm":
		$$('item_boxkey').style.border = 'solid';
		console.log(atem_id+'クリック');
		break;
	}

	if(zoom_id==0){
    	$$('item_zoom').style.display = 'inherit';
	}
}

//拡大用
function itemModal(){
console.log(atem_id+'外');
zoom_id=1;
imgnone();

switch(atem_id){
	case "cbm":
		$$('modal_closed_bottle').style.display = 'inherit';
		$$('item_closed_bottle').style.border = 'hidden';
		console.log(atem_id+'中');
		break;
				
	case "opm":
		$$('modal_open_bottle').style.display = 'inherit';
		$$('item_open_bottle').style.border = 'hidden';
		console.log(atem_id+'中');
    	break;
        
    case "lm":
		$$('modal_letter').style.display = 'inherit';
		$$('item_letter').style.border = 'hidden';
		console.log(atem_id+'中');
    	break;
    
	case "am":
		$$('modal_alcohol').style.display = 'inherit';
		$$('item_alcohol').style.border = 'hidden';
		console.log(atem_id+'中');
    	break;
    
	case "fbm":
		$$('modal_filled_bottle').style.display = 'inherit';
		$$('item_filled_bottle').style.border = 'hidden';
		console.log(atem_id+'中');
 		break;
    
    case "alm":
		$$('modal_alcohol_letter').style.display = 'inherit';
        $$('item_alcohol_letter').style.border = 'hidden';
       	console.log(atem_id+'中');
    	break;
       
    case "klm":
    	$$('modal_kindled_letter').style.display = 'inherit';
    	$$('item_kindled_letter').style.border = 'hidden';
   		console.log(atem_id+'中');
    	break;

	case "dm":
	    $$('modal_dynamite').style.display = 'inherit';
	    $$('item_dynamite').style.border = 'hidden';
	    console.log(atem_id+'中');
		break;

	case "bkm":
	    $$('modal_boxkey').style.display = 'inherit';
		$$('item_boxkey').style.border = 'hidden';
	    console.log(atem_id+'中');
		break;
	
}
console.log(atem_id+'外');

$$('item_zoom').style.display = 'none';
$$('close_modal').style.display = 'inherit';
}

function imgnone(){
    $$('modal_closed_bottle').style.display = 'none';
	$$('modal_open_bottle').style.display = 'none';
	$$('modal_letter').style.display = 'none';
	$$('modal_alcohol').style.display = 'none';
	$$('modal_filled_bottle').style.display = 'none';
	$$('modal_alcohol_letter').style.display = 'none';
	$$('modal_dynamite').style.display = 'none';
	$$('modal_boxkey').style.display = 'none';
}

//モーダルを消す
function eraseimg(){
	$$('close_modal').style.display = 'none';
	imgnone();
	bordernone();
	zoom_id=0;
}

//リセット
function resetgame(){
	$$('closed_bottle').style.visibility = 'inherit';
	$$('dynamite').style.visibility = 'inherit';
	$$('alcohol').style.visibility = 'inherit';
	$$('closed_box').style.display = 'inherit';
	$$('open_box').style.display = 'none';
	$$('item_closed_bottle').style.display = 'none';
	$$('item_open_bottle').style.display = 'none';
	$$('item_filled_bottle').style.display = 'none';
	$$('item_alcohol').style.display = 'none';
	$$('item_letter').style.display = 'none';
	$$('item_alcohol_letter').style.display = 'none';
	$$('item_kindled_letter').style.display = 'none';
	$$('item_dynamite').style.display = 'none';
	$$('item_boxkey').style.display = 'none';
	$$('item_zoom').style.display = 'none';
	$$('close_modal').style.display = 'none';
	zoom_id=0;
}

//borderを無くす
function bordernone(){
	$$('item_closed_bottle').style.border = 'none';
	$$('item_open_bottle').style.border = 'none';
	$$('item_letter').style.border = 'none';
	$$('item_alcohol').style.border = 'none';
	$$('item_filled_bottle').style.border = 'none';
	$$('item_kindled_letter').style.border = 'none';
	$$('item_alcohol_letter').style.border = 'none';
	$$('item_dynamite').style.border = 'none';
	$$('item_boxkey').style.border = 'none';
}