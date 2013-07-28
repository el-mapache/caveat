class API::V1::BusinessesController < ApplicationController
  def index
    @businesses = Business.all
    render json: @businesses
  end

  def show
    @business = Business.where(id: params[:id]).first
    render json: @business
  end
end
