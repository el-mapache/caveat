require 'csv'

desc "Import SF business data"
task import_business: :environment do
  CSV.read([Rails.root, "app", "assets", "data", "businesses.csv"].join("/"))[1..-1].each do |row|
    next if row[6].nil?

    b = Business.new

    b.id = row[0]
    b.name = row[1].titleize
    b.address = row[2].titleize
    b.city = row[3]
    b.state = row[4]
    b.zip_code = row[5]
    b.latitude = row[6]
    b.longitude = row[7]
    b.phone = row[8]

    b.save!
  end

end
