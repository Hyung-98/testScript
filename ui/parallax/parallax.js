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
        
        console.log(this.tg)
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