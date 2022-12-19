// class Intersection {
//     constructor(tg) {
//         this.set(tg)
//     }

//     set(tg) {
//         this.intersectionElement = this.map(tg)
//         console.log(this.intersectionElement)
//     }

//     map(tg) {
//         for (const x of tg) {
//             console.log(x)
//             return x
//         }
//     }
// }


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

class Intersection {
    constructor(el) {
        this.el = document.querySelector(el)

        this.set()
        this.bindEvent()
    }

    set() {
        this.rect = {}
        this.state = {}
    }

    bindEvent() {
        window.addEventListener('scroll', e=> {
            this.detectIntersection()
            this.detectStateView()
            this.detectDispatch()
        })
    }

    detectIntersection() {
        this.rect = this.el.getBoundingClientRect()
    }

    detectStateView() {
        if(this.rect.top >= 0 && this.rect.bottom <= innerHeight) this.state.view = true
        else this.state.view = false
    }

    detectDispatch() {
        if(this.state.view) this.el.dispatchEvent(new Event('intersection.visible'))
        else this.el.dispatchEvent(new Event('intersection.hidden'))
    }
}