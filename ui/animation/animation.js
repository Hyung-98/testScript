class Animation {
    constructor(tg) {
        this.el = tg

        this.set()
        this.bindEvent()
    }

    set() {
        this.data = {}
        this.rect = {}
        this.isAnimated = {}
        this.animationCount = {}
        this.reset = []
    }

    bindEvent() {
        this.el.forEach((aniEl, index) => {
            window.addEventListener('load', e => {
                this.animationAttrData(aniEl)
                this.animationElSet(aniEl)
            })
            window.addEventListener('scroll', e => {
                this.animationAttrData(aniEl)
                this.detectAnimation(aniEl)
                this.animationEvent(aniEl, index)
                this.animationOnce(aniEl, index)
            })
        });
    }

    detectAnimation(tg) {
        this.rect = tg.getBoundingClientRect()
        if (this.data.offset && this.rect.bottom >= this.data.offset && this.rect.top <= (innerHeight - this.data.offset)) this.isAnimated = true
        else if (!this.data.offset && this.rect.bottom >= (innerHeight * 0.2) && this.rect.top <= (innerHeight * 0.7)) {
            this.isAnimated = true
        }
        else this.isAnimated = false
    }

    animationOnce(tg, idx) {
        if (!this.data.once && this.data.once !== undefined) {
            let tgRect = tg.getBoundingClientRect()
            if (tgRect.bottom <= 0 || tgRect.top >= innerHeight) {
                // 스크롤시 reset 작업 once
                this.animationCount[idx] = false
                tg.classList.remove('animated')
            }
        }
    }

    animationAttrData(tg) {
        let tgAttr = tg.getAttribute('data-animation').replace(/\s*/g, '')
        this.data = JSON.parse(tgAttr)
    }

    animationElSet(tg) {
        if (this.data.from) {
            gsap.set(tg, ...[this.data.from])
        }
    }

    animationEvent(tg, idx) {
        if (this.isAnimated && !tg.classList.contains('animated')) {
            if (this.animationCount[idx]) return false
            this.data.to['onStart'] = () => this.animationCount[idx] = true
            this.data.to['onComplate'] = () => tg.classList.add('animated')
            gsap.to(tg, this.data.duration, ...[this.data.to])
        }
    }

    animationElReset(idx) {
        this.reset[idx].pause(0)
    }
}