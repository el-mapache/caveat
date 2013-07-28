class Inspection < ActiveRecord::Base
  attr_accessible :business_id, :date, :score, :visit_type

  belongs_to :business
end
