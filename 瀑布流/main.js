const CARD_WIDTH = 200
const App = document.getElementById('app')
const wrapper = document.querySelector('#wrapper')
let liList = document.getElementsByClassName('card')

function _init() {
    createDom(40)
    waterFall(liList)
}
_init()

function createDom(cardNum) { //创建卡片及其数量
    let liArr = document.getElementsByClassName('card')
    for (let i = 0; i < cardNum; i++) {
        let li = document.createElement('li')
        li.className = `card card-${liArr.length+1}`
        li.style.width = `${CARD_WIDTH}px`
        li.style.height = randomHeight(100, 300) + 'px'
        li.style.background = randomColor()
        App.appendChild(li)
    }
    return [...liArr]
}

function randomHeight(min, max) { //随机高度    max:最大高度 min最小高度
    let random = max - min + 1;
    return Math.floor(Math.random() * random + min);
}

function randomColor() { //随机颜色
    this.r = Math.floor(Math.random() * 255)
    this.g = Math.floor(Math.random() * 255)
    this.b = Math.floor(Math.random() * 255)
    this.a = Math.random().toFixed(1)
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
}

function computeDetail() {
    let appWidth = parseInt(window.getComputedStyle(App).width)
    let cardNum = Math.floor(appWidth / CARD_WIDTH)
    let gapWidth = +((appWidth - cardNum * CARD_WIDTH) / (cardNum + 1)).toFixed(2)
    return {
        appWidth,
        cardNum,
        gapWidth
    }
}

function debounce(fn, delay = 500) {
    let timer = null
    return function (_args) {
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn(liList)
        }, delay)
    }
}

function waterFall(list) {
    let detail = computeDetail()
    let arr = new Array(detail.cardNum).fill(detail.gapWidth)
    for (let i = 0; i < list.length; i++) {
        let itemHeight = parseInt(window.getComputedStyle(list[i]).height)
        let minHeight = Math.min(...arr)
        let minIndex = arr.indexOf(minHeight)
        list[i].style.top = minHeight + 'px'
        if (i < detail.cardNum) {
            list[i].style.left = CARD_WIDTH * i + detail.gapWidth * (1 + i) + 'px'
        } else {
            list[i].style.left = list[minIndex].offsetLeft + 'px'
        }
        list[i].style.transition = .3 + 's ease-in'
        arr[minIndex] += itemHeight + detail.gapWidth
    }
    App.style.height = Math.max(...arr) + 'px'
}
window.addEventListener('resize', debounce(waterFall))
let scroll = new BScroll(wrapper, {
    pullUpLoad: {
        threshold: -40 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
    },
    probeType: 1,
    click: true,
    scrollbar: true
})
scroll.on('pullingUp', function () {
    let self = this
    setTimeout(function () {
        waterFall(createDom(10))
        self.refresh()
        self.finishPullUp()
    }, 700)
})