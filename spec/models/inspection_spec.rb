require 'spec_helper'

describe Inspection do
  context "accessible attributes" do
    it { should_not allow_mass_assignment_of(:id) }
    it { should allow_mass_assignment_of(:date) }
    it { should allow_mass_assignment_of(:score) }
    it { should allow_mass_assignment_of(:visit_type) }
    it { should allow_mass_assignment_of(:business_id) }
  end
  
  context "validations" do
    it { should validate_presence_of(:score) }
  end

  context "associations" do
    it { should belong_to(:business) }
  end
end
