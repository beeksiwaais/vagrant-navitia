# Navitia with Vagrant

## Installation

You will need to install the Docker compose provisioning plugin.
`vagrant plugin install vagrant-docker-compose`

Add your GTFS zipped file and a OSM pbf file into config/data folder.
Then run `vagrant up`and wait for the provisioning to finish.

If a `backup` folder and a `data.file.lZ4` file have been generated into
`/tmp/data/default` Navitia is ready.

Go to http://localhost:8082/explorer to check your data.

The API is here http://localhost:8081/navitia/v1/.

If you don't have data to test Navitia, you can find a GTFS file here : http://opendata.stif.info/explore/dataset/offre-horaires-tc-gtfs-idf/table/
and OSM data here : http://download.geofabrik.de/europe/france/ile-de-france.html

Enjoy !
