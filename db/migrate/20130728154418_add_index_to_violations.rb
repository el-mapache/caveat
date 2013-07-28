class AddIndexToViolations < ActiveRecord::Migration
  def change
    add_index :violations, :business_id
  end
end
