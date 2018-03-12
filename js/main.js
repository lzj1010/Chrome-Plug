let ASIN = '';
//评论条数数组
let result = [];
let json = {};
//评论最大页数
let pageNum = ($('.a-pagination .page-button :last')[0].innerHTML);

//获取商品asin即商品ID
function getasin() {
    let id = $('#cm_cr-review_list a')[0].href
    let tmp = id.split("&");
    ASIN = tmp[1].replace('ASIN=', '')
        //  console.log(ASIN);
}
getasin();
//递归解决ajax异步问题
let currentIndex = 0;

function getComment() {
    if (currentIndex >= pageNum) {
        return;
    };
    var nextUrl = 'https://www.amazon.cn/ss/customer-reviews/ajax/reviews/get/ref=cm_cr_getr_d_paging_btm_next_' + currentIndex;
    $.ajax({
        async: true,
        url: nextUrl,
        type: "POST",
        data: {
            'reviewerType': 'all_reviews',
            'formatType': '',
            'filterByStar': '',
            'pageNumber': currentIndex,
            'filterByKeyword': '',
            'shouldAppend': undefined,
            'deviceType': 'desktop',
            'reftag': 'cm_cr_getr_d_paging_btm_next_' + currentIndex,
            'pageSize': 10,
            'asin': ASIN,
            'scope': 'reviewsAjax2'
        },
        dataType: 'json',
        success: function(data) {
            //  console.log(data);  //不知道为什么是在error里面得到的数据;success没有,找错误在error里找到了
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            var re = new RegExp("\\\\", "g");
            var tmp = XMLHttpRequest.responseText.toString().replace(re, '');
            tmp = tmp.split('&&&');
            var reg = /a-size-base\s?review-text"[^>]*>(.+?)<\/span/g;
            for (var i = 0; i < tmp.length; i++) {
                var last = tmp[i].match(reg);
                if (last != null) {
                    result.push(last)
                    json[currentIndex * 10 + i] = last;
                }
            };
            JSON.stringify(json);
            currentIndex++;
            // console.log(currentIndex);
            //  console.log(result);
            getComment();
        }
    });
};
getComment();