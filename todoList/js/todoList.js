class Todo{
    constructor(tg) {
        this.set(tg)
        this.bindEvent()
    }

    set(tg) {
        this.el = document.querySelector(tg)
        this.todoHeader = this.el.querySelector('.todo-list_head')
        this.todoHeaderSelect = this.todoHeader.querySelector('.all-select')
        this.todoHeaderInput = this.todoHeader.querySelector('input')
        this.todoHeaderButton = this.todoHeader.querySelector('button')
        this.todoContent = this.el.querySelector('.todo-list_content')
        this.todoFooter = this.el.querySelector('.todo-list_footer')
        this.todoSearch = this.todoFooter.querySelector('.todo-list_search')
        this.todoOption = this.todoFooter.querySelector('.todo-list_option')
        this.todoDelete = this.todoOption.querySelector('.todo-list_delete')
        this.todoInfo = []
        this.todoIndex = 0
    }

    bindEvent() {
        this.todoHeaderButton.addEventListener('click', () => this.addContentHandler())
        this.todoHeaderInput.addEventListener('keyup', (e) => {
            if(e.keyCode === 13) this.addContentHandler()
        })
        this.todoHeaderSelect.addEventListener('click', () => {            
            this.todoHeaderSelect.classList.toggle('on')
            this.selectCheck('all-select')
        })
        this.todoDelete.querySelector('.all-delete').addEventListener('click', () => this.deleteOption('all-delete'))
        this.todoDelete.querySelector('.select-delete').addEventListener('click', () => this.deleteOption('select-delete'))

        let searchs = this.todoSearch.querySelectorAll('span')
        for (const search of searchs) {
            search.addEventListener('click', () => this.searchEvent(search))
        }
    }

    addContentHandler() {
        if(this.todoHeaderInput.value && this.todoHeaderInput.value != 0) {
            let todoKey = this.todoIndex
            let todoVal = this.todoHeaderInput.value.trim()
            let todoObj = {[todoKey] : todoVal}

            this.todoInfo.push(todoObj)

            console.log(this.todoInfo)
        } else {
            alert('텍스트를 입력해주세요.')
        }

        if(this.todoHeaderInput.value.length > 0 && this.todoHeaderInput.value != 0) {
            const todoContentEl = document.createElement('li')
            todoContentEl.setAttribute('data-index', this.todoIndex)
            todoContentEl.innerHTML = `
                <div class="todo-list_check">
                    <span class="chk"></span>
                </div>
                <div class="todo-list_input">
                    <input
                        type="text"
                        value="${this.todoInfo.filter(val => parseInt(Object.keys(val)) === this.todoIndex).map(val => Object.values(val))}"
                        disabled
                    />
                </div>
                <div class="todo-list_icon">
                    <button class="modify"></button>
                    <button class="delete"></button>
                </div>
            `
            this.todoContent.append(todoContentEl)
            this.todoIndex += 1

            let todoIdx = this.todoIndex
            let todoInputEl = this.todoContent.lastChild.querySelector('.todo-list_input')
            let todoCheckEl = this.todoContent.lastChild.querySelector('.todo-list_check span')
            let todoModifyEl = this.todoContent.lastChild.querySelector('.modify')
            let todoDeleteEl = this.todoContent.lastChild.querySelector('.delete')
            
            todoInputEl.addEventListener('click', () => this.cancelLineEvent(todoInputEl))
            todoCheckEl.addEventListener('click', () => this.cancelLineEvent(todoCheckEl))
            todoModifyEl.addEventListener('click', () => this.modifyEvent(todoModifyEl, todoIdx))
            todoDeleteEl.addEventListener('click', () => this.deleteElEvent(todoDeleteEl, todoIdx))
        }

        this.todoHeaderInput.value = ''
        this.todoHeaderInput.focus()
        this.todoFooter.style.display = this.todoInfo.length > 0 ? 'flex' : 'none'
        this.searchEvent(this.todoSearch.querySelector('span.on'))
        this.selectCheck()
    }

    deleteElEvent(delTg, idx) {
        this.todoInfo = this.todoInfo.reduce((pre, cur) => {
            if(parseInt(Object.keys(cur)) !== idx - 1) pre.push(cur)
            return pre
        }, [])

        delTg.closest('li').remove()
        this.selectCheck()
        if(this.todoInfo.length < 1) {
            this.todoFooter.style.display = 'none'
        }
    }

    deleteOption(select) {
        let listItems = this.todoContent.children
        
        if(select === 'all-delete') {
            let reconf = confirm('모든 내용을 삭제 하시겠습니까?')
            if (reconf) {
                this.todoInfo = []
                this.todoContent.innerHTML = ''
                this.selectCheck()
                this.todoFooter.style.display = 'none'
            }
        } else if(select === 'select-delete') {
            [...listItems].filter(item => item.classList.contains('active')).map(item => {
                let itemIdx = item.getAttribute('data-index')

                this.todoInfo = this.todoInfo.reduce((pre, cur) => {
                    if(Object.keys(cur)[0] !== itemIdx) {
                        pre.push(cur)
                    }

                    return pre
                }, [])
                item.remove()
            })
        }
        
        this.selectCheck()
        if(this.todoInfo.length < 1) {
            console.log(this.todoInfo)
            this.todoFooter.style.display = 'none'
        }
        this.todoHeaderSelect.classList.remove('on')
    }

    modifyEvent(modiTg, idx) {
        if(modiTg.closest('li').classList.contains('active')) modiTg.closest('li').classList.remove('active')

        let input = modiTg.closest('li').querySelector('input')
        
        input.disabled = false
        input.focus()

        input.addEventListener('blur', () => this.modifyEventHandler(input, idx), {once: true})
        input.addEventListener('keydown', (e) => {
            if(e.keyCode === 13) this.modifyEventHandler(input, idx)
        })
    }

    modifyEventHandler(input, idx) {
        this.todoInfo.reduce((pre, cur) => {
            if(parseInt(Object.keys(cur)) === idx - 1) {
                cur[idx-1] = input.value
                input.setAttribute('value', input.value)
            }
            pre.push(cur)

            return pre
        }, [])
        
        input.disabled = true
    }

    cancelLineEvent(canTg) {
        let cancelTg = canTg.closest('li')

        if(canTg.querySelector('input') === document.activeElement) {
            cancelTg.classList.remove('active')
        }
        else {
            cancelTg.classList.contains('active')
            ? cancelTg.classList.remove('active')
            : cancelTg.classList.add('active')
        }

        this.selectCheck()
    }

    selectCheck(select) {
        let listItems = this.todoContent.children
        let activeCount = 0

        for(const item of listItems) {
            if(select === 'all-select') {
                this.todoHeaderSelect.classList.contains('on')
                ? item.classList.add('active')
                : item.classList.remove('active')
            } else {
                if(listItems.length === activeCount) this.todoHeaderSelect.classList.add('on')
                else this.todoHeaderSelect.classList.remove('on')
            }

            if(item.classList.contains('active') && listItems.length !== activeCount) {
                ++activeCount
            }
            console.log(activeCount)
        }        
        
        this.todoFooter.querySelector('.check-count').innerHTML = this.todoInfo.length - activeCount
        this.searchEvent(this.todoSearch.querySelector('span.on'))
    }

    searchEvent(searchTg) {
        const searchText = searchTg.getAttribute('data-type')
        
        for(const search of this.todoSearch.children) {
            search.classList.remove('on')
        }
        searchTg.classList.add('on')

        for(const con of this.todoContent.children) {
            if(searchText === 'All') con.style.display = 'flex'
            else if(searchText === 'Active') {
                !(con.classList.contains('active'))
                ? con.style.display = 'flex'
                : con.style.display = 'none'
            }
            else if(searchText === 'Complited') {
                con.classList.contains('active')
                ? con.style.display = 'flex'
                : con.style.display = 'none'
            }   
        }
    }
}