#!/bin/bash

install_npm_backend() {
    echo "Installing Forver for node server..."
    npm install forever -g
    echo "Installing npm packages and build addon..."
    npm install
}

install_npm_client() {
    cd ./client
    echo "Installing npm packages for client..."
    npm install
}

# Function to install Boost on Linux
install_boost_linux() {
    echo "Installing Boost on Linux..."
    sudo apt-get update
    sudo apt-get install -y libboost-all-dev
}

# NOT TEST YET
# Function to install Boost on Mac using Homebrew
install_boost_mac() {
    echo "Installing Boost on Mac..."
    # Install Homebrew if not already installed
    if ! command -v brew &>/dev/null; then
        echo "Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    # Install Boost using Homebrew
    brew install boost
}

# Detect the operating system and call the appropriate function
OS="$(uname)"

install_npm_backend
install_npm_client

if [ "$OS" == "Linux" ]; then
    install_boost_linux
    sudo apt-get install libgmp3-dev
    
    elif [ "$OS" == "Darwin" ]; then
    install_boost_mac
    brew install gmp
else
    echo "Unsupported operating system: $OS"
fi