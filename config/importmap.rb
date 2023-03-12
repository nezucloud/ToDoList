# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "vue", to: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
pin "vue-router", to: 'https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js'
pin "bootstrap", to: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.esm.min.js'
pin_all_from "app/javascript/controllers", under: "controllers"
