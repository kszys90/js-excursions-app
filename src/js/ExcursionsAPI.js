const excursionsUrl = 'http://localhost:3000/excursions'
const ordersUrl = 'http://localhost:3000/orders'
class ExcursionsAPI {
    constructor() {
        this.urlExcursions = excursionsUrl
        this.urlOrders = ordersUrl
    }
    loadData() {
        return this._fetch()
      }
    addData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return this._fetch(options)
    }
    addOrder(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return fetch(this.urlOrders, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }
                return Promise.reject(resp)
            })
    }
    _fetch(options) {
        return fetch(this.urlExcursions, options)
            .then(resp => {
                if (resp.ok) { return resp.json() }
                return Promise.reject(resp)
            })
    }
}


export default ExcursionsAPI;