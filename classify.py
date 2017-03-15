from flask import Flask
import argparse
import io
import json
import os
from flask import request
from google.cloud import language_v1beta2
from google.cloud.language_v1beta2 import enums
from google.cloud.language_v1beta2 import types
import numpy
import six
app = Flask(__name__)

@app.route('/display')
def display():
    return "Looks like it works!"

@app.route('/classify',methods = ['POST'])
def classify(verbose=True):
	data = request.get_json()
	text = data['text']
	language_client = language_v1beta2.LanguageServiceClient()
	document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)
  	response = language_client.classify_text(document)
   	categories = response.categories
   	print (categories)
   	result = {}
   	for category in categories:
   		result[category.name] = category.confidence
   	if verbose:
   		print(text)
       	for category in categories:
           	print(u'=' * 20)
           	print(u'{:<16}: {}'.format('category', category.name))
           	print(u'{:<16}: {}'.format('confidence', category.confidence))
	result = json.dumps(result) 
   	return result

if __name__=='__main__':
    app.run(host="127.0.0.1",port=5001)