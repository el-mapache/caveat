# In config/initializers/haml_assets.rb
Rails.application.assets.register_engine '.haml', Tilt::HamlTemplate
