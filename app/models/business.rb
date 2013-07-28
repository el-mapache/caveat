class Business < ActiveRecord::Base
  attr_accessible :address, :city, :latitude, :longitude, :name, :phone, :state, :zip_code

  has_many :violations
  has_many :inspections

  validates :name, presence: true
  validates :name, uniqueness: { scope: [:latitude, :longitude] }
  validates :latitude, format: { with: /^\s*[-+]?\d+/,
    message: "Invalid latitude/longitude format" }
  validates :longitude, format: { with: /^\s*[-+]?\d+/,
    message: "Invalid latitude/longitude format" }
end
