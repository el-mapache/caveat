class CreateBusinesses < ActiveRecord::Migration
  def change
    create_table :businesses do |t|
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip_code
      t.string :latitude
      t.string :longitude
      t.string :phone

      t.timestamps
    end
  end
end
