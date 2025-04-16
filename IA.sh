#!/data/data/com.termux/files/usr/bin/bash

clear

# Función para imprimir texto ASCII con estilo
function print_ascii() {
    echo -e "\e[1;36m"
    figlet -f slant "$1"
    echo -e "\e[0m"
}

# Emojis de Hanako-kun
EMOJI="️🐕🐶"

print_ascii "Perrita No Yusha"
echo "Ajusta la Escala de La Pantalla"
echo "Hecho por SoyMaycol & Wirk"
sleep 2

# Actualización
print_ascii "Actualizando"
apt update && apt upgrade
# Instalación de herramientas esenciales
print_ascii "Instalando Dependencias"
pkg install -y git
pkg install -y nodejs
pkg install -y ffmpeg
pkg install -y imagemagick
pkg install -y yarn

# Clonando repositorio
print_ascii "Clonando Repositorio"
git clone https://github.com/Ado926/Perrita-No-Yusha.git

cd Perrita-No-Yusha

# Instalando módulos del proyecto
yarn install
npm install
npm update

# Mensaje final
clear
print_ascii "Instalacion Completa"
echo -e "\e[1;35mGracias por elegirme <3 \e[0m"
echo -e "\e[1;32mIniciando Perrita No Yusha...\e[0m"
sleep 2

# Iniciando el bot
npm start
