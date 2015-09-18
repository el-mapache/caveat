class Api::V1::BusinessesController < ApplicationController
  def index
    if params[:name] == "all"
      render json: Business.select("businesses.name").find(:all) and return
    end

    @businesses = Api::V1::BusinessPresenter.present(Business.all_with_associations([params[:lat], params[:lng]]))
    render json: @businesses
  end

  def show
    name = params[:id].to_s.strip

    # this seems ridiculous but necessary to test if redis is connected and running
    # If redis is running the connected? method wont be callable on the object
    cache = if $redis.respond_to?(:connected?)
              nil
            else
              $redis.get(name)
            end

    if cache
      @business = JSON.parse(cache)
    else
      @business = Api::V1::BusinessPresenter.present(Business.with_associations(name))
    end

    render json: @business
  end
end
