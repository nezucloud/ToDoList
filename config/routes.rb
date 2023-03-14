Rails.application.routes.draw do
  root "pages#index"

  # Get files assets
  get 'files/assets/images/:file_name', to: "assets#images"

  # Dashboard
  get 'dashboard', to: "pages#dashboard"
  
  # Tasks
  post 'task/create', to: "tasks#create"
  get 'task/show', to: "tasks#show"
  patch 'task/update', to: "tasks#update"
  delete 'task/delete/:id', to: "tasks#delete"

  # Users
  devise_for :users, path: 'auth', path_names: { sign_in: 'login', sign_out: 'logout', password: 'secret', confirmation: 'verification', unlock: 'unblock', registration: 'register', sign_up: 'sign_up' }
  devise_scope :user do
    get 'auth/show', to: 'users/sessions#show'
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
