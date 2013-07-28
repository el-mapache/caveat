require 'csv'

desc "Import SF business data"
task import_inspections: :environment do
  CSV.read([Rails.root, "app", "assets", "data", "inspections.csv"].join("/"))[1..-1].each do |row|

    b = Business.where(id: row[0])

    next if b.empty?
    
    b.first.inspections.create(score: row[1], date: row[2], visit_type: row[3] ).save!
  end
end
