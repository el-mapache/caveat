class Business < ActiveRecord::Base
  attr_accessible :address, :city, :latitude, :longitude, :name, :phone, :state, :zip_code

  has_many :violations
  has_many :inspections

  validates :latitude, :longitude, :name, presence: true
  validates :name, uniqueness: { scope: [:latitude, :longitude] }
end
