// アイテムの定義
var contextMenuItem = {
    "id": "spendMoney",
    "title": "SpendMoney",
    "contexts": ["selection"]
};

// メニューでアイテムを表示
chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create(contextMenuItem);
});

function isInt(value){
    return !isNaN(value) 
            && parseInt(Number(value)) == value
            && !isNaN(parseInt(value, 10));
}

// 右クリックすると、このファンクションが始まる
chrome.contextMenus.onClicked.addListener(function (clickData) {
    if(clickData.menuItemId == "spendMoney" && clickData.selectionText){
        if(isInt(clickData.selectionText)){
            chrome.storage.sync.get(['total','limit'],function(budget){
                var newTotal = 0;
                if (budget.total){
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(clickData.selectionText);
                // 保存する時、お知らせの出し
                chrome.storage.sync.set({'total':newTotal},function(){
                    if(newTotal >= budget.limit){
                        var limitInfoOptions = {
                            type: 'basic',
                            iconUrl:'icon48.png',
                            title: 'Limit reached',
                            message: "Uh on! Looks like you've reached you limit!"
                        }
                        chrome.notifications.create('limitInfo', limitInfoOptions);
                    }
                });
            });
        }
    }

});

chrome.storage.onChanged.addListener(function(changes,namespace){
    chrome.storage.sync.get(['total'],function(budget){
        chrome.browserAction.setBadgeText({'text':String(budget.total)});
    });
})