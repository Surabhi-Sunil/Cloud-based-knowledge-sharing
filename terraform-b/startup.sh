#!/bin/bash
sudo apt update -y
sudo apt install python3-pip -y
pip3 install flask flask-cors boto3 python-dotenv

# Create app directory and download your code
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# You can use Git, or manually upload via scp later
# git clone https://github.com/your-repo-url.git .

# For now, create a simple Flask placeholder
echo "from flask import Flask; app = Flask(__name__); @app.route('/')\ndef hello(): return 'Backend Running'; app.run(host='0.0.0.0', port=5001)" > app.py

python3 app.py &
