#encoding utf-8
require 'csv'
# Needed for the transliterate method
include ActiveSupport::Inflector

desc "Import SF business data"
task import_business: :environment do
  CSV.read([Rails.root, "app", "assets", "data", "businesses.csv"].join("/"))[1..-1].each do |row|
    b = Business.where(id: row[0]).first_or_initialize

    b.id = row[0]
    b.name = transliterate(row[1]).titleize
    b.address = row[2].titleize unless row[2].nil?
    b.city = row[3]
    b.state = row[4]
    b.zip_code = row[5]
    b.latitude = row[6]
    b.longitude = row[7]
    b.phone = row[8]

    b.save
  end

end
