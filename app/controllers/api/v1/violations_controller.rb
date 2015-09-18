class Api::V1::ViolationsController < ApplicationController
  def index
    @violations = Violation.all
    render json: @violations
  end

  def show
    @violation = Violation.where(id: params[id]).first
    render json: @violation
  end
end
