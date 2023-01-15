import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const api = new ExcursionsAPI()
const apiUrl = 'http://localhost:3000/excursions'

document.addEventListener('DOMContentLoaded', init);

const itemPrototype = document.querySelector('.excursions__item--prototype')
itemPrototype.dataset.id = null

function init() {
    console.log('admin')
    addExcursions()
    initialLoad()
}

function loadExcursions() {
    api.loadData()
        .then(data => {
            insertExcursions(data)
        })
        .catch(err => console.error(err))

}

function initialLoad() {
    api.loadData()
        .then(resp => {
            resp.forEach((item) => {
                if (item) {
                    const newItem = itemPrototype.cloneNode(true)
                    newItem.classList.remove("excursions__item--prototype")
                    const excursionsPanel = document.querySelector('.panel__excursions')
                    const itemName = newItem.querySelector('.excursions__title')
                    itemName.innerText = item.name
                    const itemDesc = newItem.querySelector('.excursions__description')
                    itemDesc.innerText = item.description
                    const itemAdultPrice = newItem.querySelector('.excursions__field-adult-price')
                    itemAdultPrice.innerText = item.adults
                    const itemChildPrice = newItem.querySelector('.excursions__field-child-price')
                    itemChildPrice.innerText = item.children
                    newItem.dataset.id = item.id
                    excursionsPanel.appendChild(newItem)
                }
            })
            removeExcursions()
            updateExcursions()

        })
        .catch(err => console.error(err))




}

function addExcursions() {
    const form = document.querySelector('.form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const { name, description, adults, children } = e.target.elements

        const data = {
            name: name.value, description: description.value, adults: adults.value, children: children.value
        }

        if (data.name !== '' && data.description !== '' && data.adults !== '' && data.children !== '') {
            clearError()
            api.addData(data)
                .catch(err => console.error(err))
                .finally(loadExcursions)

        }
        else {
            if (name.value === "") {
                error(name)
            }
            else if (description.value === "") {
                error(description)
            }
            else if (adults.value === "") {
                error(adults)
            }
            else if (children.value === "") {
                error(children)
            }
        }
    })
}

function insertExcursions(excursionsArr) {
    const form = document.querySelector('.form')
    const name = form.querySelector('input[name="name"]')
    const description = form.querySelector('textarea[name="description"]')
    const adults = form.querySelector('input[name="adults"]')
    const children = form.querySelector('input[name="children"]')
    const newItem = itemPrototype.cloneNode(true)
    newItem.classList.remove("excursions__item--prototype")
    const excursionsPanel = document.querySelector('.panel__excursions')

    if (name !== '' && description !== '' && adults !== '' && children !== '') {
        const itemName = newItem.querySelector('.excursions__title')
        itemName.innerText = name.value
        const itemDesc = newItem.querySelector('.excursions__description')
        itemDesc.innerText = description.value
        const itemAdultPrice = newItem.querySelector('.excursions__field-adult-price')
        itemAdultPrice.innerText = adults.value
        const itemChildPrice = newItem.querySelector('.excursions__field-child-price')
        itemChildPrice.innerText = children.value
        excursionsPanel.appendChild(newItem)
        form.reset()

    }
    excursionsArr.forEach(item => {
        newItem.dataset.id = item.id
    })

}

function error(item) {
    if (item.parentNode.querySelector('.no-data')) {
    }
    else {
        const newError = document.createElement("span")
        newError.classList.add('no-data')
        newError.innerText = 'Wprowadz poprawne dane'
        newError.setAttribute('style', 'color:red')
        const parentNode = item.parentNode
        parentNode.appendChild(newError)
    }
}
function clearError(el) {
    const form = document.querySelector('.form')
    const error = form.parentNode.querySelectorAll('.no-data')
    if (error) {
        error.forEach((e) => e.remove())
    }

}

function updateExcursions() {
    const excursionsList = document.querySelectorAll('.excursions__field-input--update')
    const editItem = () => {
        if (excursionsList) {
            excursionsList.forEach((item) => {
                item.addEventListener('click', (e) => {
                    const currentLi = item.parentNode.parentNode.parentNode
                    const contentArray = []
                    contentArray.push(currentLi.querySelector('.excursions__title'))
                    contentArray.push(currentLi.querySelector('.excursions__description'))
                    contentArray.push(currentLi.querySelector('.excursions__field-adult-price'))
                    contentArray.push(currentLi.querySelector('.excursions__field-child-price'))
                    console.dir(contentArray)
                    contentArray.forEach((el) => {
                        console.dir(el)
                        el.contentEditable = "true"
                    })


                    const button1 = currentLi.querySelector('.excursions__field-input--update')
                    button1.value = "zapisz"
                    const button2 = button1.cloneNode(true)
                    button2.value = "anuluj"
                    button1.parentNode.appendChild(button2)
                    button2.addEventListener('click', (i) => {
                        location.reload()
                    })
                    button1.addEventListener('click', (i) => {
                        const id = currentLi.dataset.id
                        const name = contentArray[0]
                        const description = contentArray[1]
                        const adults = contentArray[2]
                        const children = contentArray[3]
                        console.log(isNaN(adults.innerText))
                        if (isNaN(adults.innerText) != false) {
                            error(contentArray[2])
                        }
                        else {
                            console.log('else1')
                            if (isNaN(children.innerText) != false) {
                                error(contentArray[3])
                            }
                            else {
                                console.log('else2')
                                const data = {
                                    name: name.innerText, description: description.innerText, adults: adults.innerText, children: children.innerText
                                }
                                const options = {
                                    method: 'PUT',
                                    body: JSON.stringify(data),
                                    headers: { 'Content-Type': 'application/json' }
                                }
                                fetch(`${apiUrl}/${id}`, options)
                                    .then(resp => console.log(resp))
                                    .catch(err => console.error(err))
                                    .finally(() => {
                                        location.reload()
                                    }
                                    )
                            }
                        }
                    })
                })

            })
        }
    }
    editItem()
}

function removeExcursions() {
    const excursionsList = document.querySelectorAll('.excursions__field-input--remove')
    if (excursionsList) {
        const preventSubmit = () => {
            excursionsList.forEach((excursion) => {
                excursion.parentNode.parentNode.addEventListener('submit', (e) => {
                    e.preventDefault()
                })
            })
        }
        const removeItem = () => {
            excursionsList.forEach((excursion) => {
                excursion.addEventListener('click', (e) => {
                    const currentLi = excursion.parentNode.parentNode.parentNode
                    console.log(currentLi)
                    const deleteFromData = (() => {
                        const id = currentLi.dataset.id
                        const options = { method: 'DELETE' }
                        fetch(`${apiUrl}/${id}`, options)
                            .then()
                            .catch(err => console.error(err))
                            .finally(() => {
                                location.reload()
                            }
                            )
                    })()
                })
            })
        }
        preventSubmit()
        removeItem()
    }
}