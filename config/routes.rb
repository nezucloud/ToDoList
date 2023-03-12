Rails.application.routes.draw do
  root "pages#index"

  # Get files assets
  get 'files/assets/images/:file_name', to: "assets#images"

  get 'dashboard', to: "pages#dashboard"

  devise_for :users, path: 'auth', path_names: { sign_in: 'login', sign_out: 'logout', password: 'secret', confirmation: 'verification', unlock: 'unblock', registration: 'register', sign_up: 'sign_up' }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
