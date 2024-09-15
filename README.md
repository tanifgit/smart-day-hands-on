# SMART On FHIR Workshop
This project is an example of configuration and use of InterSystems FHIR Service and capabilities to build a SMART on FHIR application.

What will you find in this project?

## Smart UI:
Angular application to use as a front-end, configured to login using an Auth0 account.

# What do you need to make it run?

Before running the containers:

## Auth0 account:
SMART On FHIR requires OAUTH2 as a protocol for authorization, for this example we are going to use Auth0 as external Oauth2 server. To use it you should create an account from [here] (https://auth0.com/). Your Auth0 user will be the user to access to the web application.

With your recently created user you have to login in Auth0 and create a new application:
![Application menu](/images/application.png)

Don't forget the Domain value because you are going to use it in the following steps.

A new window will be opened, you have to select **Single Page Web Applications** and define the name of your application (feel free).
![Single Page Web Application](/images/new_application.png)

After that, a new screen with the details of the configuration will be opened fulfill the following fields: 
* Allowed Callback URLs: **https://localhost**
* Allowed Logout URLs: **https://localhost**
* Allowed Web Origins: **https://localhost**
* Allow Cross-Origin Authentication: Checked
* Allowed Origins (CORS): **https://localhost**
![Application configuration](/images/creating_application.png)

Once the application has been created you have to create a new API to protect and identify our connection with InterSystems IRIS FHIR Repository. Clicking on APIs option in the left menu will open a screen like this:
![API configuration](/images/new_api.png)

The URL field will be used to identify the "audience" or resource server that the client will access, you can use this one:
```
https://localhost/smart/fhir/r5
```
Once you have created the API you need to define the Permissions that will be assigned to the authorized user, in our case we are going to allow the user to read and modify all the resources in the FHIR repository defining the FHIR Scope:
```
user/*.*
```
![API permission](/images/api_permission.png)

Now Auth0 is ready to work as authentication and authorization server!

## Angular Application configuration

With our Auth0 account configure we have to update the Angular application to work with it. From Visual Studio Code open the file **smart-ui/src/app.module.ts** and replace **YOUR_DOMAIN** and **YOUR_CLIENT_ID** with the values that you got when you created the application on Auth0.
![Angular configuration](/images/angular_configuration.png)

Now you are ready to deploy the containers!

## Running Docker Containers:

Open a terminal in Visual Studio and just write:
```
docker-compose up -d
```

You will see 1 container running on your Docker.
![Docker Desktop](/images/docker_running.png)

# Opening Angular application.

This project is configured to deploy an Angular application in the following address: [URL](https://localhost). This application has been created with Angular Material to simulate an application for smartphones, if you are using Google Chrome or Firefox you can change the visualization pressing **CTRL + SHIFT + M**
![Login screen](/images/login_smart.png)

Click on login and introduce the user from your Auth0 account. Auth0 will request permission to access to your Auth0 account, grant it.