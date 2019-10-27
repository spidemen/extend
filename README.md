#  Description 
- Setup    
1.  git clone https://github.com/spidemen/extend.git   
2.  run command: 
```bash  
    cd extend/lambda-scaffold  
    yarn  
  ```   
- simple to get all breeds, just rum    
```bash
    yarn test:fetch    
  ``` 
- run test cases    
  ```bash   
    yarn test   
    ``` 
- detail about code  
  breed-get.js  file contain a class which handle  all the logics of requirement    
  1. fetchhandler() mostly  handle  API call and fetch stuff, get data from server , address timeout and expection   
  2. handlebreed()  mostly  handle  how to deal with breeds. Basic on requirements, there are some cases need to handle:    
    breeds without subbreed, just put them into a string list and return  ex: {sheep:[],dog:[]}-->[sheep,dog]       
    breed with subbreed, use space separator  concat breeds and his subbreeed  ex: {sheep:['dog','cat'],wolf:[]}-->['dog sheep','cat sheep','cat']      
  (this case may not a need)  breed with embedded subbreed, recursive to get all result..     
   ex: {sheep:[{dog:['cat,monkey']},'cat'],wolf:[]}-->['cat dog sheep','monkey dog sheep',  'cat sheep','wolf']      


  breed-get.test.ts     test file: there lots of test case for above two functions:   
   1.  fetchhandler()  timeout test, fetch timout test, happy path or bad path test, etc   
   2.  handlebreed ()  all above three cases, and empty test case and some corn test cases.. all those test case done in local  without internet  connection, use identical test data    
   test data format  is the same as the one gets from API call    
    
# The Extend Challenge

This is bare-bones version of our backend codebase, where we ask candidates to make a small contribution. The goal: give both the candidate and the Extend team a chance to interact on a realistic, but limited (shooting for just a few hours), task. We see this as a two-way evaluation, for the team and the candidate to decide if its a good fit.

## Setup

- Install [Homebrew](https://brew.sh/).

- Install the [Node Version Manager](https://github.com/creationix/nvm).

- Install [yarn](https://www.npmjs.com/package/yarn)

  ```bash
  brew install yarn
  ```

- Clone the repository on the local machine.

  ```bash
  git clone https://github.com/helloextend/lambda-scaffold.git
  cd lambda-scaffold
  ```

- Copy this repository to your own private repository on GitHub.

- Make sure you're on the correct version of NodeJS.

  ```bash
  nvm use
  ```

- Install the app

  ```bash
  yarn
  ```

- Run all tests

  ```bash
  yarn test
  ```

- Confirm our a compiled-build of our sample Lamdbda handler works

  ```bash
  yarn test:lambda
  ```

## Challenge

Follow these steps to create a new API endpoint in this codebase:

- create a new branch from `master`.

- use this [public endpoint](https://dog.ceo/api/breeds/list/all) to pull breeds of dogs

- in `src/lambdas`, add a new `handler` module, in a file called something like `breeds-get.ts`, along with a `breeds-get.test.ts`.

- Use `node-fetch` (already installed) to pull from the [dogs-list endpoint](https://dog.ceo/api/breeds/list/all). Organize the code in a way that could scale if the codebase were to grow.

- the endpoint handler should return a list of all breeds as a flat array of strings, with each sub-breed getting a separate element. For example, both `english sheepdog` and `shetland sheepdog` should be on the list.

- in your handler tests `breeds-get.test.ts`, create a way to mock the results of the external API call, so the handler can be tested without an internet connection.

- test the happy path, and the cases of a timeout error from the external dogs-list endpoint.

- submit a PR in your repository, with a descriptive message, and no more than a few commits (each with a clear purpose).

- in your private repository, add `paulswebapps` as a collaborator, and send an email to `paul@extend.com` with a link to your repository.

- before the next interview, we will provide PR feedback, to give you a chance to improve your solution before the call.

- Feel free to ask questions, as we want to simulate working with the team.
