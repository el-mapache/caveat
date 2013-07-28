class AddCountersToBusinesses < ActiveRecord::Migration
  def change
    add_column :businesses, :violations_count, :integer
    add_column :businesses, :inspections_count, :integer
  end
end
