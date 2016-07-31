        window.onload = function () {

            if (!document.getElementsByClassName) {
                document.getElementsByClassName = function (cls) {
                    var ret = [];
                    var els = document.getElementsByTagName('*');
                    for (var i = 0; i < els.length; i++) {
                        if (els[i].className === cls || els[i].className.indexOf(cls + ' ') >= 0 || els[i].className.indexOf(' '+cls) >= 0 || els[i].className.indexOf(' '+cls + ' ') >= 0) {
                            ret.push(els[i]);
                        }
                    }
                    return ret;
                };
            };

            var cartTable = document.getElementById('cartTable');
            var tr = cartTable.children[1].rows;
            var checkInput = document.getElementsByClassName('check');
            var checkAllInputs = document.getElementsByClassName('check-all');
            var ckeckOneInputs=document.getElementsByClassName('check-one');
            var selectedTotal = document.getElementById('selectedTotal');
            var priceTotal = document.getElementById('priceTotal');
            var selected = document.getElementById('selected');
            var foot = document.getElementById('foot');
            var selectedViewList = document.getElementById('selectedViewList');
            var deleterAll = document.getElementById('deleteAll');

            //计算总数和总价的函数
            function getTotal() {
                var selected = 0;
                var price = 0;
                var HTMLstr = '';

                for (var i = 0; i < tr.length; i++) {
                    if (tr[i].getElementsByTagName('input')[0].checked) {
                        tr[i].className = 'on'
                        selected += parseInt(tr[i].getElementsByTagName('input')[1].value);
                        price += parseFloat(tr[i].cells[4].innerHTML);
                        HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"/><span class="del" index="' + i + '">取消选择</span></div>'
                    } else {
                        tr[i].className = '';
                    };
                };

                selectedTotal.innerHTML = selected;
                priceTotal.innerHTML = price.toFixed(2);
                selectedViewList.innerHTML = HTMLstr;

                if (selected == 0) {
                    foot.className = 'foot';
                };

            };

            //小计函数
            function getSubTotal(tr) {
                var tds = tr.cells;
                var price = parseFloat(tds[2].innerHTML);
                var count = parseInt(tr.getElementsByTagName('input')[1].value);
                var SubTotal = parseFloat(price * count);
                tds[4].innerHTML = SubTotal.toFixed(2);
            };

            for (var i = 0; i < checkInput.length; i++) {
                checkInput[i].onclick = function () {
                    if (this.className === 'check-all check') {
                        for (var j = 0; j < checkInput.length; j++) {
                            checkInput[j].checked = this.checked;
                        };
                    };
                    //当物品没有都选中的时候改变全选按钮状态的函数
                    if (this.checked == false) {
                        for (var k = 0; k < checkAllInputs.length; k++) {
                            checkAllInputs[k].checked = false;
                        }
                    };
                    //当物品逐渐添加的时候改变全选按钮状态的函数
                    function factorial(num) {
                        if (num < ckeckOneInputs.length && ckeckOneInputs[num].checked) {
                            if (num < ckeckOneInputs.length - 1) {
                                factorial(num + 1);
                            } else if (num == ckeckOneInputs.length - 1) {
                                for (var k = 0; k < checkAllInputs.length; k++) {
                                    checkAllInputs[k].checked = true;
                                };
                            }
                        };
                    };
                    factorial(0);
                    getTotal();
                };
            };

            selected.onclick = function () {
                if (foot.className == 'foot') {
                    if (selectedTotal.innerHTML != 0) {
                        foot.className = 'foot show';
                    };
                } else {
                    foot.className = 'foot';
                };
            };

            //事件代理函数，因为图片可能很多的情况下逐个添加导致的问题极大
            selectedViewList.onclick = function (e) {
                e = e || window.event;
                var el = e.srcElement;
                if (el.className == 'del') {
                    var index = el.getAttribute('index');
                    var input = tr[index].getElementsByTagName('input')[0];
                    input.checked = false;
                    input.onclick();
                };
            };

            //同时也给增加/减少/删除按钮增加事件代理函数
            for (var i = 0; i < tr.length; i++) {
                //通过事件冒泡机制，目标元素的点击事件会同时出发父元素tr[i]上的点击事件，父元素再通过e就可以
                //获得目标元素的相关具体信息
                tr[i].onclick = function (e) {
                    e = e || window.event;
                    var el = e.srcElement;
                    var cls = el.className;
                    var input = this.getElementsByTagName('input')[1];
                    var val = parseInt(input.value);
                    var reduce = this.getElementsByTagName('span')[1];

                    switch (cls) {
                        case 'add':
                            input.value = val + 1;
                            reduce.innerHTML = '-';
                            getSubTotal(this);
                            getTotal();
                            alert(inputValue);
                            break;
                        case 'reduce':
                            if (val > 1) {
                                input.value = val - 1;
                                if (input.value == 1) {
                                    reduce.innerHTML = '';
                                }
                            };
                            getSubTotal(this);
                            getTotal();
                            break;
                        case 'delete':
                            var conf = confirm('确定要删除吗?');
                            if (conf) {
                                this.parentNode.removeChild(this);
                            }
                            break;
                        default:
                            break;
                    };
                };
            };

            //全部删除的功能
            deleteAll.onclick = function () {
                if(selectedTotal.innerHTML!='0'){
                    var conf = confirm('你确定要删除吗?');
                    if (conf) {
                        for (var i = 0; i < tr.length; i++) {
                            var input = tr[i].getElementsByTagName('input')[0];
                            if (input.checked) {
                                tr[i].parentNode.removeChild(tr[i]);
                                //因为没删除一次数组的索引会改变，这里要将i的值变回去
                                i--;
                            };
                        }
                    };
                }
            };

            for (var i = 0; i < checkAllInputs.length; i++) {
                checkAllInputs[i].checked = true;
                checkAllInputs[i].onclick();
            };

        }