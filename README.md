# Cards Module

This is a small project created in python and react. It is a simple project where the user can add card details manually or can upload a csv with the card details. The added list of card is displayed to the user accordingly.

## Starting the application

To start the backend server use following command in the root folder containing main.py

```bash
uvicorn main:app --reload  
```

To start the frontend switch to the react-website folder and use the following command
```bash
npm start
```

The backend server host is coded as "http://127.0.0.1:8000/" in the react code (Change if necessary). Make sure the application has proper write/create access to create the "storage" folder.

## Project walkthrough
In this module you shall be able to do the following:
* Add a card
* Upload list of cards using csv upload
* View all the added cards

### Add a card
You shall be able to add a card using the Add module. While adding a card please note that you need to input card number in following format: e.g.:1111-1111-1111-1111 or 1111-1111-1111-111

![Alt text](/react-website/public/screenshots/add-record-added.png?raw=true "")

Add rest of the details like Bank name and expiry details. On successful addition you shall be presented with a success alert.

### Upload cards
In this section you shall be able to upload a csv file, a sample csv can be found [here](https://github.com/advits4/sociotech/blob/main/react-website/public/cards.csv). Please note that the csv format should be as below, failing to do so you shall get an error message and the upload will fail.
![Alt text](/react-website/public/screenshots/csv-sample.png?raw=true "")

### List cards
This is where you can access all the cards that you have added either manually or using the upload functionality. All the cards added will be listed in this section.
![Alt text](/react-website/public/screenshots/list.png?raw=true "")

### Miscellaneous
The information is added by the user maintained for a max period of 30 mins.
Additional screenshots can be found at "/react-website/public/screenshots/"

## License
[MIT](https://choosealicense.com/licenses/mit/)
