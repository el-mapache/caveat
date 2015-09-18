class AddPendingToViolations < ActiveRecord::Migration
  def change
    add_column :violations, :pending, :boolean, default: true
  end
end
