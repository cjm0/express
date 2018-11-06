$(function() {
    $(".hamburger").click(function() {
        $(this).toggleClass("is-active");
        $('.tag').eq(0).toggleClass("is-show");
        $('.tag').eq(1).toggleClass("is-show");
    });

    // fastclick
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }


    // 获取样式
    function getStyle(obj, attr) {
        if (obj.currentStyle) {
            //ie
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    };
    // 数组求和
    function sum(arr) {
        if (!arr) return;
        var a = 0;
        if (arr instanceof Array && arr.length >= 1) {
            for (var i = 0; i < arr.length; i++) {
                a += arr[i];
            }
            return a;
        } else {
            return 'not a array'
        }
    }

    function tab() {
        var len = document.querySelectorAll('.tab_list').length;
        var tab = document.querySelectorAll('.tab_list');
        var arrT = [];

        if (len <= 1) {
            return
        };

        for (var i = 0; i < len; i++) {
            arrT.push(tab[i].offsetWidth + parseInt(getStyle(tab[i], 'marginRight')))
        };
        document.querySelector('.wrap').style.width = sum(arrT) + 'px';

        var myscroll = new IScroll("#pan", {
            momentum: false,
            scrollX: true,
            scrollY: false,
            fadeScrollbars: false,
            tap: true,
            click: true,
        });
    }
    tab();

    function toResult(val) {
        
        var arr0 = window.localStorage.getItem('keyWord') || '[]';
        var arr1 = JSON.parse(arr0).slice(0, 10);
        arr1.unshift(encodeURI(val));
        window.localStorage.setItem('keyWord',JSON.stringify(arr1));

        $('.search-wrap').hide();
        window.location.href = "/result?key=" + encodeURI(val);
        
        recordKey()
    };

    function recordKey() {
        var arr0 = window.localStorage.getItem('keyWord') || '[]';
        var arr1 = JSON.parse(arr0);
        var str = '';

        arr1.forEach(function(val) {
            str += '<span class="span">'+decodeURI(val)+'</span>'
        })
        $('.search-key').append(str)
    };
    recordKey();
    

    $('.search-click').click(function() {
        var val = $('.search-ipt1').val().trim();
        if (val) {
            toResult(val)
        } else {
            return false;
        }
    });
    window.onkeyup = function() {
        var ev = ev || event;
        if (ev.keyCode == 13) {
            var val = $('.search-ipt1').val();
            if (val && val.trim()) {
                toResult(val)
            } else {
                return false;
            }
        }
    }
    $('.search-key .span').click(function() {
        var val = $(this).text().trim();
        if (val) {
            toResult(val)
        } else {
            return false;
        }
    })

    // 获取链接参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    };
    var tag = getQueryString('key');
    $('.search-ipt2').val(tag);


    $('.search').click(function() {
        $('.search-wrap').show(500)
    });
    $('.close-click').click(function() {
        $('.search-wrap').hide(500);
    });
    
    $('.search-label').click(function() {
        $('.search-wrap').show(500)
    });


   
})