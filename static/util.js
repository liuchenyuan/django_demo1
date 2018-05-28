/**
 * Created by pwx on 2016/8/4.
 */
var zckj = {
    checks: {
        mobile: {reg: /^1[3|4|5|7|8][0-9]\d{8}$/, msg: '请输入正确的11位手机号码'},
        nick: {reg: /.+/, msg: '请输入企业名称'},
        nick1: {reg: /.+/, msg: '请输入企业联系人'},
    }
}

function getDays(strDateStart, strDateEnd) {
    var strSeparator = "."; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
    return iDays;
}


jQuery.fn.extend({
    pager: function (options) {
        var elPager = $(this).find('ol');
        var defOpt = {
            pageIndex: 1,
            numericPagerItemCount: 10,
            size: 1,
            pageTotal: 1,
            total: null,
            pagerItemCount: 10,

            showPreNext: true,
            prevPageText: '<',
            nextPageText: '>',

            showFirstLast: false,
            firstPageText: '<<',
            lastPageText: '>>',

            showNumericPagerItems: true,

            pagerItemClick: null
        };
        options.pagerItemCount = options.pagerItemCount ? options.pagerItemCount : options.size;
        var opt = $.extend(defOpt, options);
        opt.pageIndex = parseInt(opt.pageIndex, 10);
        opt.pagerItemCount = parseInt(opt.pagerItemCount, 10);
        opt.pageTotal = parseInt(opt.pageTotal, 10);
        if (opt.total && opt.size)
            opt.pageTotal = parseInt(opt.total / opt.size) + ((opt.total % opt.size) > 0 ? 1 : 0);
        elPager.options = opt;

        elPager.addPagerItem = function (text, pageIndex, enabled, type) {
            var $li = $('<li></li>')
            var $tmpl = $('<a class="page-v" p="' + pageIndex + '"><span>' + text + '</span></a>');
            if (!elPager.options.pagerItemClick) {
                var href = location.href.replace(/[\?&]pn=\d+/, '').replace(/[\?&]s=\d+/, '');
                href += (href.indexOf('?') == -1 ? '?' : '&') + 'pn=' + pageIndex + '&s=' + elPager.options.size;
                $tmpl.attr("href", href);
            }
            //var pagerItem = $("<span p='" + pageIndex + "' class='" + type + "'><a>" + text + "</a></span>").click(function () {
            var pagerItem = $tmpl.click(function () {
                if ($.isFunction(elPager.options.pagerItemClick)) {
                    var p = parseInt($(this).attr("p"), 10);
                    elPager.options.pagerItemClick(p, elPager.options.pagerItemCount);
                }
            });
            if (type == "numeric" && pageIndex == elPager.options.pageIndex) {
                pagerItem.addClass("cur");
            }
            if (enabled) {
                $li.append(pagerItem);
                this.append($li);
            }
        };

        elPager.addFirst = function () {
            this.addPagerItem(this.options.firstPageText, 1, this.options.showFirstLast && this.options.pageIndex > 1, 'first');
        }
        elPager.addPre = function () {
            this.addPagerItem(this.options.prevPageText, this.options.pageIndex - 1, this.options.showPreNext && this.options.pageIndex > 1, 'pre');

        }

        elPager.addNumeric = function (page) {
            this.addPagerItem(page, page, this.options.showNumericPagerItems, 'numeric');
        }
        elPager.addNext = function () {
            this.addPagerItem(this.options.nextPageText, this.options.pageIndex + 1, this.options.showPreNext && this.options.pageIndex < this.options.pageTotal, 'next');
        }
        elPager.addLast = function () {
            this.addPagerItem(this.options.lastPageText, this.options.pageTotal, this.options.showFirstLast && this.options.pageIndex < this.options.pageTotal, 'last');
        }
        var _startPageIndex = opt.pageIndex - parseInt(opt.pagerItemCount / 2);
        if (_startPageIndex + opt.pagerItemCount > opt.pageTotal)
            _startPageIndex = opt.pageTotal + 1 - opt.pagerItemCount;
        if (_startPageIndex < 1)
            _startPageIndex = 1;
        var _endPageIndex = _startPageIndex + opt.pagerItemCount - 1;
        if (_endPageIndex > opt.pageTotal)
            _endPageIndex = opt.pageTotal;

        elPager.addClass("fy").html("");
        elPager.addFirst();
        elPager.addPre('');
        if (opt.showNumericPagerItems) {
            for (var i = _startPageIndex; i <= _endPageIndex; i++) {
                elPager.addNumeric(i);
            }
        }
        elPager.addNext();
        elPager.addLast();
        return elPager;
    },
    checkForm: function () {
        var valid = true, res = {}, name;
        $.each(this.find("input,select"), function (i, o) {
            var _check = $(o).attr("_check");
            var cond = true;
            if ((_check == "amount" || _check == "withdraw_amount") && $(this).attr("_max")) {
                var max = parseFloat($(this).attr("_max"));
                cond = (parseFloat(this.value) <= max);
            }
            if ((_check == "amount" || _check == "withdraw_amount") && $(this).attr("_min")) {
                var min = parseFloat($(this).attr("_min"));
                cond = (parseFloat(this.value) > min);
            }
            if (_check && zckj.checks[_check]) {
                if (!$.trim(o.value).match(zckj.checks[_check].reg) || !cond) {
                    $(o).addClass('err');
                    //$(o).nextAll('div.tips:first').html(zckj.checks[_check].msg).show();

                    alert(zckj.checks[_check].msg);
                    valid = false;
                    return false;
                }
                if (zckj.checks[_check].reg1 && $.trim(o.value) != $("input[name='" + zckj.checks[_check].reg1 + "']").val()) {
                    //$(o).nextAll('div.tips:first').html(zckj.checks[_check].msg).show();
                    $(o).addClass('err');
                    alert(zckj.checks[_check].msg);
                    valid = false;
                    return false;
                }
            }
            if (valid) {
                $(o).parents().next('.tipsYz').html('');

                $(o).removeClass('err');
            }


            //$(o).removeClass('err').val('');
            name = $(o).attr("name");
            if (name) {
                switch (o.type) {
                    case "text":
                    case "hidden":
                    case "select-one":
                    case "password":
                        res[name] = $.trim(o.value);
                        break;
                    case "checkbox":
                        if (o.checked) {
                            res[name] = res[name] || [];
                            res[name].push(o.value);
                        }
                        break;
                    case "radio":
                        if (o.checked) {
                            res[name] = o.value;
                        }
                        break;
                    default:
                        break;
                }
            }
        })
        return valid == false ? valid : res;
    },
    checkRegister: function () {
        var valid = true, res = {}, name;
        $.each(this.find("input,select"), function (i, o) {
            var _check = $(o).attr("_check");
            var cond = true;
            if ((_check == "amount" || _check == "withdraw_amount") && $(this).attr("_max")) {
                var max = parseFloat($(this).attr("_max"));
                cond = (parseFloat(this.value) <= max);
            }
            if ((_check == "amount" || _check == "withdraw_amount") && $(this).attr("_min")) {
                var min = parseFloat($(this).attr("_min"));
                cond = (parseFloat(this.value) > min);
            }
            if (_check && zckj.checks[_check]) {
                if (!$.trim(o.value).match(zckj.checks[_check].reg) || !cond) {
                    $(o).addClass('err');
                    //$(o).nextAll('div.tips:first').html(zckj.checks[_check].msg).show();
                    $(o).parents().parents('form').children('.tipsYz').html(zckj.checks[_check].msg).fadeIn();
                    valid = false;
                    return false;
                }
                if (zckj.checks[_check].reg1 && $.trim(o.value) != $("input[name='" + zckj.checks[_check].reg1 + "']").val()) {
                    //$(o).nextAll('div.tips:first').html(zckj.checks[_check].msg).show();
                    $(o).addClass('err');
                    $(o).parents().parents('form').children('.tipsYz').html(zckj.checks[_check].msg).fadeIn();
                    valid = false;
                    return false;
                }
            }
            if (valid)

                $(o).parents().parents('form').children('.tipsYz').html('').hide();
            $(o).removeClass('err');

            //$(o).removeClass('err').val('');
            name = $(o).attr("name");
            if (name) {
                switch (o.type) {
                    case "text":
                    case "hidden":
                    case "select-one":
                    case "password":
                        res[name] = $.trim(o.value);
                        break;
                    case "checkbox":
                        if (o.checked) {
                            res[name] = res[name] || [];
                            res[name].push(o.value);
                        }
                        break;
                    case "radio":
                        if (o.checked) {
                            res[name] = o.value;
                        }
                        break;
                    default:
                        break;
                }
            }
        })
        return valid == false ? valid : res;
    }
});


