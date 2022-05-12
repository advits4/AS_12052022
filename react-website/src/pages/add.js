// require('dotenv').config();
import React, { useReducer, useState }  from "react";
import cookie from 'react-cookies';
// import 'dotenv/config';

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.value
    }
}

const Add = () => {
    const host = 'http://127.0.0.1:8000/';
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");
    
    const handleSubmit = event => { 
        event.preventDefault();
        setSubmitting(true);
        setError(false);
        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            var resp = JSON.parse(xhr.responseText)
            setAlert(true);
            if (resp['result'] === 0) {
                setError(true);
                setAlert(false);
            }
            setMsg(resp['message'])
            setSubmitting(false);
        })
        xhr.open('POST', host + 'store')
        xhr.setRequestHeader("Content-Type", "application/json");
        formData['expiry_date'] = formData['month'] + '-' + formData['year'];
        formData['uuid'] = cookie.load('userId');
        xhr.send(JSON.stringify(formData))
    }
    
    return (
        <div className="container pt-3">
            <h1>
                Add card details
            </h1>
            <form onSubmit={handleSubmit}>
                {submitting &&
                    <div>Submitting Form...</div>
                }
                {alert &&
                    <div className="alert alert-success" role="alert">
                       {msg} 
                    </div>

                }
                {error &&
                    <div className="alert alert-danger" role="alert">
                        {msg}
                    </div>

                }
                <div className="form-group mb-3">
                    <label>Bank's Name:</label>
                    <input name="bank_name" required className="form-control"  placeholder="Enter Bank's name" onChange={setFormData} />  
                </div>
                <div className="form-group mb-3">
                    <label>Card Number:</label>
                    <input name="card_number"  required className="form-control" placeholder="Enter card number" onChange={setFormData} pattern="^[\d]{4}[-][\d]{4}[-][\d]{4}[-][\d]{3}[\d]?"/>  
                    <small id="emailHelp" className="form-text text-muted">Enter card no as XXXX-XXXX-XXXX-XXXX.</small>    
                </div>
                <div className="form-group mb-3">
                    <label>Expiry:</label>
                    <div className="row">
                        <div className="col">
                            <select defaultValue="" required className="form-select" aria-label="Jan" name="month" onChange={setFormData}>
                                <option value="">Select month</option>
                                <option value="jan">Jan</option>
                                <option value="feb">Feb</option>
                                <option value="mar">March</option>
                                <option value="apr">April</option>
                                <option value="may">May</option>
                                <option value="jun">June</option>
                                <option value="jul">July</option>
                                <option value="aug">August</option>
                                <option value="sep">September</option>
                                <option value="oct">October</option>
                                <option value="nov">November</option>
                                <option value="dec">December</option>
                            </select>
                        </div>
                        <div className="col">
                            <input required name="year" type="text" maxLength="4" minLength="4" className="form-control" placeholder="Enter year" pattern="^[\d]{4}"  onChange={setFormData}  />    
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="reset" className="btn btn-primary mx-3">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default Add;

