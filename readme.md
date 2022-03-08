# Personal Portfolio BackEnd
Welcome to the API documentation for my personal branding page, which allows access to a set of endpoints aimed at facilitating integration with external systems. For example, you can get the list of skills, qualifications and projects.
## Technology
* Node js
* Express js
* Moongose
## Deploy

```
npm install
```
1. Create a .env file where put a database credential and key token.
```env
NODE_ENV=
PORT=
PRIVATEKEY=
# Set your database/API connection information here
API_KEY=
DATABASE=mongodb+srv:
```
```
npm start
```
## Contenidos
* [Introduction](#Introduction)
* [Security](#Security)

## Introduction
- The API allows REST-type calls and uses JSON to send and receive information.
- Nouns are used, not verbs in the endpoints
- The name of the resource is always used in the plural and in English.
- Response in a JSON structure with attributes in camelCase.
- Management of versions in the URL.
- Pagination of the response in JSON.
## Security
To create or update Skills, qualification or project it is necessary to send a token.
```javascript
	fetch(url,{
		method: POST,
		headers:{
			Authorization: 'Bearer ' + token
		}
	})
```
## Send Request
The requests are HTTP REST so the method to be used must be specified.
	* GET, to get information about a resource. An example of a request using cURL would be:
	```curl
	curl -X GET https://yourUrl.com/apiv1/
	```
## Ejemplos
### Projects
When placing a request to get all the projects
```
GET apiv1/projects
```
##### params
		- **perPage**, limits the number of items in a JSON response, by default the value is 20
		- **page**, allows you to paginate the elements of a JSON response, by default it is 1
##### examples
```
	GET /apiv1/products?perPage=23
	GET /apiv1/products?page=2
```
##### response
```JSON
{
    "message": "Fetched projects successfully",
    "projects": [
        {
            "_id": "6226d2c1ed70bbd6cd6a72b7",
            "name": "Project",
            "description": "a bit description",
            "imageUrl": "images/image-1646711489479-396319290.jpeg",
            "status": true,
            "userId": "6226c7237058103f0025d594",
            "__v": 0
        },
        {
            "_id": "6226d2c9ed70bbd6cd6a72bc",
            "name": "Project 1",
            "description": "a bit description 1",
            "imageUrl": "images/image-1646711497832-260850961.jpeg",
            "status": true,
            "userId": "6226c7237058103f0025d594",
            "__v": 0
        }
    ],
    "totalItems": 2
}
```
### Project by Id
When making a request to obtain a project.
```
	GET apiv1/projects/:projectId
```
#### Examples
```
{
    "message": "Project Fetched!",
    "project": {
        "_id": "6226d2c1ed70bbd6cd6a72b7",
        "name": "Project",
        "description": "a bit description",
        "imageUrl": "images/image-1646711489479-396319290.jpeg",
        "status": true,
        "userId": "6226c7237058103f0025d594",
        "__v": 0
    }
}
```
### Create a project
When making a request to create a project.
```
	POST apiv1/projects
```
##### Data
```
{
    "name":"name of project",
	"description":"description of project",
	"status:"True or False",
	"image": File of image
}
```
##### Response
```JSON
{
    "message": "Project created successfully!",
    "project": {
        "name": "Project 1",
        "description": "a bit description 1",
        "imageUrl": "images/image-1646711497832-260850961.jpeg",
        "status": true,
        "userId": "6226c7237058103f0025d594",
        "_id": "6226d2c9ed70bbd6cd6a72bc",
        "__v": 0
    }
}
```
### Update a project
When making a request to update a project.
```
	PUT apiv1/projects/projectId
```
##### Data
```
{
    "name":"name of project update",
	"description":"description of project",
	"status:"True or False",
	"image": File of image
}
```
##### Response
```JSON
{
    "message": "Project Updated!",
    "project": {
        "_id": "6226d2c1ed70bbd6cd6a72b7",
        "name": "Project Updated!!!",
        "description": "a bit description",
        "imageUrl": "images/image-1646711489479-396319290.jpeg",
        "status": true,
        "userId": "6226c7237058103f0025d594",
        "__v": 0
    }
}
```
### Delete a project
When making a request to update a project.
```
	DELETE apiv1/projects/projectId
```
##### Response
```JSON
{
    "message": "Deleted post!"
}
```

The example is the same in Skill and Qualifications.