class Violation < ActiveRecord::Base
  attr_accessible :business_id, :date, :description
end