(function ($) {
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
})(jQuery);

var ZC_api = {

    addMes: function () {
        var $form = $('form');
        var res = $form.checkForm();
        if (res) {
                // $.post("/home/getExpect", res, function (dta) {
                //     if (dta.err) {
                //        alert(dta.err);
                //     }
                //     else {
                //         alert('添加成功');
                //     }
                // });
            $('form').submit()
            alert("提交成功")
        }
        return false;
    },



}

function loadSchedule() {
    $.each($('.bar'), function (i, item) {
        $(item).width($(item).attr('w') + '%');
        if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
            var wow = new WOW({
                boxClass: 'wow',
                animateClass: 'animate-positive',
                offset: 0,
                mobile: true,
                live: true
            });
            wow.init();
        }
        ;
    })
}
function loadSchedule1() {
    $.each($('.processingbar'), function (i, item) {

        var c = $(item);
        animateEle();
        function animateEle() {
            var b = {
                top: $(window).scrollTop(),
                bottom: $(window).scrollTop() + $(window).height()
            };
            c.each(function () {

                $(this).data('bPlay', true);
                var a = $(this).find('i').text().replace(/\%/, '');
                if ($(this).find("i").text() !== "0%") {
                    $(this).svgCircle({
                        parent: $(this)[0],
                        w: 110,
                        R: 28,
                        sW: 2,
                        color: ["#f36342", "#f36342", "#f36342"],
                        perent: [100, a],
                        speed: 150,
                        delay: 400
                    })
                }
                if ($(this).find("i").text() == "0%") {
                    $(this).find("i").css("color", "#a9a9a9");
                    $(this).svgCircle({
                        parent: $(this)[0],
                        w: 110,
                        R: 28,
                        sW: 2,
                        color: ["#000", "#000", "#d1d1d1"],
                        perent: [100, a],
                        speed: 150,
                        delay: 400
                    })
                }

            })
        }

    })
}


