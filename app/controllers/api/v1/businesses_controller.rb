class API::V1::BusinessesController < ApplicationController
  def index
    @businesses = Business.all_with_associations([params[:lat], params[:lng]])
    render json: API::V1::BusinessPresenter.present(@businesses)
  end

  def show
    @business = Business.with_associations(params[:id])
    render json: API::V1::BusinessPresenter.present(@business) 
  end
end
