var esc = new EscapeGame();
esc.addPreLoadImages( ['images/gameover1.png'] );
var flag = [];
var $$ = function( id ){ return document.getElementById( id ); };
esc.addScenes( ['nowloading', 'title', 'sea', 'beach', 'forest','house', 'ome','over'] );
		
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
				
				
//sea
esc.setTrigger( 'sea_left_trigger', turnBeach );
esc.setTrigger( 'sea_right_trigger', turnForest );
// bottle is clicked
esc.setTrigger( 'closed_bottle',
	function()
	{
		flag['closed_bottle'] = true;
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
esc.setTrigger( 'start',turnSea);
					
//タイトルへ
esc.setTrigger('go_title',
		function()
		{
		// 初期化する
		esc.restartAllForm();
		esc.message( '' );
		flag = [];
		resetgame();
		esc.changeScene('title');
	}
);
	
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
			
//モーダルid
var m_id=null;

function bordernune(){
	$$('item_closed_bottle').style.border = 'none';
	$$('item_open_bottle').style.border = 'none';
	$$('item_letter').style.border = 'none';
	$$('item_alcohol').style.border = 'none';
	$$('item_filled_bottle').style.border = 'none';
	$$('item_alcohol_letter').style.border = 'none';
	$$('item_dynamite').style.border = 'none';
}

function setMid(m_img){
m_id=m_img;
console.log(m_id);

bordernune();

switch(m_id){
    case "cbm":
        $$('item_closed_bottle').style.border = 'solid';
        console.log(m_id+'クリック');
        break;
                        
    case "opm":
        $$('item_open_bottle').style.border = 'solid';
        console.log(m_id+'クリック');
        break;

    case "lm":
        $$('item_letter').style.border = 'solid';
        console.log(m_id+'クリック');
        break;

    case "am":
        $$('item_alcohol').style.border = 'solid';
        console.log(m_id+'クリック');
        break;

    case "fbm":
        $$('item_filled_bottle').style.border = 'solid';
        console.log(m_id+'クリック');
        break;

    case "alm":
        $$('item_alcohol_letter').style.border = 'solid';
        console.log(m_id+'クリック');
        break;

    case "dm":
        $$('item_dynamite').style.border = 'solid';
        console.log(m_id+'クリック');
        break;
	
	case "bkm":
		$$('item_boxkey').style.border = 'solid';
		console.log(m_id+'クリック');
		break;
	}

    $$('item_zoom').style.display = 'inherit';
    
}

//拡大用
function itemModal(){
console.log(m_id+'外');

imgnone();

switch(m_id){
	case "cbm":
		$$('modal_closed_bottle').style.display = 'inherit';
		$$('item_closed_bottle').style.border = 'hidden';
		console.log(m_id+'中');
		break;
				
	case "opm":
		$$('modal_open_bottle').style.display = 'inherit';
		$$('item_open_bottle').style.border = 'hidden';
		console.log(m_id+'中');
    	break;
        
    case "lm":
		$$('modal_letter').style.display = 'inherit';
		$$('item_letter').style.border = 'hidden';
		console.log(m_id+'中');
    	break;
    
	case "am":
		$$('modal_alcohol').style.display = 'inherit';
		$$('item_alcohol').style.border = 'hidden';
		console.log(m_id+'中');
    	break;
    
	case "fbm":
		$$('modal_filled_bottle').style.display = 'inherit';
		$$('item_filled_bottle').style.border = 'hidden';
		console.log(m_id+'中');
 		break;
    
    case "alm":
		$$('modal_alcohol_letter').style.display = 'inherit';
        $$('item_alcohol_letter').style.border = 'hidden';
       	console.log(m_id+'中');
    	break;
       
    case "alm":
    	$$('modal_kindred_letter').style.display = 'inherit';
    	$$('item_kindred_letter').style.border = 'hidden';
   		console.log(m_id+'中');
    	break;

	case "dm":
	    $$('modal_dynamite').style.display = 'inherit';
	    $$('item_dynamite').style.border = 'hidden';
	    console.log(m_id+'中');
		break;

	case "bkm":
	    $$('modal_boxkey').style.display = 'inherit';
		$$('item_boxkey').style.border = 'hidden';
	    console.log(m_id+'中');
		break;
	
}
m_id=null;
console.log(m_id+'外');

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

function eraseimg(){
	$$('close_modal').style.display = 'none';
	$$('modal_closed_bottle').style.display = 'none';
	$$('modal_open_bottle').style.display = 'none';
	$$('modal_letter').style.display = 'none';
	$$('modal_alcohol').style.display = 'none';
	$$('modal_filled_bottle').style.display = 'none';
	$$('modal_alcohol_letter').style.display = 'none';
	$$('modal_dynamite').style.display = 'none';
	$$('modal_boxkey').style.display = 'none';
}
//アイテム変化用
//一つから他へ変化
function bottleChange(){
    $$('modal_closed_bottle').style.display = 'none';
	$$('item_closed_bottle').style.display = 'none';
	$$('item_open_bottle').style.display = 'inherit';
	$$('item_letter').style.display = 'inherit';
	$$('close_modal').style.display = 'none';	
}

//二つを一つに変化
function ItemChange(item_id){
	//item_alcohol_letterにする
	if(m_id=="item_letter"&&item_id=="item_alcohol"){
		$$('modal_letter').style.display = 'none';
		$$('item_letter').style.display = 'hidden';
		$$('item_alcohol').style.display = 'hidden';
		$$('item_alcohol_letter').style.display = 'inherit';
	}
	//item_kindred_letterにする
	if(m_id=="item_alcohol_letter"&&item_id=="item_filled_bottle"){
		$$('modal_alcohol_letter').style.display = 'none';
		$$('item_alcohol_letter').style.display = 'hidden';
		$$('item_filled_bottle').style.display = 'hidden';
		$$('item_kindred_letter').style.display = 'inherit';
	}
	//dynamiteを爆発させる
	if(m_id=="item_dynamite"&&item_id=="item_kindred_letter"){
		$$('modal_dynamite').style.display = 'none';
		$$('item_dynamite').style.display = 'hidden';
		$$('item_kindred_letter').style.display = 'hidden';
		esc.changeScene( 'sea' );
		//クリア処理に飛ばす
    }
    eraseimg();
}

function resetgame(){
	$$('closed_bottle').style.visibility = 'inherit';
	$$('dynamite').style.visibility = 'inherit';
	$$('item_closed_bottle').style.display = 'none';
	$$('item_open_bottle').style.display = 'none';
	$$('item_filled_bottle').style.display = 'none';
	$$('item_alcohol').style.display = 'none';
	$$('item_letter').style.display = 'none';
	$$('item_alcohol_letter').style.display = 'none';
	$$('item_kindred_letter').style.display = 'none';
	$$('item_dynamite').style.display = 'none';
	$$('item_boxkey').style.display = 'none';
	$$('item_zoom').style.display = 'none';
	$$('close_modal').style.display = 'none';
}