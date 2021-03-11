# Project Atweiler - Questions & Answer Service

## Project Atweiler

Backend service delivering client request for an e-commerce marketplace. Built with best RESTful practices in mind and designed to handle large spikes in client request

A team of three completed this project, with each individual responsible for a different route for the service.

## Installation

After cloning repository, the following commands will start the service running at localhost:3000

To install necessary dependencies:

````
npm install
````

To start service:
````
npm start
````

To start redis database via docker
```
docker run -p 6379:6379 -d redis
```


## Technologies
Node / Express
MongoDB
Docker
AWS EC2 
Redis

[Loader.io](https://loader.io/) used to test services ability to handle higher levels of throughput. 

## Services

### Questions & Answers (/qa/)

This service route handled client request for questions and answers of a given product. The following endpoints are available:

GET /qa/questions: Retrieves a list of questions for a particular product. This list does not include any reported questions.

GET /qa/questions/:question_id/answers: Returns answers for a given question. This list does not include any reported answers

POST /qa/questions: Adds a question for the given product.

POST /qa/questions/:question_id/answers: Adds an answer for the given question.

PUT /qa/questions/:question_id/helpful: Updates a question to show it was found helpful.

PUT /qa/questions/:question_id/report: Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

PUT /qa/answers/:answer_id/helpful: Updates an answer to show it was found helpful.

PUT /qa/answers/:answer_id/report: Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.


<img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7703442e-1f3b-4714-ab8d-dc775cf3601c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210111%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210111T023321Z&X-Amz-Expires=86400&X-Amz-Signature=f9942c6e392c094dde9e9c6857378d7d7034635e8267bce122348a808d59f70a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22" />
<br></br>
*Results from 1500 client request/second, testing product ids at from 1:100*
