class Inspection < ActiveRecord::Base
  attr_accessible :business_id, :date, :score, :visit_type

  belongs_to :business, dependent: :destroy, counter_cache: true

  validates :score, presence: true
end
