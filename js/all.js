let data;
let len;
let hasArea;
let nowData;
let wrap = document.querySelector('.wrap');
let loader = document.querySelector('.loading');
let hotBtn = document.querySelector('.hotbtn');
let area = document.querySelector('#areas');
let content = document.querySelector('.content');
let zoneTitle = document.querySelector('.zoneTitle');
let viewpoint = document.querySelector('.viewpoint');
let goTop = document.querySelector('#goTop');
let page = document.querySelector('.page');
const showPnum = 8;
let pageNum = 0;
let currentPage = 1;

getData();

function getData() {
    fetch('https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', { method: 'get' })
        .then(res => res.json())
        .then(function (response) {
            data = response.result.records;
            len = data.length;
            loader.style.display = 'none';
            wrap.style.display = 'block';
            updateArea();
            updateBtn();
            init();
            // updatePoint(data);
        }).catch(function (err) {
            loader.style.display = 'block';
            console.log('錯誤', err);
        })
}

function updateArea() {
    hasArea = [];
    for (let i = 0; i < len; i++) {
        hasArea.push(data[i].Zone);
    }
    let areaNorepeat = new Set(hasArea);
    for (let value of areaNorepeat) {
        let option = document.createElement('option');
        option.textContent = value;
        option.setAttribute('value', value);
        area.appendChild(option);
    }
}

function updateBtn() {
    let count = {};
    hasArea.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
    let hot = Object.keys(count).sort((a, b) => count[b] - count[a]);
    let str = '';
    for (let i = 0; i < 4; i++) {
        str += `<input type="button" value="${hot[i]}">`;
    }
    hotBtn.innerHTML = str;
}

function zoneData(value) {
    let zoneInf = [];
    for (let i = 0; i < len; i++) {
        if (value == data[i].Zone) {
            zoneInf.push(data[i]);
        }
    }
    return zoneInf;
}

function init() {
    nowData = data;
    updatePoint();
    zoneTitle.textContent = '全部景點';
}

function update(e) {
    let select = e.target.value;
    if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'SELECT') { return };
    if (e.target.nodeName === 'INPUT') {
        for (let i = 0; i < area.options.length; i++) {
            if (select === area.options[i].value) {
                area.options[i].selected = true;
            }
        }
    }
    currentPage = 1;
    nowData = zoneData(select);
    updatePoint();
    zoneTitle.textContent = select;
}

function updatePoint() {
    let str = '';
    let strT = '';
    let start = currentPage * showPnum;
    let dataLen = nowData.length;

    pageList(dataLen);

    if (dataLen > start) {
        dataLen = start;
    } else {
        dataLen = nowData.length;
    }

    for (let i = start - showPnum; i < dataLen; i++) {
        if (nowData[i].Ticketinfo === '免費參觀' || '' || '新台幣50元') {
            strT = nowData[i].Ticketinfo;
        }
        if (nowData[i].Ticketinfo === 'DIY手做教學 200元/人提供用餐服務 150/人') {
            strT = '需付費';
        }
        str += `<div class="point">
                  <div class="title">
                     <img src="${nowData[i].Picture1}">
                     <h2>${nowData[i].Name}</h2>
                     <p>${nowData[i].Zone}</p>
                  </div>
                  <div class="new">
                     <div><img src="img/icons_clock.png"><p>${nowData[i].Opentime}</p></div>
                     <div><img src="img/icons_pin.png"><p>${nowData[i].Add}</p></div>
                     <div><img src="img/icons_phone.png"><p>${nowData[i].Tel}</p></div>
                     <div><img src="img/icons_tag.png"><p>${strT}</p></div>
                     </div>
                  </div>`
    }
    viewpoint.innerHTML = str;
    goTop.innerHTML = `<img src="img/btn_goTop.png">`;
}

function pageList(dLen) {
    pageNum = Math.ceil(dLen / showPnum);
    let preStr = `<div class="prev">&lt; prev</div>`;
    let nextStr = `<div class="next">next &gt;</div>`;

    let pgLi = '';
    if (dLen > showPnum) {
        for (let i = 1; i <= pageNum; i++) {
            if (i == currentPage) {
                pgLi += `<li class="page-num active">${i}</li>`;
            } else {
                pgLi += `<li class="page-num">${i}</li>`;
            }
        }
    } else {
        pgLi += `<li class="page-num active">1</li>`;
    }
    page.innerHTML = preStr + `<ul class="nowPage">${pgLi}</ul>` + nextStr;

    let pre = document.querySelector('.prev');
    let next = document.querySelector('.next');

    if (currentPage === 1) {
        pre.classList.add('disabled');
    } else {
        pre.classList.remove('disabled');
    }
    if (currentPage === pageNum) {
        next.classList.add('disabled');
    } else {
        next.classList.remove('disabled');
    }
}

function preOrNext(e) {
    if (!e.target.classList.contains('prev') && !e.target.classList.contains('next') && e.target.nodeName !== 'LI') { return }
    if (e.target.classList.contains('prev')) {
        if (currentPage == 1) {
            currentPage = 1;
        } else {
            currentPage--;
        }
        console.log('pre')
    } else if (e.target.classList.contains('next')) {
        if (currentPage == pageNum) {
            currentPage == pageNum;
        } else {
            currentPage++;
        }
        console.log('next');
    } else {
        currentPage = parseInt(e.target.textContent);
    }
    updatePoint();
}


$(function () {

    $('#goTop').click(function () {
        $('html,body').animate({ scrollTop: 0 }, '1000');
        return false;
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 400) {
            $('#goTop').fadeIn();
        } else {
            $('#goTop').fadeOut();
        }
    });

});

area.addEventListener('change', update, false);
page.addEventListener('click', preOrNext, false);
hotBtn.addEventListener('click', update, false);

















































