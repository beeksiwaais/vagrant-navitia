# Navitia with Vagrant

## Requirements

You will need to install VirtualBox, Vagrant and the Docker compose provisioning plugin.

`vagrant plugin install vagrant-docker-compose`

## Installation

Add your GTFS zipped file and a OSM pbf file into config/data folder.
Then run `vagrant up`and wait for your VM to be provisioned.

If a `backup` folder and a `data.nav.lz4` file have been generated into
`/tmp/data/default` Navitia is ready. Otherwise check the troubleshooting section below.

To check that everything is Ok, you can visit [the navitia explorer](http://localhost:8080/explorer).

The API is here http://localhost:8080/navitia/v1/.

If you don't have data to test Navitia, you can find a GTFS file [here](http://opendata.stif.info/explore/dataset/offre-horaires-tc-gtfs-idf/table/) and OSM pbf [here](http://download.geofabrik.de/europe/france/ile-de-france.html) for Paris region.

Enjoy !


## Troubleshooting

A `data.nav.lz4` file have been generated but nor the API nor the explorer are working.
- Restarting docker-compose in the VM should fix the problem.
