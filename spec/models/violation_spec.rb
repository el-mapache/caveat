require 'spec_helper'

describe Violation do
  context "accessible attributes" do
    it { should_not allow_mass_assignment_of(:id) }
    it { should allow_mass_assignment_of(:date) }
    it { should allow_mass_assignment_of(:description) }
    it { should allow_mass_assignment_of(:business_id) }
    it { should allow_mass_assignment_of(:corrected_on) }
    it { should allow_mass_assignment_of(:pending) }
  end

  context "associations" do
    it { should belong_to(:business) }
  end
end
