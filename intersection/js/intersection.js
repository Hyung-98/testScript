function intersectionHandler(el) {
    const boxList = document.querySelectorAll(el)

    boxList.forEach(e => {
        let bounding = e.getBoundingClientRect()
        let span = e.querySelectorAll('span')

        // 영역 전체가 보일때
        if (bounding.top >= 0 && bounding.bottom <= window.innerHeight) {
            e.classList.add('all')
        } else {
            e.classList.remove('all')
        }

        // 영역 부분 활성화
        if (bounding.bottom <= 0 || bounding.top >= window.innerHeight) {
            e.classList.remove('visible')
        } else {
            e.classList.add('visible')
        }

        inter(e, span, bounding)
    })
}

function inter(e, span, bounding) {
    let topPercent = Math.floor(((bounding.top / bounding.height) * 100) + 100)
    let botPercent = Math.floor(100 - (((bounding.bottom - window.innerHeight) / bounding.height) * 100))

    if (bounding.top <= 0 && bounding.bottom >= 0) {
        percent(span, topPercent)
        e.classList.remove('all')
    } else if (bounding.bottom >= window.innerHeight && bounding.top <= window.innerHeight) {
        percent(span, botPercent)
        e.classList.remove('all')
    } else if (bounding.top >= 0 && e.classList.contains('all')) {
        percent(span, 100)
    } else {
        percent(span, 0)
    }
}

function percent(span, val) {
    for (const item in span) {
        if (!((''+val) === span[item].innerHTML)) {
            span[item].innerHTML = `${val}`
        }
    }
}

function intersectionEvent(el) {
    window.addEventListener('scroll', intersectionHandler.bind(this, el))
    window.addEventListener('resize', intersectionHandler.bind(this, el))
    window.addEventListener('load', intersectionHandler.bind(this, el))
}