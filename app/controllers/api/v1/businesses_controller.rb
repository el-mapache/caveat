class API::V1::BusinessesController < ApplicationController
  def index    
    if params[:name] == "all"
      render json: Business.select("businesses.name").find(:all) and return
    end

    #cache = $redis.get(params[:address])

    #if cache
     # @businesses = JSON.parse(cache)
   # else
      @businesses = API::V1::BusinessPresenter.present(Business.all_with_associations([params[:lat], params[:lng]]))
     # $redis.setex(params[:address], 172800, @businesses.to_json)
    #end

    render json: @businesses
  end

  def show
    name = params[:id].to_s.strip

    cache = $redis.get(name)
    
    if cache
      @business = JSON.parse(cache)
    else
      @business = API::V1::BusinessPresenter.present(Business.with_associations(name))
    end
    
    render json: @business
  end
  
end
