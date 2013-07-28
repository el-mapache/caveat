require 'csv'

desc "Import SF business data"

def parse_description(desc)
  props = {}

  pieces = desc.split('[')
  date_corrected = pieces[1].match(/\d+\/\d+\/\d{4}/)

  props[:description] = pieces[0]

  if date_corrected.nil?
    props[:pending] = true
  else
    props[:pending] = false
    props[:corrected_on] = parse_date(date_corrected.to_s)
  end 
  props
end

# Rails wants dates in yyyy/m(m)/dd format 
def parse_date(date_string)
  date_string.split("/").rotate(2).join("/")
end

task import_violations: :environment do
  CSV.read([Rails.root, "app", "assets", "data", "violations.csv"].join("/"))[1..-1].each do |row|
    b = Business.where(id: row[0])

    next if b.empty?
    
    b.first.violations.create(parse_description(row[2]).merge({date: row[1]})).save!
  end
end

