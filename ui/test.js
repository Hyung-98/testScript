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

    animationAttrData(tg) {
        let tgAttr = tg.getAttribute('data-animation').replace(/\s*/g, '')
        this.data = JSON.parse(tgAttr)
    }

    detectAnimation(tg) {
        this.rect = tg.getBoundingClientRect()
        let refRect = this.data.reference ? document.querySelector(this.data.reference).getBoundingClientRect() : undefined
        console.log(refRect)

        if (
            !this.data.reference &&
            !this.data.offset &&
            this.rect.bottom >= (innerHeight * 0.2) &&
            this.rect.top <= (innerHeight * 0.7)
            ) this.isAnimated = true
        else if (
            !this.data.reference &&
            this.data.offset &&
            this.rect.bottom >= this.data.offset &&
            this.rect.top <= (innerHeight - this.data.offset)
            ) this.isAnimated = true
        else if (
            this.data.reference &&
            this.data.offset &&
            refRect.top >= this.data.offset && 
            refRect.top <= (innerHeight - this.data.offset)
            ) this.isAnimated = true
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
            this.data.to['onComplete'] = () => tg.classList.add('animated')
            let tween = gsap.to(tg, this.data.duration, ...[this.data.to])
            if (this.data.once === false && !this.data.from && this.data.to) {
                this.reset.shift()
                this.reset.push(tween)
            }
        }
    }
}

class Parallax {
    constructor(tg) {
        this.set()
        this.bind(tg)
    }
    
    set() {
        this.tg = []
        this.data = {}
    }

    bind(tg) {
        tg.forEach((el, index) => {
            this.parallaxData(el, index)
            this.parallaxEvent(index)
            this.parallaxSet(index)
        })
    }

    parallaxData(el, idx) {
        let data = el.getAttribute('data-parallax').replace(/\s*/g, '')
        let datas = JSON.parse(data)
        this.data[idx] = datas
        this.data[idx].animate = false
        this.data[idx].enter = datas.enter >= 0 ? datas.enter : 0
        this.data[idx].leave = datas.leave >= 0 ? datas.leave : 100
        this.data[idx].limit = true

        this.tg.push({
            $el: el,
            $reference: this.data[idx].reference === undefined ? el : this.data[idx].reference,
            data: this.data[idx]
        })
    }

    parallaxSet(idx) {
        gsap.set(this.tg[idx].$el, ...[this.tg[idx].data.from])
    }

    parallaxEvent(idx) {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.tg[idx].$reference,
                start: `${this.tg[idx].data.enter}% bottom`,
                end: `${this.tg[idx].data.leave}% top`,
                scrub: true,
                markers: true,
                ease: 'none'
            }
        })
        
        tl.to(this.tg[idx].$el, ...[this.tg[idx].data.to])
    }
}

class Ui {
    constructor(tg) {
        this.set()
        this.bind(tg)
    }

    set() {
        this.Animation = []
        this.Parallax = []
    }

    bind(tg) {
        tg.forEach((el, index) => {
            if (el.getAttribute('data-animation')) {
                this.animationInfo(el)
                this.animationLocationSet(el, index)
                this.animationEvent(el, index)
            }
            else if (el.getAttribute('data-parallax')) this.parallaxInfo(el)
        })
    }

    animationData(tg) {
        let data = {}        
        let datas = tg.getAttribute('data-animation').replace(/\s*/g, '')
        data = JSON.parse(datas)
        data.to.delay = data.to.delay ? data.to.delay : 0.5
        data.to.duration = data.to.duration ? data.to.duration : 1
        return data
    }

    animationInfo(tg, idx) {
        let data = this.animationData(tg, idx)

        this.Animation.push({
            $el: tg,
            $reference: data.reference ? document.querySelector(data.reference) : tg,
            data: data,
            rect: tg.getBoundingClientRect()
        })
    }

    animationLocationSet(tg, idx) {
        if (this.Animation[idx].data.from) gsap.set(tg, ...[this.Animation[idx].data.from])
        else return
    }

    animationEvent(tg, idx) {

        const tl = gsap.timeline({
            onComplete: () => {
                tg.classList.add('animated')
                this.Animation[idx].animated = true
            }
        })

        if (this.Animation[idx].data.offset && this.Animation[idx].data.reference) {
            if (this.Animation[idx].rect.top <= (innerHeight - this.Animation[idx].rect.height) && this.Animation[idx].rect.bottom >= this.Animation[idx].rect.height) {
                tl.to(tg, this.Animation[idx].data.duration, ...[this.Animation[idx].data.to])
            }
        }
        
    }

    parallaxData(tg) {
        let data = {}
        let datas = tg.getAttribute('data-parallax').replace(/\s*/g, '')
        data = JSON.parse(datas)
        data.enter = data.enter >= 0 ? data.enter : 0
        data.leave = data.leave <= 100 ? data.leave : 100
        data.limit = data.limit === false ? false : true
        data.reference = data.reference !== undefined ? data.reference : false

        return data
    }

    parallaxInfo(tg, idx) {
        let data = this.parallaxData(tg, idx)

        this.Parallax.push({
            $el: tg,
            $reference: data.reference ? document.querySelector(data.reference) : tg,
            data: data
        })
    }
}