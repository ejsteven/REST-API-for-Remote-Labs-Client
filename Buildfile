# ===========================================================================
# Project:   App
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => [:sproutcore,'flot','table']
proxy '/rest', :to => '127.0.0.1:8000'
proxy '/axis-cgi', :to => 'foyercam.itee.uq.edu.au'
proxy '/projects', :to => 'www.huddletogether.com'

