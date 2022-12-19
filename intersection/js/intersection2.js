class Intersection {
    constructor(el) {
        this.el = document.querySelectorAll(el)

        this.set()
        this.bindEvent()
    }

    set() {
        this.rect = {}
        this.state = {}
    }

    bindEvent() {
        window.addEventListener('scroll', e => {
            this.detectIntersection()
            this.detectStateView()
            this.detectDispatch()
        })
    }

    detectIntersection() {
        for (const idx in this.el) {
            // console.log(this.el[idx])
            this.rect = this.el.getBoundingClientRect()
        }
    }

    detectStateView() {
        if (this.rect.top >= 0 && this.rect.bottom <= innerHeight) this.state.view = 1
        else if (this.rect.top <= 0 && this.rect.bottom >= 0) this.state.view = 2
        else this.state.view = 3
    }

    detectDispatch() {
        if (this.state.view === 1) this.el.dispatchEvent(new Event('intersection.visible.all'))
        else if (this.state.view === 2) this.el.dispatchEvent(new Event('intersection.visible'))
        else this.el.dispatchEvent(new Event('intersection.hidden'))
    }
}