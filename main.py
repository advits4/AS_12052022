# main.py

from fastapi import FastAPI, Query, status, File, UploadFile
import json
from datetime import datetime
from pathlib import Path
import re
from operator import itemgetter
from typing import Optional
from pydantic import BaseModel
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import csv
import sys
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import null
import os 
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # for this exercise we will allow all origins, in real world it depends on the business requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Card(BaseModel):
    bank_name: str = Query(str, regex="(.|\s)*\S(.|\s)*") # adding a empty string check
    card_number: str = Query(str, regex="^[\d]{4}[-][\d]{4}[-][\d]{4}[-][\d]{3}[\d]?") # only XXXX-XXXX-XXXX-XXXX format numbers allowed
    expiry_date: str = Query(str, regex="^[a-z]{3}[-][\d]{4}") # only mmm-YYYY format allowed
    uuid: str

file_name = 'store.txt'

@app.get("/get")
async def doGet(uuid: str):
    try:
        clearFiles()
        fileName = getFileName(uuid)
        listOfDict = readDataFromFile(fileName)    
        result = 1  
        message = "fetched list of records."
        data = listOfDict
    except Exception as e: 
        result = 0
        message = str(e)
        data = ''
    return getResultJson(result, message, data)
    
@app.post("/file")
async def create_upload_file(file: UploadFile, uuid: str):
    try:
        fileName = getFileName(uuid)
        listOfDict = readDataFromFile(fileName)  
        if file.content_type != "text/csv":
            return getResultJson(0, 'Invalid file, please upload a csv.', '')
        csvData = file.file.read()
        reader = csv.reader(csvData.decode('utf-8').split('\n'), quoting = csv.QUOTE_ALL, skipinitialspace = True)
        result = 1 
        data = {}
        message = "Added row(s) to the list."
        for row in reader:
            validation = validateRow(row[0], row[1], row[2].lower())
            if not validation[0]:
                result = 0 
                message = "Incorrect data in csv file."
                break
            dictItems = processCardDetails(row[0], row[1], row[2].lower())
            listOfDict.append(dictItems)
        sortedDict = sortDict(listOfDict)
        writeDataToFile(fileName, sortedDict)     
    except Exception as e: 
        result = 0
        message = str(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        data = {exc_type, exc_obj, exc_tb}
    return getResultJson(result, message, data)

@app.post("/store")
async def doStore(card: Card):
    try:
        validation = validateRow(card.bank_name, card.card_number, card.expiry_date)
        if not validation[0]:
            result = 0  
            message = validation[1]
            data = validation
            return getResultJson(result, message, data)
        
        fileName = getFileName(card.uuid)
        listOfDict = readDataFromFile(fileName)    
        
        dictItems = processCardDetails(card.bank_name, card.card_number, card.expiry_date)
        listOfDict.append(dictItems)
        sortedDict = sortDict(listOfDict)
        writeDataToFile(fileName, sortedDict) 

        result = 1  
        message = "Record added."
        data = listOfDict
    except Exception as e: 
        result = 0
        message = str(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        data = {exc_type, exc_obj, exc_tb}
    return getResultJson(result, message, data)

@app.get("/clear")
# this is an api I built to clear the temp files. As we store the cards in a temp file under the storage folder
async def clear():
    data = clearFiles()
    return getResultJson(1, 'message', data)

#adding a custom handler to standarise the exception json output
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    #for the sake of simplicity of this task, just showing the first error with exc.errors()[0]['msg']
    return getResultJson(0, exc.errors()[0]['msg'])


# this function is added to do some basic validations on the input fields before storing
def validateRow(bank, card, expiry):
    bankPat = "(.|\s)*\S(.|\s)*"
    if not re.fullmatch(bankPat, bank):
        return [False, 'Bank name is invalid']

    cardPat = "^[\d]{4}[-][\d]{4}[-][\d]{4}[-][\d]{3}[\d]?"
    if not re.fullmatch(cardPat, card):
        return [False, 'Card number is invalid']

    expiryPat = "^[a-z]{3}[-][\d]{4}"
    if not re.fullmatch(expiryPat, expiry):
        return [False, 'Expiry date is invalid']
    return [True, '']

# since we create temp session files to store user data 
# we will periodically delete those files using this function
def clearFiles():
    path = os.path.abspath('storage')
    if not os.path.isdir(path):
        return
        
    list_of_files = os.listdir(os.path.abspath(path))
    data = list_of_files
    for filename in list_of_files:
        filePath = path + os.path.sep + filename
        modified_time=os.path.getmtime(filePath)
        if time.time() - modified_time > 1800: #time in seconds for 30 mins. Usually this value would go in an env file
            os.remove(filePath)
    return data            

def getFileName(uuid):
    return 'storage/' + uuid if uuid else file_name

def processCardDetails(bank_name, card_number, expiry_date):
    bank = bank_name
    cardNo = card_number
    masked = re.sub("[0-9](?<=.{5})", 'x', cardNo)
    expiry = expiry_date
    
    datetime_object = datetime.strptime(expiry, '%b-%Y')
    
    dictItems = {}
    dictItems['expiry_stamp'] = datetime_object.strftime("%Y-%m-%d")
    dictItems['bank_name'] = bank
    dictItems['card_number'] = cardNo
    dictItems['mask_card_number'] = masked
    dictItems['expiry'] = expiry
    
    return dictItems

# this function is responsible for sorting the card details as per the expiry in descending order
def sortDict(dictList, reverse = True):
    sortedList = []
    for value in sorted(dictList, key=itemgetter('expiry_stamp'), reverse = reverse) :
        sortedList.append(value)
    return sortedList    

# read a list of dictionary from the file storage, as we store data in an temp file
def readDataFromFile(fileName):
    if not os.path.exists('storage'):
        os.makedirs('storage')
    fileName = Path(fileName)
    listOfDict = []
    if fileName.exists():
        with open(fileName) as f:
            data = f.read()
            listOfDict = json.loads(data)
    return listOfDict

# write a list of dictionary to the file storage
def writeDataToFile(fileName, dictList):
    if not os.path.exists('storage'):
        os.makedirs('storage')
    with open(fileName, 'w') as convert_file:
        convert_file.write(json.dumps(dictList))   

# this function is to easily manage changes/updates in the structure of output by centralising it
def getResultJson(result, message, data=''):
    return JSONResponse(
        content=jsonable_encoder({"result": result, "message": message, "data": data}),
    )

