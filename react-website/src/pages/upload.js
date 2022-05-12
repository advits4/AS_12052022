import React, { useReducer, useState }   from 'react';
import cookie from 'react-cookies'

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.files[0]
    }
}
const UploadCsv = () => {
    
    const host = 'http://127.0.0.1:8000/';
	const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");
	 
    const handleSubmit = event => {
		event.preventDefault();
        setSubmitting(true);
        setAlert(false);
        setError(false);
		const uploadData = new FormData(); 
		uploadData.append( 
			"file", 
			formData.file, 
			formData.file.name 
		);
		// uploadData['uuid'] = cookie.load('userId');
		var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            var resp = JSON.parse(xhr.responseText)
            if (resp['result'] == 0) {
                setError(true);
            } else {
                setAlert(true);
            }
			setMsg(resp['message'])
            setSubmitting(false);
        })
        xhr.open('POST', host + 'file?uuid=' + cookie.load('userId'))
        xhr.send(uploadData)
	}
	return (
		<div className="container pt-3">
			<h1>Upload an csv here</h1>
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
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<div className="form-group mb-3">
                    <label>Select a csv :</label>
                    <input  type="file" name="file" className="form-control" onChange={setFormData} />  
                </div>
				<div className="form-group mb-3">
					<button type="submit" className="btn btn-primary">Submit</button>
					<button type="reset" className="btn btn-primary mx-3">Reset</button>
                </div>
				{submitting &&
					<div>Uploading file...</div>
				}
			</form>
		</div>
	);
};

export default UploadCsv;