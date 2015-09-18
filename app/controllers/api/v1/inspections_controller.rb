class Api::V1::InspectionsController < ApplicationController
  def index
    @inspections = Inspection.all
    render json: @inspections
  end

  def show
    @inspection = Inspection.where(id: params[:id]).first
    render json: @inspection
  end
end
