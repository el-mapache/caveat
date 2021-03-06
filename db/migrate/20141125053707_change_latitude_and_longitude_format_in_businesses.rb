class ChangeLatitudeAndLongitudeFormatInBusinesses < ActiveRecord::Migration
  def up
    connection.execute(%q{
      alter table businesses
      alter column latitude type decimal(10,6) using cast(latitude as decimal),
      alter column longitude type decimal(10,6) using cast(longitude as decimal)
    })
  end

  def down
    connection.execute(%q{
      alter table businesses
      alter column latitude type varchar using cast(latitude as varchar)
      alter column longitude type varchar using cast(longitude as varchar)
    })
  end
end
