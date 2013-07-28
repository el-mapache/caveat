class AddIndexToInspections < ActiveRecord::Migration
  def change
    add_index :inspections, :business_id
  end
end
