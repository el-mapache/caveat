class Violation < ActiveRecord::Base
  attr_accessible :business_id, :date, :description, :pending, :corrected_on

  belongs_to :business
end
