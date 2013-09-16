Caveat::Application.routes.draw do
  root :to => 'application#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get "businesses"          => "businesses#index"
      get "businesses/:id"        => "businesses#show"
    end
  end
end
