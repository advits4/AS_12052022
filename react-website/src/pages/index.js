import React from 'react';

const HomePage = () => {

	return (
		<div className="container pt-3">
			<h1>Welcome to the card module</h1>

			<p>In this module you shall be able to do the following:</p>
			<ul>
				<li>Add a card</li>
				<li>Upload list of cards using csv upload</li>
				<li>View all the added cards</li>
			</ul>
			<p>
                                <br/>
                        </p>
			<h3>Add a card</h3>
			<hr></hr>
			<p>You shall be able to add a card using the Add module.</p>
			<p>While adding a card please note that you need to input card number in following format:</p>
			<p><i>e.g.:1111-1111-1111-1111 or 1111-1111-1111-111</i></p>
			<p>Add rest of the details like Bank name and expiry details. On successful addition you shall be presented with a success alert.</p>
			<div className='text-center' >
				<img src='/screenshots/add-record-added.png' width="80%"></img>
			</div>
                        <p>    
                                <br/>     
                        </p>
			<h3>Upload cards</h3>
			<hr></hr>
			<p>In this section you shall be able to upload a csv file, a sample csv can be found <a href="/cards.csv">here</a></p>
			<p>Please note that the csv format should be as below, failing to do so you shall get an error message and the upload will fail.</p>
			<div className='text-center' >
				<img src='/screenshots/csv-sample.png' width="80%"></img>
			</div>
                        <p>    
                                <br/>     
                        </p>
			<h3>List cards</h3>
			<hr></hr>
			<p>This is where you can access all the cards that you have added either manually or using the upload functionality.</p>
			<p>All the cards added will be listed in this section.</p>
			<div className='text-center' >
				<img src='/screenshots/list.png' width="80%"></img>
			</div>
			<p></p>
			<h5>Miscellaneous</h5>
			<p>The information is maintained for a period of 30 mins.</p>
			<p>
				<br/>
				<br/>
				<br/>
			</p>
		</div>
	);
};

export default HomePage;


