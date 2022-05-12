import React from "react";
import cookie from 'react-cookies';

class List extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			items: [],
			isLoaded: false
		};

	}
    
	// ComponentDidMount is used to
	// execute the code
	componentDidMount() {
		fetch(
            "http://127.0.0.1:8000/get?uuid=" + cookie.load('userId')
        
        )
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json['data'],
                isLoaded: true
            });
        })
	}
	render() {
		const { isLoaded, items } = this.state;
		if (!isLoaded) return <div>
			<h1> Please wait loading data.... </h1> </div> ;

		return (
		<div className = "App">
            <div class="container pt-3">
                <h1> List of cards added </h1>
                <div class="row">
                    <div class="col-sm">
                        <h4>Bank Name</h4>
                    </div>
                    <div class="col-sm">
                        <h4>Card Number</h4>
                    </div>
                    <div class="col-sm">
                        <h4>Expiry Date</h4>
                    </div>
                </div>
                
                {
                    Object.keys(items).length > 0 ? 
                    Object.keys(items).map((item) => (
                        <div class="row">
                            <div class="col-sm">
                                { items[item].bank_name }
                            </div>
                            <div class="col-sm">
                                { items[item].mask_card_number }
                            </div>
                            <div class="col-sm text-capitalize">
                                { items[item].expiry }
                            </div>
                        </div>
                    )) : (
                        <div class="row text-center mt-3">
                            <div>
                            No cards added
                            </div>
                        </div>
                    )
                }
                
            </div>
		</div>
	);
}
}

export default List;

