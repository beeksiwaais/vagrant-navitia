# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 8082, host: 8082
  config.vm.network "forwarded_port", guest: 8081, host: 8081

  config.vm.provider "virtualbox" do |vb|
     vb.memory = "4096"
  end

  config.vm.provision :docker
  config.vm.provision :shell, inline: "mkdir -m 777 -p /home/vagrant/data/default && mkdir -m 777 -p /tmp/log/jormungandr && mkdir -m 777 -p /tmp/log/kraken && mkdir -m 777 -p /tmp/log/tyr"
  config.vm.provision :shell, inline: "rm -Rf /home/vagrant/data/default/backup"
  config.vm.provision :docker_compose, yml: "/vagrant/config/docker-compose.yml", rebuild: true, run: "always"
  config.vm.provision :shell, inline: "cp -R /vagrant/config/data/* /home/vagrant/data/default"

end
