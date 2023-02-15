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
                this.animationElSet(tg)
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
        } else if(!this.data.from && this.reset.length > 0) {
            console.log(this.reset)
            this.reset[0].pause(0)

        }
    }

    animationEvent(tg, idx) {
        if (this.isAnimated && !(tg.classList.contains('animated'))) {
            if (this.animationCount[idx]) return false
            this.data.to['onStart'] = () => this.animationCount[idx] = true
            this.data.to['onComplate'] = () => tg.classList.add('animated')
            let tween = gsap.to(tg, this.data.duration, ...[this.data.to])
            if (this.data.once === false && !this.data.from && this.data.to) {
                this.reset.shift()
                this.reset.push(tween)
            }
        }
    }
}