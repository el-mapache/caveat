class Business < ActiveRecord::Base
  attr_accessible :address, :city, :latitude, :longitude, :name, :phone, :state,
                  :zip_code

  has_many :violations
  has_many :inspections, order: "date DESC"

  validates :name, presence: true

  # Multiple business may have the same name (i.e. McDonalds),
  # but they can't exist in the same place at once...in this dimension, anyway
  validates :name, uniqueness: { scope: [:latitude, :longitude] }
  validates :latitude, format: {
             with: /^\s*[-+]?\d+/,
            message: "Invalid latitude/longitude format" 
  }
  validates :longitude, format: { 
            with: /^\s*[-+]?\d+/, 
            message: "Invalid latitude/longitude format" 
  }

  class << self
    # Find all nearby businesses along with their associations
    #
    # @param {location} Array Latitude and longitude or address string
    # @param {limit} Integer nearby business to be returned
    # @param {distance} Integer Radius in miles around coords to be searched
    def all_with_associations(location, limit = 35, distance = 2)
      Business.near(location, distance)
              .includes(:violations, :inspections)
              .limit(limit)
    end

    # Find a single business with its associations
    #
    # @param id: Id of the business
    def with_associations(id)
      if id.match(/[0-9]+/)
        includes(:violations, :inspections).find(id)
      else
        includes(:violations, :inspections).where("name LIKE ?", "%#{id}%")
      end
    end
  end

  geocoded_by :street_address
  reverse_geocoded_by :latitude, :longitude

  private
  def street_address
    [address, city, state, "US"].compact.join(", ")
  end
end
