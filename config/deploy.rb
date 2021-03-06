set :application, "ratings"
set :repository,  "git@github.com:el-mapache/caveat.git"

set :scm, :git
set :branch, "master"

set :deploy_to, "/home/primer/webapps/ratings"

set :user, "primer"
set :scm_username, "el-mapache"
set :use_sudo, false
default_run_options[:pty] = true

role :web, "primer.webfaction.com"                          # Your HTTP server, Apache/etc
role :app, "primer.webfaction.com"                          # This may be the same as your `Web` server
role :db,  "primer.webfaction.com", :primary => true # This is where Rails migrations will run

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

namespace :deploy do
  desc "Restart nginx"
  task :restart do
    run "#{deploy_to}/bin/restart"
  end
end

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
