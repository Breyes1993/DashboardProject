import os
import pandas as pd
import numpy as np
import pymongo
import requests

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database Setup

conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
client.list_database_names()
db = client["CDC_Data"]

# Get CDC death rate data and upsert to db
url = "https://data.cdc.gov/resource/6rkc-nb2q.json"
response = requests.get(url)
data = response.json()

data_json = {"death_rates":data}

db.Death_rates.replace_one({}, data_json, True)


@app.route('/')
def index():  

    return render_template('index.html')


@app.route('/getData')
def getData():

    # Create db connection and retrieve CDC data dictionary
    db = client["CDC_Data"]
    cdc_dict = db.Death_rates.find_one()
    
    return jsonify(cdc_dict["death_rates"])

@app.route('/get10YearData')
def get10YearData():

    # Create db connection and retrieve CDC data dictionary
    db = client["CDC_Data"]
    cdc_dict = db.Avg_Death_Rates.find_one()
    
    return jsonify(cdc_dict["death_rates"])

if __name__ == '__main__':
    app.run()
