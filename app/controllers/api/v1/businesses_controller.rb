class API::V1::BusinessesController < ApplicationController
  def index
    @businesses = Business.all
    render json: @businesses
  end

  def show
    @business = Business.includes(:violations, :inspections).find(params[:id])
    render json: { 
      business: @business, 
      violations: @business.violations, 
      inspections: @business.inspections 
    }
  end
end
