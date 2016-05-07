# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provider "virtualbox" do |vb|
     vb.memory = "4096"
  end

  config.vm.provision :docker
  config.vm.provision :shell, inline: "mkdir -m 777 -p /home/vagrant/data/default"
  config.vm.provision :docker_compose, yml: "/vagrant/config/navitia.yml", rebuild: false, run: "once"
  config.vm.provision :shell, inline: "cp -R /vagrant/config/data/* /home/vagrant/data/default"

end
