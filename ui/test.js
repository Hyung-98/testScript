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
            } else if (el.getAttribute('data-parallax')) {
                console.log(el)
                this.parallaxInfo(el)
                // this.parallaxLocationSet(el, index)
            }

            window.addEventListener('scroll', () => {
                if (el.getAttribute('data-animation')) {
                    this.animationEvent(el, index)
                    this.animationOnce(el, index)
                } else if (el.getAttribute('data-animation')) {
                    this.parallaxEvent(el, index)
                }
            })
        })
    }

    /* Animation */
    animationData(tg) {
        let data = {}        
        let datas = tg.getAttribute('data-animation').replace(/\s*/g, '')
        data = JSON.parse(datas)
        data.offset = data.offset ? data.offset : 200
        data.once = data.once ? true : data.once
        return data
    }

    animationInfo(tg) {
        let data = this.animationData(tg)

        this.Animation.push({
            $el: tg,
            $reference: data.reference ? document.querySelector(data.reference) : tg,
            data: data
        })
    }

    animationLocationSet(tg, idx) {
        if (this.Animation[idx].data.from) gsap.set(tg, ...[this.Animation[idx].data.from])
        else return
    }

    animationEvent(tg, idx) {
        this.Animation[idx].rect = this.Animation[idx].$reference.getBoundingClientRect()

        if (
            !tg.classList.contains('animated') &&
            (this.Animation[idx].animated === undefined || this.Animation[idx].animated === false) &&
            this.Animation[idx].rect.bottom <= (innerHeight - this.Animation[idx].data.offset) &&
            this.Animation[idx].rect.top >= this.Animation[idx].data.offset
        ) {
            let tl = gsap.timeline({
                onComplete: () => {
                    tg.classList.add('animated')
                    this.Animation[idx].animated = true
                }
            })

            if (this.Animation[idx].data.offset && this.Animation[idx].data.reference) 
                tl.to(tg, this.Animation[idx].data.duration, ...[this.Animation[idx].data.to])
            else if (this.Animation[idx].data.offset && !this.Animation[idx].data.reference)
                tl.to(tg, this.Animation[idx].data.duration, ...[this.Animation[idx].data.to])
            else
                tl.to(tg, this.Animation[idx].data.duration, ...[this.Animation[idx].data.to])
        }
    }

    animationOnce(tg, idx) {
        if (
            this.Animation[idx].data.once === false &&
            (this.Animation[idx].rect.bottom <= 0 || this.Animation[idx].rect.top >= innerHeight)
        ) {
            this.animationLocationSet(tg, idx)
            tg.classList.remove('animated')
            this.Animation[idx].animated = false
        }
    }

    /* Parallax */
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

    parallaxLocationSet(tg, idx) {
        if (this.Parallax[idx].data.from) gsap.set(tg, ...[this.Parallax[idx].data.from])
        else return
    }

    parallaxEvent(tg, idx) {
        let parallaxTl = gsap.timeline({
            scrollTrigger: {
                trigger: tg,
                start: 'top bottom',
                end: 'bottom top',
                markers: true,
                scrub: true
            }
        })

        parallaxTl.to(tg, ...[this.Parallax.data.to])
    }
}