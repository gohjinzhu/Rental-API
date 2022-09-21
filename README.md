# Rental-API
An API that return unit rental advertisement in Singapore from various websites

Results are collected by webscraping

## To run this project

You can run this project on your local machine. Just pull it down and do the following:

1. Run the command below to install all the packages

```bash
npm i
```

2. Now run the server:

```bash
nodemon index
```

3. Open [http://localhost:8000/rental/all](http://localhost:8000/rental) with your browser to see the results of the scrape in your terminal.

**API paths:
[http://localhost:8000/rental/all]

[http://localhost:8000/rental/rentinsingapore]

[http://localhost:8000/rental/99co]

[http://localhost:8000/rental/propertyguru]

## Example of response (result of 5 pages at http://localhost:8000/rental/all)

![image](https://user-images.githubusercontent.com/94891192/191440567-b07edadb-10e3-42d0-a230-84f95b70b557.png)

Note: the number of response is limited to reduce the load of website. Webscraping may be oppose with some website policy.

