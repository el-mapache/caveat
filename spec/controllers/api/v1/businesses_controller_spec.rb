require 'spec_helper'

describe API::V1::BusinessesController do
  describe "'GET' index" do
    it "returns json" do
      get :index
      response.content_type.should eq("application/json")
    end
    it "returns a JSON representation of businesses array" do
      business = FactoryGirl.create(:business)
      get :index
      assigns(:businesses).should eql([business])
    end
  end

  describe "'GET' show" do
    it "returns a JSON representation of a single business" do
      business = FactoryGirl.create(:business)
      get :show, id: business.id
      assigns(:business).should eql(business)
    end
  end
end
