async function applyJob(event) {
    event.preventDefault();

    // Retrieve input values
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let portfolio = document.getElementById('portfolio').value;
    let imageInput = document.getElementById('image');
    let coverLetter =document.getElementById('coverLetter').value;
    let jobTitle =document.getElementById('jobTitle').value

    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            let base64ImageString = reader.result; // Base64 string of the image

            let data = {
                name,
                email,
                portfolio,
                coverLetter,
                jobTitle,
                imageInput: base64ImageString  // Changed key to 'image' for clarity
            };
            
            let strData = JSON.stringify(data);
            // console.log("Form data: ", strData);

            try {
                let response = await fetch('/user', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: strData,
                });

                // console.log("Response", response);

                if (response.status === 200) {
                    alert('Application successfully submitted!');
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (error) {
                // console.log("Error:", error);
                alert('Error occurred while submitting the form.');
            }
        };

        reader.readAsDataURL(file); // Start reading the image file as base64
    } else {
        alert('Please select an image.');
    }
}

function jobApplication(){
    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');

    window.location = `applicationVeiw.html?login=${token_key}`
}

async function ApplicationView() {
    
    let params = new URLSearchParams(window.location.search);
    // console.log('params',params);

    let token_key = params.get('login');
    // console.log("token_key",token_key);

    let token = localStorage.getItem(token_key)

    try {
            
        const response = await fetch('/user', {
            method: 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const parsed_data = await response.json();
        // console.log(parsed_data)

        let data = parsed_data.data
        // console.log("data",data);

        const tableBody = document.getElementById('applicationView');
        let row='';
        for(let i=0; i<data.length ; i++){
          

        
            row += `
                <div class="row g-4">
                    <div class="col-sm-12 col-md-12 d-flex align-items-center justify-content-between">
                       


                        <div class="text-start ps-4 d-flex align-items-center ">
                            <div>
                            <img class="flex-shrink-0 img-fluid border rounded" src="${data[i].imageInput}" alt="${data[i].jobTitle} image" style="width: 80px; height: 80px;";>
                            </div>
                            <div class="">
                                <div class="px-5"><h5 class="mb-3">${data[i].name}</h5></div>
                                <div class="text-truncate me-3 px-5"><i class=" text-primary me-2"></i>${data[i].email}</div>
                                <div class="text-truncate me-3 px-5"><i class=" text-primary me-2"></i>${data[i].portfolio}</div>
                                <div class="text-truncate me-0 px-5"><i class="text-primary me-2"></i>${data[i].coverLetter}</div>
                                <div class="text-truncate me-0 px-5"><i class="text-primary me-2"></i>${data[i].jobTitle}</div>


                            </div>
                        </div>
                        <div class="delete" onClick="deleteApplication('${data[i]._id}')" ><img src ="https://img.icons8.com/?size=100&id=67884&format=png&color=FA5252" style="width : 30px; height:30px;"></div>


                    </div>
                   
                </div>
            `;

            // tableBody.appendChild(row);
            tableBody.innerHTML =row;

        }

    } catch (error) {

        console.error('Fetch error:', error);

    }

}

function addJob(){
    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');

    window.location = `add_job.html?login=${token_key}`
}

async function addjob(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    // console.log('params',params);

    let token_key = params.get('login');
    // console.log("token_key",token_key);

    let token = localStorage.getItem(token_key);


    // Collect form values
    let jobTitle = document.getElementById('jobtitle').value;
    let jobLocation = document.getElementById('joblocation').value;
    let jobTime = document.getElementById('jobtime').value;
    let salary = document.getElementById('salary').value;
    let DateLine = document.getElementById('dateline').value;
    let Job_description = document.getElementById('job_Discription').value;
    let Responsibility = document.getElementById('responsibility').value;
    let Qualifications = document.getElementById('qualifications').value;
    let imageInput = document.getElementById('image');

    if (!jobTitle || !jobLocation || !jobTime || !salary || !DateLine || !Job_description || !Responsibility || !Qualifications) {
        alert("Please fill out all fields.");
        return;
    }

    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            let base64ImageString = reader.result; // Base64 string of the image

            let data = {
                jobTitle,
                jobLocation,
                jobTime,
                salary,
                imageInput: base64ImageString,
                DateLine,
                Job_description,
                Responsibility,
                Qualifications,
            };

            let strData = JSON.stringify(data);
            // console.log("Form data: ", strData);  // Log the form data

            try {
                // Make sure you're sending the request to the correct backend server
                let response = await fetch('/jobList', {  // Use your backend URL
                    method: 'POST',
                    headers: {
                         "Content-Type" : "Application/json",
                        'Authorization' : `Bearer ${token}`
                    },
                    body: strData,
                });

                // Check if response is OK
                if (!response.ok) {
                    // console.error("Fetch failed with status:", response.status);
                    let errorText = await response.text();
                    // console.error("Error response text:", errorText);  // Log the error response text
                    alert('Error submitting the form: ' + errorText);
                    return;
                }

                let responseData = await response.json();  // Attempt to parse JSON response
                // console.log("Response data:", responseData);  // Log parsed response data

                if (response.status === 200) {
                    alert('Job successfully added!');
                    window.location='add_job.html'  // Reset the form
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (error) {
                // console.error("Network or server error:", error);  // Log network errors
                
            }
        };

        reader.readAsDataURL(file);  // Start reading the image file as base64
    } else {
        alert('Please select an image.');
    }
}

async function View(){
    // event.preventDefault()

    try {
            
        const response = await fetch('/joblist', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const parsed_data = await response.json();
    

        let data = parsed_data.data
        

        const tableBody = document.getElementById('joblist');
        let row='';
        for(let i=0; i<data.length ; i++){

        
            row += `
                <div class="row g-4">
                    <div class="col-sm-12 col-md-8 d-flex align-items-center">
                        <img class="flex-shrink-0 img-fluid border rounded" 
                            src="${data[i].imageInput}" 
                            alt="${data[i].jobTitle} image" 
                            style="width: 80px; height: 80px;" 
                            ;">


                        <div class="text-start ps-4">
                            <h5 class="mb-3">${data[i].jobTitle}</h5>
                            <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${data[i].jobLocation}</span>
                            <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${data[i].jobTime}</span>
                            <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${data[i].salary}</span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                        <div class="d-flex mb-3">
                            <a class="btn btn-light btn-square me-3" href=""><i class="far fa-heart text-primary"></i></a>
                            <span class="btn btn-primary" onclick="applyNow('${data[i]._id}')">Apply Now</span>
                        </div>
                        <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Date Line:${data[i].DateLine}</small>
                    </div>
                </div>
            `;

            // tableBody.appendChild(row);
            tableBody.innerHTML =row;

        }

    } catch (error) {

        console.error('Fetch error:', error);

    }
    
}

function applyNow(id) {
    window.location = `job-detail.html?id=${id}`;
}

async function showDetails() {
    // console.log("Fetching job details...");

    // Get the job ID from URL parameters
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    // console.log("Job ID:", id);  // Debugging: Check if the ID is correct

    try {
        // Fetch job details using the job ID
        const response = await fetch(`/joblist/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const parsed_data = await response.json();
        // console.log(parsed_data);  // Debugging: Log the fetched data

        let data = parsed_data.data;

        // Check if data exists
        if (!data) {
            throw new Error('No job data found');
        }

        const DetailsView = document.getElementById('Details');
        let rows = '';

        // Generate job details dynamically
        rows += `
            <div class="container">
                <div class="row gy-5 gx-4">
                    <div class="col-lg-8">
                        <div class="d-flex align-items-center mb-5">
                            <img class="flex-shrink-0 img-fluid border rounded" src="${data.imageInput}" alt="Job Image" style="width: 80px; height: 80px;">
                            <div class="text-start ps-4">
                                <h3 class="mb-3">${data.jobTitle}</h3>
                                <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${data.jobLocation}</span>
                                <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${data.jobTime}</span>
                                <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${data.salary}</span>
                            </div>
                        </div>
                        <div class="mb-5">
                            <h4 class="mb-3">Job Description</h4>
                            <p>${data.Job_description}</p>
                            <h4 class="mb-3">Responsibility</h4>
                            <p>${data.Responsibility}</p>
                            <h4 class="mb-3">Qualifications</h4>
                            <p>${data.Qualifications}</p>
                        </div>
                        <div>
                            <h4 class="mb-4">Apply For The Job</h4>
                            <form onsubmit="applyJob(event)">
                                <div class="row g-3">
                                    <div class="col-12 col-sm-6">
                                        <input type="text" class="form-control" id="name" placeholder="Your Name" required>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <input type="email" class="form-control" id="email" placeholder="Your Email" required>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <input type="text" class="form-control" id="portfolio" placeholder="Portfolio (optional)" >
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <input type="file" id="image" class="form-control bg-white" accept="image/*" required>
                                    </div>
                                    <div class="col-12 col-sm-6">
                                        <input type="text" class="form-controltitle" id="jobTitle" placeholder="Job-Title" >
                                    </div>
                                    
                                    <div class="col-12">
                                        <textarea class="form-control" rows="5" id="coverLetter" placeholder="coverLetter" required></textarea>
                                    </div>
                                    <div class="col-12">
                                        <button class="btn btn-primary w-100" type="submit">Apply Now</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="bg-light rounded p-5 mb-4">
                            <h4 class="mb-4">Job Summary</h4>
                            <p><i class="fa fa-angle-right text-primary me-2"></i>Published On: ${data.DateLine}</p>
                            <p><i class="fa fa-angle-right text-primary me-2"></i>Job Nature: ${data.jobTime}</p>
                            <p><i class="fa fa-angle-right text-primary me-2"></i>Salary: ${data.salary}</p>
                            <p><i class="fa fa-angle-right text-primary me-2"></i>Location: ${data.jobLocation}</p>
                            <p class="m-0"><i class="fa fa-angle-right text-primary me-2"></i>Deadline: ${data.DateLine}</p>
                        </div>
                        <div class="bg-light rounded p-5">
                            <h4 class="mb-4">Company Detail</h4>
                            <p class="m-0">${data.CompanyDetail || 'No company details available.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display the details
        DetailsView.innerHTML = rows;

    } catch (error) {
        console.error('Fetch error:', error);
        // Optionally, display a user-friendly message on the UI
        document.getElementById('Details').innerHTML = `<p>Error loading job details. Please try again later.</p>`;
    }
}

async function access() {

    // console.log("reached....")

    window.location.href = 'login.html'
    
}

async function loginControll(event){
    event.preventDefault();
    // console.log("reached.....")

    let email = document.getElementById('email').value

    let password = document.getElementById('password').value




    let data ={
        email,
        password
    }

   let strdata = JSON.stringify(data);

   
   try {
    let response = await fetch('/login',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : strdata
    });


    let parsed_Response = await response.json();


    let token_data = parsed_Response.data


    let user_type = token_data.usertypes.usertype;

    let token = token_data.token;

    let id =token_data.id;


    let token_key = id;
    
    
    localStorage.setItem(token_key, token);




    if(user_type ==='admin'){
        
        window.location =`Admin.html?login=${token_key}`
    }
  



   } catch (error) {
    console.log("error",error);
   }
 
}

async function deleteApplication(id) {
    
    // console.log("id reached......",id)

    let params = new URLSearchParams(window.location.search);
    // let id = params.get('id');
    let token_key = params.get('login');
    // console.log("token_key",token_key);

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/purgeUser/${id}`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        // console.log("response :",response)

        if(response.status===200){
            alert("Employee successfully deleted ");
            window.location=`applicationVeiw.html?login=${token_key}`

        }else{
            alert("Something went wrong ");
        }
    } catch (error) {
        console.log("error",error);
    }

}

function NewJobs(){
    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');

    window.location = `admin_joblist.html?login=${token_key}`
}

async function AdminView(){
    try {
            
        const response = await fetch('/joblist', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const parsed_data = await response.json();
    

        let data = parsed_data.data
        

        const tableBody = document.getElementById('joblist');
        let row='';
        for(let i=0; i<data.length ; i++){

        
            row += `
                <div class="row g-4">
                    <div class="col-sm-12 col-md-8 d-flex align-items-center">
                        <img class="flex-shrink-0 img-fluid border rounded" 
                            src="${data[i].imageInput}" 
                            alt="${data[i].jobTitle} image" 
                            style="width: 80px; height: 80px;" 
                            ;">


                        <div class="text-start ps-4">
                            <h5 class="mb-3">${data[i].jobTitle}</h5>
                            <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${data[i].jobLocation}</span>
                            <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${data[i].jobTime}</span>
                            <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${data[i].salary}</span>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                        <div class="d-flex mb-3">
                            
                            <span class="" onclick="jobDelete('${data[i]._id}')"><img src ="https://img.icons8.com/?size=100&id=67884&format=png&color=FA5252" style="width : 30px; height:30px;"></span>
                        </div>
                        
                    </div>
                </div>
            `;

            // tableBody.appendChild(row);
            tableBody.innerHTML =row;

        }

    } catch (error) {

        console.error('Fetch error:', error);

    }
    

    
}
async function jobDelete(id){
    // console.log("id reached......",id)

    let params = new URLSearchParams(window.location.search);
    // let id = params.get('id');
    let token_key = params.get('login');
    // console.log("token_key",token_key);

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/purgejoblist/${id}`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        // console.log("response :",response)

        if(response.status===200){
            alert("JOB list successfully deleted ");
            window.location=`admin_joblist.html?login=${token_key}`

        }else{
            alert("Something went wrong ");
        }
    } catch (error) {
        // console.log("error",error);
    }


}

async function logout() {
    try {
        // console.log("Reached....at log out");
        let params = new URLSearchParams(window.location.search);
        let token_key = params.get('login');
        if (!token_key) {
            // console.log("Token key not found in the URL.");
            return;
        }

        let token = localStorage.getItem(token_key);
        // console.log("token", token);

        if (token) {
            localStorage.removeItem(token_key);
            // console.log("Token removed successfully.");
            window.location.href = "index.html";  // Adjust the path if necessary
        } else {
            // console.log("No token found in localStorage.");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
}






