require 'spec_helper'

describe Business do
  context "accessible attributes" do
    it { should_not allow_mass_assignment_of(:id) }
    it { should allow_mass_assignment_of(:name) }
    it { should allow_mass_assignment_of(:address) }
    it { should allow_mass_assignment_of(:city) }
    it { should allow_mass_assignment_of(:latitude) }
    it { should allow_mass_assignment_of(:longitude) }
    it { should allow_mass_assignment_of(:phone) }
    it { should allow_mass_assignment_of(:state) }
    it { should allow_mass_assignment_of(:zip_code) }
  end

  context "associations" do
    it { should have_many(:violations) }
    it { should have_many(:inspections) }
  end

  context "validations" do
    it { should validate_presence_of(:name) }
   # describe "lat/lng formatting" do
   #   it { should allow_value("25.00232440").for(:latitude)}
   #   it { should_not allow_value("25").for(:latitude) }
   # end

    it "is invalid if latitude, longitude, and name are the same" do
      businessA = FactoryGirl.create(:business)
      expect { FactoryGirl.create(:business ) }.to raise_exception
    end
    
    it "is valid if the lat and long are different" do
      Business.create(name: "Tasti Dlite", latitude: "28.123456", longitude: "350.567890").should be_valid
    end
  end
end
