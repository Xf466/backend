# Backend of Employee Referral Program

## Running the backend server
> **Warning**: \
The server API that is running as a docker container is currently set to development mode. This means that any saves/changes to the files while the server is running, will automatically update the files on the Docker container, and nodemon will automatically restart the server (thereby refreshing the database).

Start database and server with Docker Compose
```shell
$ docker-compose up -d
```
Open [http://localhost:8080](http://localhost:8080) to see if it is successfully running.

## Opening/viewing the Postgres database
1. Open [http://localhost:5050](http://localhost:5050) to see if pgAdmin4 is successfully running.\
Login by entering the following details:
    ```
    email: admin@admin.com
    password: admin
    ```
2. <b>(FOR FIRST TIME ONLY) </b>
    1. Right click on 'Servers' -> 'Register' -> 'Server...'
    2. Enter the following details in the pop-up:

    ```
    Name: docker_postgres
    Host name/address: pg_container
    Port: 5432
    Maintenance database: postgres
    Username: postgres
    Password: admin
    ```
    3. Turn on 'Save Password?'
    4. Click 'Save'

3. Expand the dropdowns: 'Servers' -> 'docker_postgres' -> 'Databases' -> 'target-catcher' -> 'Schemas' -> 'Tables'

4. To view a table: Right click on a table
5. From the pop up: Go to 'Scripts' -> 'SELECT Script'
6. Click on the run button

# Testing using Postman
Download Postman from:  [https://www.postman.com/downloads/](https://www.postman.com/downloads/) \
Before proceeding, please ensure the database and server are running.

## Testing by importing Postman Collection
In this repository, there is a Postman collection file already created, such that it can be imported and ready to use.
```file
File name:
Target Catcher.postman_collection.json
```
1. Open Postman
2. In 'My Workspace', click on the 'Import' button on the top-right bar
3. Click on 'Upload Files'
4. Go to this clone project location
5. Select the file ```Target Catcher.postman_collection.json```
6. Finally click 'Open'

> **Note**: Please follow the requests in the collection by it's listed number

## Manually testing using Postman
### Sign up
```api
POST http://localhost:8080/api/auth/signup
```
```json
{
    "firstName" : "John",
    "lastName" : "Doe",
    "password" : "Password123",
    "email" : "fakeuser@targetcatcher.com",
    "linkedinid": "test"
}
```

### Sign in
```api
POST http://localhost:8080/api/auth/signin
```
```json
{
    "email" : "fakeuser@targetcatcher.com",
    "password" : "Password123"
}
```

### Get User By user ID or email
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <user_id> to a valid registered user id.\
<b>Or</b> change \<email> to a valid registered user email.
```api
GET http://localhost:8080/api/get/user/<user_id>
```
```api
GET http://localhost:8080/api/get/user/<email>
```

### Update User Profile
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

```api
PUT http://localhost:8080/api/user/update/
```
```json
{
    "firstName" : "Bob",
    "lastName" : "Updated",
    "password" : "UpdatedPassword123!",
    "email" : "test@gmail.com",
    "linkedinid": "123456789"
}
```

### Create Referral
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

```api
POST http://localhost:8080/api/referral/create
```
```json
{
    "job_title" : "Software Developer",
    "price" : 10.25,
    "job_description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium ut ex vel porttitor. Vivamus sit amet nisi sed dui maxi-mus aliquam quis gravida lacus. Donec gravidaipsum vitae risus semper ornare. Ut vestibul-um sit amet tellus vel vehicula. ",
    "company" : "Goolgle Inc.",
    "skill" : "- hantup- wan la ba bi q la",
    "salary" : "Starting from $25 an hour",
    "address" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium ut ex vel"
}
```

### Get Referral By Referral ID
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.
```api
GET http://localhost:8080/api/get/referral/<referral_id>
```

### Get All Referrals
> **Warning**: \
<b>On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.</b>
```api
GET http://localhost:8080/api/get/referrals/
```

### (Obselete) Get All Referrals by User ID
> **Warning**: \
<b>On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.</b>

> **Note**: \
Change <user_id> to a valid user id.
```api
GET http://localhost:8080/api/get/referrals/<user_id>
```

### Get All Referrals of current user
> **Warning**: \
<b>On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.</b>

```api
GET http://localhost:8080/api/get/referrals/me
```

### Update Referral
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.
```api
PUT http://localhost:8080/api/referral/update/<referral_id>
```
```json
{
    "job_title" : "title",
    "price" : 10.25,
    "job_description" : "description",
    "company" : "company",
    "skill" : "skill",
    "salary" : "Salary",
    "address" : "address"
}
```

### Delete Referral
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.
```api
DELETE http://localhost:8080/api/referral/delete/<referral_id>
```

### Search Referral by either, both, neither Job Title, Location & Company
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <job_title> to a job title \
\<location> to a location. \
\<asc> to either true or false or null. \
\<company> to an company. \
Such as "Software Engineering", "Aus", "true" and "Goolgle".

```api
GET /api/search/referral/?job_title=<job_title>&location=<location>&company=<company>&asc=<asc>
```
```api
GET /api/search/referral/?location=<location>
```
```api
GET /api/search/referral/
```

### Create Application
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.\
Change <file_name> to a valid filename.
```api
POST http://localhost:8080/api/application
```
```form-data
=>form-data
KEY                    | VALUE
-----------------------|-----------------------
cv_file                | <file_name>
referral_id            | <referral_id>
application_status     | pending
```

### Get Application
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id.
```api
GET http://localhost:8080/api/application/<application_id>
```
### Get Application CV
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id.
```api
GET http://localhost:8080/api/application/cv/<application_id>
```

### Get all of current logged in user's Applications
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

```api
GET http://localhost:8080/api/applications/me
```

### Get all Applications by referral ID
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.
```api
GET http://localhost:8080/api/applications/<referral_id>
```

### Accept/Decline Application
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id. \
AND \
Change <status> to either 'accept' or 'decline'
```api
PUT http://localhost:8080/api/application/<status>/<application_id>
```

### Cancel Application
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id.
```api
PUT http://localhost:8080/api/application/cancel/<application_id>
```

### Delete Application
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id.
```api
DELETE http://localhost:8080/api/application/<application_id>
```

### Upload Proof
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id. \
Change <file_name> to a valid filename.
```api
PUT http://localhost:8080/api/application/uploadproof
```
```form-data
=>form-data
KEY                    | VALUE
-----------------------|-----------------------
proof_file             | <file_name>
application_id         | <application_id>
```

### Get Proof File
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <application_id> to a valid application id.
```api
GET http://localhost:8080/api/application/proof/<application_id>
```

### Create Rating
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <referral_id> to a valid referral id.\
Change <application_id> to a valid application id.\
Change <rating_score> to a valid rating score.\
Change <rating_feedback> to a valid feedback.
```api
POST http://localhost:8080/api/rating/create
```
```json
{

    "referral_id": <referral_id>,
    "application_id": <application_id>,
    "rating_score": <rating_score>,
    "rating_feedback": <rating_feedback>

}
```

### Get Ratings
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

> **Note**: \
Change <user_id> to a valid user id.
```api
GET http://localhost:8080/api/ratings/<user_id>
```

### Get My Ratings
> **Warning**: \
On 'Authorization', select 'OAuth 2.0'. Paste the access token of a logged in user. Make sure 'Header Prefix' is empty.

```api
GET http://localhost:8080/api/ratings/me
```

## HTTP Response Status Codes
Below are HTTP codes used for each response:
#### 200 - Ok
#### 201 - Created
#### 400 - Bad Request
#### 401 - Unauthorized
#### 403 - Forbidden
#### 404 - Not Found
#### 500 - Internal Server Error
