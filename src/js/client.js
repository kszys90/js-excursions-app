import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('client');
const api = new ExcursionsAPI()
const excursionsUrl = 'http://localhost:3000/excursions'
const ordersUrl = 'http://localhost:3000/orders'

document.addEventListener('DOMContentLoaded', init)

const excursionsItemPrototype = document.querySelector('.excursions__item--prototype')
const summaryItemPrototype = document.querySelector('.summary__item--prototype')

function init() {
    loadExcursions()
    calcOrderItems()
    addOrder()
}

function loadExcursions() {
    api.loadData()
        .then(resp => {
            resp.forEach((item) => {
                if (item) {
                    const newItem = excursionsItemPrototype.cloneNode(true)
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
            submitItem()

        })
        .catch(err => console.error(err))
}

function submitItem() {
    const formList = document.querySelectorAll('.excursions__form')
    formList.forEach((item) => {
        item.addEventListener('submit', (e) => {
            e.preventDefault()
            const adultsNumber = item.querySelector('.excursions__field-adult')
            const childrenNumber = item.querySelector('.excursions__field-child')
            if (adultsNumber.value !== '' && childrenNumber.value !== '' && isNaN(Number(adultsNumber.value)) !== true && isNaN(Number(childrenNumber.value)) !== true) {
                clearError(adultsNumber.parentNode.parentNode)
                const newOrderItem = summaryItemPrototype.cloneNode(true)
                newOrderItem.classList.remove('summary__item--prototype')
                newOrderItem.classList.add('summary__item--order')
                const name = item.parentNode.querySelector('.excursions__title').innerText
                const adultPrice = item.querySelector('.excursions__field-adult-price').innerText
                const childPrice = item.querySelector('.excursions__field-child-price').innerText
                const orderItemName = newOrderItem.querySelector('.summary__name')
                orderItemName.innerText = name
                const orderItemAdultsNumber = newOrderItem.querySelector('.summary__prices--adults-number')
                orderItemAdultsNumber.innerText = Number(adultsNumber.value)
                const orderItemAdultsPrice = newOrderItem.querySelector('.summary__prices--adults-price')
                orderItemAdultsPrice.innerText = adultPrice
                const orderItemChildNumber = newOrderItem.querySelector('.summary__prices--child-number')
                orderItemChildNumber.innerText = Number(childrenNumber.value)
                const orderItemChildPrice = newOrderItem.querySelector('.summary__prices--child-price')
                orderItemChildPrice.innerText = childPrice
                const panelSummary = document.querySelector('.panel__summary')
                const orderItemTotalPrice = newOrderItem.querySelector('.summary__total-price')
                orderItemTotalPrice.innerText = adultPrice * adultsNumber.value + childPrice * childrenNumber.value

                panelSummary.appendChild(newOrderItem)

                removeItem()
                item.reset()
            }
            else {
                if (isNaN(Number(adultsNumber.value)) === true) {
                    error(adultsNumber)
                }
                else {
                    if (adultsNumber.value !== '') {
                        clearError(adultsNumber.parentNode)
                    }
                    else {
                        error(adultsNumber)
                    }
                }
                if (isNaN(Number(childrenNumber.value)) === true) {
                    error(childrenNumber)
                }
                else {
                    if (childrenNumber.value !== '') {
                        clearError(childrenNumber.parentNode)
                    }
                    else {
                        error(childrenNumber)
                    }
                }
            }
            calcOrderItems()
        })

    })
}

function error(element, option) {
    if (element.parentNode.querySelector('.wrongData')) {
    }
    else {
        const newError = document.createElement("span")
        newError.classList.add('wrongData')
        if (option) {
            newError.innerText = option
            newError.setAttribute('style', 'color:red')
            const parentNode = element.parentNode
            parentNode.appendChild(newError)
        }
        else {
            newError.innerText = 'Wprowadz poprawne dane'
            newError.setAttribute('style', 'color:red')
            const parentNode = element.parentNode
            parentNode.appendChild(newError)
        }
    }
}

function clearError(element) {
    if (element.parentNode.querySelector('.wrongData')) {
        const error = element.parentNode.querySelectorAll('.wrongData')
        if (error) {
            error.forEach((e) => e.remove())
        }
    }

}

function removeItem() {
    const removeButtonList = document.querySelectorAll('.summary__btn-remove')
    if (removeButtonList) {
        removeButtonList.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                button.parentNode.parentNode.remove()
                calcOrderItems()
            })
        })
    }
}

function calcOrderItems() {
    const summaryItems = document.querySelectorAll('.summary__item')
    const totalPrice = document.querySelector('.order__total-price-value')
    let summaryPrice = 0
    totalPrice.innerText = summaryPrice
    const itemPrototype = document.querySelector('.summary__item--prototype')
    summaryItems.forEach((item) => {
        if (item === itemPrototype) {
        }
        else {
            const itemPrice = item.querySelector('.summary__total-price').innerText
            summaryPrice += Number(itemPrice)
            totalPrice.innerText = summaryPrice
        }
    })

}

function addOrder() {
    const orderForm = document.querySelector('.panel__order')
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const orderPrice = orderForm.querySelector('.order__total-price-value')
        const name = orderForm.querySelector('.order__field-input[name="name"]')
        const email = orderForm.querySelector('.order__field-input[name="email"]')
        const chosenExcursions = document.querySelectorAll('.summary__item--order')
        const orderedExcursions = []
        if (chosenExcursions) {
            chosenExcursions.forEach((exc) => {
                const excTitle = exc.querySelector('.summary__name').innerText
                const excAdults = exc.querySelector('.summary__prices--adults-number').innerText
                const excChildren = exc.querySelector('.summary__prices--child-number').innerText
                const obj = {
                    "name": excTitle,
                    "adults": excAdults,
                    "children": excChildren
                }
                orderedExcursions.push(obj)
            })

        }
        if (orderPrice.innerText > 0 && name.value.length > 5 && ValidateEmail(email) === true) {
            clearError(orderPrice.parentNode)
            // dorobić obiekt z wycieczkami
            const data = {
                name: name.value, email: email.value, price: orderPrice.innerText, excursions: orderedExcursions
            }
            api.addOrder(data, ordersUrl)
                .catch(err => console.error(err))
                .finally(location.reload())
        }
        else {
            if (orderPrice.innerText > 0) {
                clearError(orderPrice)
            }
            else {
                error(orderPrice.parentNode, 'Koszyk jest pusty')
            }

            if (name.value.length > 5) {
                clearError(name.parentNode)
            }
            else {
                error(name.parentNode, 'Imię i Nazwisko jest za krótkie')
            }

            if (ValidateEmail(email) === true) {
                clearError(email.parentNode)
            }
            else {
                error(email.parentNode, 'Podany email jest niepoprawny')
            }
        }
    })
}

function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.value.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}