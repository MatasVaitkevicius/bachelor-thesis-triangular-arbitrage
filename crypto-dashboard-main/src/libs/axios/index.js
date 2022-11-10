let ax = require('axios')

window.axios = ax.create()

window.axios.defaults.headers.common = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
  "Accept": "application/json",
}

window.axios.interceptors.response.use(response => {
  return response
}, error => {
  // Can return Promise.reject({}) to send no error back
  return Promise.reject(error)
})
