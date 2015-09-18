class AddCorrectedOnToViolations < ActiveRecord::Migration
  def change
    add_column :violations, :corrected_on, :date
  end
end
