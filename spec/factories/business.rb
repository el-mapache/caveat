require "factory_girl"

FactoryGirl.define do
  factory :business do
    name "Tasti Dlite"
    address "345 5th Ave"
    city "New York"
    state "NY"
    zip_code "12344"
    latitude "37.791116"
    longitude "-122.403816"
  end
end
