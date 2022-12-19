const wrap = document.getElementById('wrap')
const scroll_btn = document.querySelector('button')
const status_banner = document.getElementById('status_banner')

let scroll_list = status_banner.querySelectorAll('li')
let status_val = status_banner.querySelectorAll('span')
let before_top = 0
let before_left = 0

const scroll_handler = (val) => {
    console.log(val)
    const tg = val.target === document ? val.target.documentElement : val.target   // 스크롤 적용 대상
    
    const brow_tg = val.target === document ? 'WINDOW' : val.target.nodeName   // 스크롤 적용 대상 이름
    const brow_scrwid = tg.scrollWidth     // 전체 브라우저 넓이
    const brow_scrhei = tg.scrollHeight    // 전체 브라우저 높이
    const brow_width = tg.clientWidth      // 현재 브라우저 넓이 (스크롤바 제외)
    const brow_height = tg.clientHeight    // 현재 브라우저 높이
    
    const brow_top = tg.scrollTop          // 브라우저 스크롤 높이
    const brow_percent_top = (brow_top / (brow_scrhei - brow_height) * 100).toFixed(2)    // 브라우저 스크롤 높이 퍼센트 변환
    const scroll_direc_top = before_top < brow_top ? 'down' : 'up'  // 스크롤 방향

    const brow_left = tg.scrollLeft        // 브라우저 스크롤 넓이
    const brow_percent_left = (brow_left / (brow_scrwid - brow_width) * 100).toFixed(2)    // 브라우저 스크롤 넓이 퍼센트 변환
    const scroll_direc_left = before_left < brow_left ? 'left' : 'right'    // 스크롤 방향
    before_left = brow_left;
    
    const scroll_con = {
        element: brow_tg,
        scrollWidth: brow_scrwid,
        scrollHeight: brow_scrhei,
        clientWidth: brow_width,
        clientHeight: brow_height,
        scrollTop: brow_top,
        topPercent: brow_percent_top,
        scrollDirTop: scroll_direc_top,
        scrollLeft: brow_left,
        leftPercent: brow_percent_left,
        scrollDirLeft: scroll_direc_left
    }
    
    // 스크롤 적용 대상 클래스 설정 (up,down)
    const classTg = val.target === document ? val.target.children[0] : val.target

    if (before_top !== brow_top) {
        if (before_top < brow_top) {
            classTg.classList.remove('scroll_up')
            classTg.classList.add('scroll_down')
        } else {
            classTg.classList.remove('scroll_down')
            classTg.classList.add('scroll_up')
        }
        before_top = brow_top
    }

    // 스크롤 적용 대상 클래스 설정 first/last
    if (brow_scrhei - brow_top === brow_height) {
        classTg.classList.remove('scroll_first')
        classTg.classList.add('scroll_last')
    } else if (brow_top === 0) {
        classTg.classList.remove('scroll_last')
        classTg.classList.add('scroll_first')
    } else {
        classTg.classList.remove('scroll_first','scroll_last')
    }

    list_box(scroll_con)
    this.addEventListener('scroll', scroll_handler)
}

const list_box = (item) => {
    let i = 0
    for (const it in item) {
        scroll_list[i].innerText = `${it}: ${status_val[i].innerText = item[it]}`
        i++
    }
}

const move_btn = () => {
    document.documentElement.scrollTo({top: 400, behavior: 'smooth'})
}


// const winscroll = scroll_handler(window)

// wrap.addEventListener('scroll', scroll_handler)
// scroll_btn.addEventListener('click', move_btn)

const a = (el) => {
    el.addEventListener('scroll', () => {
        console.log(el.scrollTop, el.scrollLeft)
    })
}

const b = a(document.querySelector('#wrap'))