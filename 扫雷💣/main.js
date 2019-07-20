const SIMPLE = {
    title: 'simple',
    row: 10,
    column: 10,
    bomb: 1
}
const MEDIUM = {
    title: 'medium',
    row: 16,
    column: 16,
    bomb: 40
}
const DIFFICULT = {
    title: 'difficult',
    row: 16,
    column: 30,
    bomb: 100
}
let app = document.getElementById('App')
const btnWrapper = document.getElementsByClassName('btnWrapper')[0]
const wrapper = document.getElementById('wrapper')

function _init() {

}
//创建面板
function createPanel(select) {
    app.innerHTML = ''
    if (select === SIMPLE.title) {
        map = mineMap(SIMPLE)
        transition(app)
        mineSweeping(SIMPLE)
    } else if (select === MEDIUM.title) {
        map = mineMap(MEDIUM)
        transition(app)
        mineSweeping(MEDIUM)
    } else if (select === DIFFICULT.title) {
        map = mineMap(DIFFICULT)
        transition(app)
        mineSweeping(DIFFICULT)
    } else {
        return
    }

}
//创建静态地图面板
function forCreate(elem, map) {
    for (let i = 0; i < map.length; i++) {
        let ul = document.createElement('ul')
        ul.className = `row row-${i}`
        ul.setAttribute('data-x', i)
        elem.appendChild(ul)
        let ulList = elem.getElementsByClassName('row')
        for (let j = 0; j < map[0].length; j++) {
            let text = map[i][j]
            let li = document.createElement('li')
            li.className = `column column-${j}`
            li.setAttribute('data-y', j)
            li.innerHTML = `
            <span class="hide">${text===0?'':(text==='B'?'B<img src="./images/bomb.png" width="20"/>':text)}</span>
            <img src="./images/flag.png" width="20" class="hide"/>
            `
            ulList[i].appendChild(li)
        }
    }
    return map
}
//二维数组的地图
function mineMap(mode) {
    let r = mode.row
    let c = mode.column
    let num = mode.bomb
    let mineMap = []
    for (let i = 0; i < r; i++) {
        mineMap[i] = []
        for (let j = 0; j < c; j++) {
            mineMap[i][j] = 0
        }
    }

    function randomLocation() {
        for (let i = 0; i < num; i++) {
            let x = Math.floor(Math.random() * r)
            let y = Math.floor(Math.random() * c)
            mineMap[x][y] = 'B'
        }
    }

    function ExceptMine(map, x, y) {
        if (x >= 0 && x < r && y >= 0 && y < c) {
            if (map[x][y] !== 'B') {
                map[x][y] += 1
            }
        }
    }

    function initMineMap(map) {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                if (map[x][y] === 'B') {
                    for (let i = -1; i < 2; i++) {
                        ExceptMine(map, x - 1, y + i)
                        ExceptMine(map, x + 1, y + i)
                    }
                    ExceptMine(map, x, y - 1)
                    ExceptMine(map, x, y + 1)
                }
            }
        }
    }

    randomLocation()
    initMineMap(mineMap)
    forCreate(app, mineMap)
    return mineMap
}

function transition(elem) {
    let ul = elem.getElementsByClassName('row')
    for (let i = 0; i < ul.length; i++) {
        let li = ul[i].getElementsByClassName('column')
        ul[i].style.boxShadow = '1px 1px 3px rgba(0,0,0,.1)'
        for (let j = 0; j < li.length; j++) {
            li[j].style.cursor = 'wait'
            li[j].style.backgroundColor = 'rgba(0,0,0,.1)'
            setTimeout(function () {
                li[j].style.cursor = 'pointer'
                ul[i].style.boxShadow = 'none'
                li[j].style.backgroundColor = '#3a81f7b3'
            }, 1000)
        }
    }
}

function mineSweeping(mode) {
    let r = mode.row
    let c = mode.column

    function beClicked(x, y) {
        if (x < r && x >= 0 && y < c && y >= 0) {
            let elem = app.querySelector(`.row-${x}`).children[y]
            if (elem.style.background !== 'white') {
                elem.style.background = 'white'
                elem.style.cursor = 'no-drop'
                elem.children[0].className = ''
                // console.log(clearMineNum, 'clearMineNum');
                if (elem.children[0].innerText === '') {
                    intelligent(x, y)
                }
            }
        }
    }

    function intelligent(x, y) {
        beClicked(x, y + 1)
        beClicked(x, y - 1)
        beClicked(x + 1, y - 1)
        beClicked(x + 1, y)
        beClicked(x + 1, y + 1)
        beClicked(x - 1, y - 1)
        beClicked(x - 1, y)
        beClicked(x - 1, y + 1)
    }
    app.addEventListener('mouseup', function (e) {
        e.stopImmediatePropagation()
        let elem = e.target
        if (elem.tagName == 'UL') {
            return
        } else if (elem.tagName == 'SPAN' || elem.tagName == 'IMG') {
            elem = elem.parentElement
        }
        let tag = elem.children[1].classList.contains('hide')
        let x = Number(elem.parentElement.dataset.x)
        let y = Number(elem.dataset.y)
        if (e.button === 0 && tag) {
            if (elem.style.cursor == 'wait') {
                return
            }
            beClicked(x, y)
            checkWin(mode)
            arr = []
            if (elem.children[0].innerText === 'B') {
                alert('游戏结束')
                let all = app.getElementsByClassName('column')
                for (let i = 0; i < all.length; i++) {
                    if (all[i].children[0].innerText === 'B') {
                        all[i].style.backgroundColor = '#fff'
                        all[i].children[0].className = ''
                    }
                }
            }
        } else if (e.button === 2) {
            if (!tag) {
                elem.children[1].className = 'hide'
            } else {
                elem.children[1].className = ''
            }
            checkWin(mode)
        }
    })
}

function checkWin(mode) {
    let arr = []
    let liList = app.getElementsByClassName('column')
    for (let i = 0; i < liList.length; i++) {
        if (liList[i].style.background == 'white') {
            if (arr.indexOf(liList[i]) == -1) {
                arr.push(liList[i])
            }
        }
    }
    let row = mode.row
    let column = mode.column
    let num = mode.bomb
    let withoutBomb = row * column - num
    if (arr.length == withoutBomb) {
        alert('你他妈赢了')
    }
}







btnWrapper.addEventListener('click', function (e) {
    let title = e.target.title
    if (title === '') return
    createPanel(title)
})