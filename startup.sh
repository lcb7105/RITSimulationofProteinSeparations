#!/bin/bash

echo Installing requirements...
pip install -r requirements.txt

echo Starting server.py... 
python ./server.py &

echo starting frontend... 
uvicorn server:app --reload &
cd frontend/jbio-web-app
npm start &

echo starting 2D backend...
cd ../../backend/Electro2D
python ./2D.py