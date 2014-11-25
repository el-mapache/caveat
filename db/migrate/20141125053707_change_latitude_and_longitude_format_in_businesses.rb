class ChangeLatitudeAndLongitudeFormatInBusinesses < ActiveRecord::Migration
  def up
    change_column :businesses, :latitude, :decimal, {precision: 10, scale: 6}
    change_column :businesses, :longitude, :decimal, {precision: 10, scale: 6}
  end

  def down
    change_column :businesses, :longitude, :string
    change_column :businesses, :latitude, :string
  end
end
