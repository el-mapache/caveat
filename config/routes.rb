Caveat::Application.routes.draw do
  root :to => 'application#index'

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get "businesses"   => "businesses#index"
      get "business/:id" => "businesses#show"


      get "violations"    => "violations#index"
      get "violation/:id" => "violations#show"


      get "inspections"    => "inspections#index"
      get "inspection/:id" => "inspections#show"
    end
  end
end
