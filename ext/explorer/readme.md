Navitia Explorer
================

Introduction
------------
This site is a simple tool to visualize and manipulate easily the data and APIs of navitia.
It could be used as an example of an integration of the APIs or as a debugging data tool.

Organisation
------------
Except for the JavaScript, CSS and images in the subfolder `/assets`, the root folder contains:
* HTML pages, one page for each screen of the site
* `params.default.json` : configuration template file (copy and edit to a `params.json` file to be effective)

How to quick use
----------------
There is no (more) need of a web server to quick use :
* Clone the project where you want to work (`git clone`)
* In the root of you project, create and edit `params.json` (`cp params.default.json params.json`)
* Open any HTML file in your browser by a double-clic
* Enjoy!

How to install properly on Ubuntu
------------------------
If you want to serve your navitia explorer, from a scratch installation of Ubuntu you can :
* Use a python HTTP server (`python -m SimpleHTTPServer`)
* Enjoy! (`firefox http://localhost:8000/`)

If you are rather an Apache boy/girl, you can :
* Install `apache2` (`sudo apt-get install apache2`)
* Create a symbolic link of the project in `/var/www/html/` (`ln -sf /complete/path/to/navitia-explorer /var/www/html/navitia-explorer`)
* One might have to restart apache (`sudo service apache2 restart`)
* Enjoy! (`firefox http://localhost/navitia-explorer/journey.html`)

How to contribute
-----------------
Fork the github repo, create a new branch, and submit your pull request!
