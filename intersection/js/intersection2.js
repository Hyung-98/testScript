class Intersection {
    constructor(el, fn) {
        this.el = el

        this.set(fn)
        this.bindEvent()
    }

    set(fn) {
        this.rect = {}
        this.state = {}
        this.ratio = {}
        this.target
        this.fn = fn
    }

    bindEvent() {
        window.addEventListener('load', e => {
            this.detectIntersection()
            this.detectIntersectionRatio()
            this.intersectionRatioOutput()
            this.fn()
        })
        window.addEventListener('scroll', e => {
            this.detectIntersection()
            this.detectIntersectionRatio()
            this.intersectionRatioOutput()
            this.fn()
        })
        window.addEventListener('resize', e => {
            this.detectIntersection()
            this.detectIntersectionRatio()
            this.intersectionRatioOutput()
            this.fn()
        })
    }

    detectIntersection() {
        for(const view of this.el) {
            this.rect[view.id] = view.getBoundingClientRect()
            if(
                this.rect[view.id].top <= 0 && this.rect[view.id].bottom >= 0 ||
                this.rect[view.id].top <= innerHeight && this.rect[view.id].bottom >= innerHeight
            ) this.target = view
            this.detectStateView(view)
        }
    }

    detectStateView(view) {
        if (this.rect[view.id].top >= 0 && this.rect[view.id].bottom <= innerHeight) this.state[view.id] = 1
        else if (this.rect[view.id].top <= 0 && this.rect[view.id].bottom >= 0) this.state[view.id] = 20
        else if (this.rect[view.id].top <= innerHeight && this.rect[view.id].bottom >= innerHeight) this.state[view.id] = 21
        else this.state[view.id] = 3
    }

    detectIntersectionRatio() {
        for (const view of this.el) {
            if (this.state[view.id] === 1) {
                this.ratio[view.id] = 100
            } else if (this.state[view.id] === 20) {
                this.ratio[view.id] = parseInt(this.rect[view.id].top / this.rect[view.id].height * 100) + 100
            } else if (this.state[view.id] === 21) {
                this.ratio[view.id] = parseInt((innerHeight - this.rect[view.id].top) / this.rect[view.id].height * 100)
            } else this.ratio[view.id] = 0
        }
    }
    
    intersectionRatioOutput() {
        [...this.el].map(view => {
            let spans = view.children

            for (const span of spans) {
                if (parseInt(span.innerText) !== this.ratio[view.id]) {
                    span.innerText = this.ratio[view.id]
                }
            }
        })
    }
}