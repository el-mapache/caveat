class API::V1::BusinessesController < ApplicationController
  require "geocoder"

  def index    
    coords = params[:lat].to_s + "," + params[:lng].to_s
    cache = $redis.get(params[:address])
    if cache
      @businesses = JSON.parse(cache)
    else
      @businesses = API::V1::BusinessPresenter.present(Business.all_with_associations([params[:lat], params[:lng]]))
      $redis.setex(params[:address], 172800, @businesses.to_json)
    end

    render json: @businesses
  end

  def show
    @business = Business.with_associations(params[:id])
    render json: API::V1::BusinessPresenter.present(@business) 
  end
end