//$.each($('.circle'), function (i, item) {
//
//    var schedule=$(item).attr('w');
//
//    $('.circle').circleProgress({
//        value:0.5,
//        size: 60,
//        fill: {
//            gradient: ["#ff872e", "#ff6950"]
//        }
//    });
//
//})


function GetQueryString(name, url) {
    if (!url)
        url = window.location.href;
    var reg = new RegExp("(/?|&)" + name + "=([^&]*)(&|$)");
    var r = url.match(reg);
    if (r != null) return decodeURIComponent(r[2]).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    else return null;
}


var getDesc = function (type, v) {
    for (var key in type) {
        if (type[key].v == v)
            return type[key].desc;
    }
    return '';
}
var DataProxy = {
    data: {},
    save: function (key, value, cached) {
        this.data[$_seller._id + key] = value;
        if (cached)
            localStorage[$_seller._id + key] = JSON.stringify(value);
    },
    get: function (key) {
        if (this.data[$_seller._id + key])
            return this.data[$_seller._id + key];
        else if (localStorage[$_seller._id + key])
            return JSON.parse(localStorage[$_seller._id + key]);


    },
    //返回删除的数据数量
    remove: function (key, cached) {
        var v = this.get(key);
        delete this.data[$_seller._id + key];
        if (cached)
            delete localStorage[$_seller._id + key];
        return v ? 1 : 0;
    },
    setTmplDta: function (dta, tmpl, format) {
        var that = this;
        var check2 = function (_tmpl, key, dta) {
            var exp, arr, innerText, res = "";
            key = key.replace("$", "\\$");
            if (typeof dta == "string" || typeof dta == "number") {
                return dta ? dta : "";
            }
            if (dta instanceof Array) {
                exp = new RegExp("{x}((.|\n)+){:end x}".replace(/x/g, key));
                arr = _tmpl.match(exp);
                if (!(arr && arr[1]))
                    return JSON.stringify(dta);
                innerText = arr[1];
                for (_k in dta) {
                    res += that.setTmplDta({$value: dta[_k]}, innerText.replace(/{\$key}/, _k))//check2(innerText.replace(/{$key}/,_k),"$value",dta[_k]);
                }
                return res ? res : "";
            }
            else if (dta instanceof Date) {

            }
            else if (dta instanceof Object) {
                exp = new RegExp("{x}((.|\n)+){:end x}".replace(/x/g, key));
                arr = _tmpl.match(exp);
                if (!(arr && arr[1]))
                    return JSON.stringify(dta);
                innerText = arr[1];
                if (innerText.indexOf("{$key}") > -1)
                    for (_k in dta) {
                        res += that.setTmplDta({$value: dta[_k]}, innerText.replace(/{\$key}/, _k))//check2(innerText.replace(/{$key}/,_k),"$value",dta[_k]);
                    }
                else
                    return that.setTmplDta(dta, innerText);
                return res ? res : "";
            }
        }
        return tmpl
            .replace(/{([^}]+)}((.|\n)+){:end \1}/g, function (m1, m2, m3) {
                if (!m3)
                    return "";
                return (format && format[m2]) ? format[m2](dta[m2], dta) : (check2(tmpl, m2, dta[m2]));
            })
            .replace(/{([^}]+)}/g, function (m1, m2) {
                if (!m2)
                    return "";
                return (format && format[m2]) ? format[m2](dta[m2], dta) : (check2(tmpl, m2, dta[m2]));
            })
            .replace(/encodeURIComponent\((.*)\)/g, function (m1, m2) {
                if (!m2)
                    return "";
                return encodeURIComponent(m2.replace(/\%/g, "%25"));
            })
    }
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function reloadImgCode(obj) {
    $(obj).attr("src", "/getImgCode?t=" + new Date().getTime());
}
function createImgCodeDiv() {
    var html = '<div class="form-group ">' +
        '<span class="u1">图形验证码</span>' +
        '<input type="text" class="form-control" id="imgCode" name="imgCode" placeholder="验证码"' +
        '_check="validcode"/>' +
        '<i class="imgcode"> <img onclick="reloadImgCode(this)" id="picCode"' +
        'style="width: 105px; height: 45px;cursor: pointer;" class="refresh" src="/getImgCode"/></i> </div>' +
        '<div class="tipsYz tipsFrom"></div>';
    if ($('#picCode1')){
        $('#imgCodeDiv').html(html);
    }
    reloadImgCode($('#imgCodeDiv').find('.refresh'));
}
