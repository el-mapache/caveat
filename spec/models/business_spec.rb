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
end
