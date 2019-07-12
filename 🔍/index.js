const wrapper = document.getElementsByClassName('wrapper')[0]
const MUL = 1.2

function createElement(elem) {
    let img = new Image()
    img.src = 'https://wx1.sinaimg.cn/mw690/007IvJqVgy1g3to490lnkj31o026wx6t.jpg'
    img.className = 'box'
    img.width = 400
    elem.appendChild(img)
    img.onload = function () {
        let boxWidth = img.width
        let boxHeight = img.height
        bindEvent({
            boxWidth,
            boxHeight
        })
    }
}

function getMagnifierSize() {
    let magnifier = document.getElementsByClassName('magnifier')[0]
    let width = parseInt(window.getComputedStyle(magnifier).width)
    let height = parseInt(window.getComputedStyle(magnifier).height)
    return {
        width,
        height,
        dom: magnifier
    }
}

function bindEvent(imgSize) {
    let img = imgSize
    let magnifier = getMagnifierSize()
    let wrapper = document.getElementsByClassName('wrapper')[0]
    wrapper.addEventListener('mousemove', (e) => {
        magnifier.dom.style.display = 'block'
        let left = e.clientX - wrapper.offsetLeft
        let top = e.clientY - wrapper.offsetTop
        magnifier.dom.style.left = left - magnifier.width / 2 + 'px'
        magnifier.dom.style.top = top - magnifier.height / 2 + 'px'
        magnifier.dom.style.backgroundSize = img.boxWidth * MUL + 'px ' + img.boxHeight * MUL + 'px'
        magnifier.dom.style.backgroundPositionX = -(left * MUL - magnifier.width / 2) + 'px';
        magnifier.dom.style.backgroundPositionY = -(top * MUL - magnifier.height / 2) + 'px';
        if (left < 0 || top < 0 || left > img.boxWidth || top > img.boxHeight) {
            magnifier.dom.style.display = 'none'
        }
    })
}
(function () {
    createElement(wrapper)
}())