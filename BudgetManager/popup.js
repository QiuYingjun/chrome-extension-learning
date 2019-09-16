$(function(){
    chrome.storage.sync.get(['total','limit'],function (budget) {
        // 変数のイニシャライズ 
        if(budget.total == undefined){
            budget.total = 0;
            chrome.storage.sync.set({'total': 0},function(){});            
        }
        if(budget.limit ==  undefined){
            budget.limit = 100;
            chrome.storage.sync.set({'limit': 100},function(){});            
        }
        // 画面で表示する
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
    })
    //　ボタンのクリック事件
    $('#spendAmount').click(function(){
        chrome.storage.sync.get(['total','limit'], function(budget){
            var newTotal = 0;
            if(budget.total){
                newTotal += parseInt(budget.total);
            }
            var amount = $('#amount').val();
            if(amount){
                newTotal += parseInt(amount);
            }
            // 新しい値を更新する
            chrome.storage.sync.set({'total':newTotal},function(){
                if(amount && newTotal >= budget.limit){
                    var limitInfoOptions = {
                        type: 'basic',
                        iconUrl:'icon48.png',
                        title: 'Limit reached',
                        message: "Uh on! Looks like you've reached you limit!"
                    }
                    chrome.notifications.create('limitInfo', limitInfoOptions);
                }
            });
            $('#total').text(newTotal);
            $('#amount').val('');
        })
    })
});
