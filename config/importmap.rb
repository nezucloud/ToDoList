# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "vue", to: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
pin "@popperjs/core", to: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
pin "bootstrap", to: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.esm.min.js'
pin "axios", to: 'https://unpkg.com/axios/dist/axios.min.js'
pin "dayjs", to: 'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js'
pin "iziToast", to: 'lib/iziToast.min.js'
pin_all_from "app/javascript/controllers", under: "controllers"