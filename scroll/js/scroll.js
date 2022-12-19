class Scroll {
    constructor(target) {
        this.set(target)
        this.bindEvent()
    }

    set(target) {
        this.scrollElement = target === window ? document.documentElement : target
        this.scrollListener = this.scrollElement.nodeName === 'HTML' ? window : this.scrollElement
        this.scrollInfo = {}
    }

    bindEvent() {
        this.scrollListener.addEventListener('scroll', ()=> this.scrollHandler() )
    }

    scrollHandler() {
        this.scrollInfo = {
            beforeTop: this.scrollElement.scrollTop,
            scrollTop: this.scrollElement.scrollTop,
            scrollTopDir: this.scrollTopDir(),
            scrollHeight: this.scrollElement.scrollHeight,
            height: this.scrollListener === window ? this.scrollListener.innerHeight : this.scrollElement.clientHeight,
            scrollTopPer: ((this.scrollElement.scrollTop / (this.scrollElement.scrollHeight - this.scrollInfo.height)) * 100).toFixed(2),
            scrollTopFir: this.scrollElement.scrollTop === 0 ? true : false,
            scrollTopLast: this.scrollElement.scrollTop === this.scrollElement.scrollHeight - this.scrollInfo.height ? true : false,
            beforeLeft: this.scrollElement.scrollLeft,
            scrollLeft: this.scrollElement.scrollLeft,
            scrollLeftDir: this.scrollLeftDir(),
            scrollWidth: this.scrollElement.scrollWidth,
            width: this.scrollListener === window ? this.scrollListener.innerWidth : this.scrollElement.clientWidth,
            scrollLeftPer: this.scrollElement.scrollLeft === 0 ? 0 : ((this.scrollElement.scrollLeft / (this.scrollElement.scrollWidth - this.scrollInfo.width)) * 100).toFixed(2),
            scrollLeftFir: this.scrollElement.scrollLeft === 0 ? true : false,
            scrollLeftLast: this.scrollElement.scrollLeft === this.scrollElement.scrollWidth - this.scrollInfo.width ? true : false,
        };

        this.scrollOutput(this.scrollInfo)
    }

    scrollOutput() {
        const statusBnner = document.querySelector('#status_banner')
        statusBnner.innerHTML = `
            "el : ${this.scrollElement.nodeName}"<br/>
            "scrollHeight: ${this.scrollInfo.scrollHeight}"<br/>
            "scrollWidth: ${this.scrollInfo.scrollWidth}"<br/>
            "height: ${this.scrollInfo.height}"<br/>
            "width: ${this.scrollInfo.width}"<br/>
            "scrollTop: ${this.scrollInfo.scrollTop}"<br/>
            "scrollTopPer: ${this.scrollInfo.scrollTopPer}"<br/>
            "scrollTopDir: ${this.scrollInfo.scrollTopDir}"<br/>
            "scrollTopFir: ${this.scrollInfo.scrollTopFir}"<br/>
            "scrollTopLast: ${this.scrollInfo.scrollTopLast}"<br/>
            "scrollLeft: ${this.scrollInfo.scrollLeft}"<br/>
            "scrollLeftPer: ${this.scrollInfo.scrollLeftPer}"<br/>
            "scrollLeftDir: ${this.scrollInfo.scrollLeftDir}"<br/>
            "scrollLeftFir: ${this.scrollInfo.scrollLeftFir}"<br/>
            "scrollLeftLast: ${this.scrollInfo.scrollLeftLast}"<br/>
        `;
    }

    scrollTopDir() {
        if (this.scrollInfo.beforeTop === this.scrollElement.scrollTop) {
            return null
        } else {
            return this.scrollInfo.beforeTop < this.scrollElement.scrollTop ? 'down' : 'up'
        }
    }

    scrollLeftDir() {
        if (this.scrollInfo.beforeLeft === this.scrollElement.scrollLeft) {
            return null
        } else {
            return this.scrollInfo.beforeLeft < this.scrollElement.scrollLeft ? 'left' : 'right'
        }
    }

    static to(x = 0, duration = 1000, callback = function() {console.log('Done')}) {
        let tg = !isNaN(x) ? x : document.querySelector(x).offsetTop
        const doc = document.documentElement
        const maxScroll = doc.scrollHeight - doc.clientHeight
        const fixY = tg > maxScroll ? maxScroll : x
        const stepY = (fixY - window.scrollY) / duration
        const currentY = window.scrollY
        const startTime = new Date().getTime()
        
        const disabledWheel = function(e) {
            e.preventDefault()
        }
        window.addEventListener('wheel', disabledWheel, {passive: false})    // (passive: true) 는 preventDefault() 를 막음 false로 설정해야 함

        // 버튼 클릭시 이전 scrollInterval 멈추고 클릭한 버튼 값으로 재실행
        let check;
        const scrollInterval = setInterval(() => {
            const now = new Date().getTime() - startTime                
            window.scrollTo({top: currentY + (stepY * now)})
            check = Scroll.check(true)
            if (duration <= now) {
                clearInterval(scrollInterval)
                window.removeEventListener('wheel', disabledWheel)
                callback()
            }
        }, 1)

        if (check) {
            console.log(check)
            clearInterval(scrollInterval)
        } else {
            clearInterval(scrollInterval)
        }
    }

    static check(val) {
        let test = { a : true }
        val ? test.a = val : test.a = false
        return test.a
    }
}