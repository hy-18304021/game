// モーダルウィンドウ
$(function(){
    $('.js-modal-open').on('click',function(){
        $('.js-modal').fadeIn();
        return false;
    });
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });
    $('.js-tips-open').on('click',function(){
        $('.js-tips').fadeIn();
        return false;
    });
    $('.js-tips-close').on('click',function(){
        $('.js-tips').fadeOut();
        return false;
    });
});

function doubleclick(){
    $('.js-modal').fadeIn();
    itemModal();
}

