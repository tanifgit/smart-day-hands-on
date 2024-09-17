# SMART On FHIR Workshop
This project is an example of configuration and use of InterSystems FHIR Server and capabilities to build a SMART on FHIR application.

The project is made out of three parts - 
* An application (built with Angular)
* An OAuth Server (auth0 by Okta)
* A FHIR Server (InterSystems Cloud FHIR Server)

![Key Project Parts](/images/SMART-Key-Players.png)

What will you find in this project?

## Smart UI:
Angular application to use as a front-end, configured to login using an Auth0 account.

# What do you need to make it run?

Before running the container:

## FHIR Server:
Quite naturally we need a FHIR Server.
In this hands-on exercise we'll use the InterSystems Cloud FHIR Server.
In the SMART Day landing page initial steps you might have already created the server, just in case, makre sure you fired off the deployment creation as this will take several minutes.
The landing page included basic steps, with screenshots, but just to make sure, here are a some more screenshots in case you need further guidance for these steps:

### Service Type, Deployment Size and Additional Options:
You'll only have one Service to "choose" from - the InterSystems FHIR Server
Also only one Deployment Size (for this exercise) - Extra Small
Under the Additioanl Options - Encrypt Database is set, and you do not need to check the Enable SQL Builder option (not covered in this exercise)

![FHIR Server Deployment - size](/images/fhir-server-create-deployment1-deployment-size.png)

### Cloud Options:
Under Cloud Options you can see the Cloud Provider is already AWS, and for the region you can leave the default USE East Ohio (us-east-2).
(If you want you can browse down the drop-down list and see we also have Israel Tel-Aviv as an optional region)

![FHIR Server Deployment - cloud provider](/images/fhir-server-create-deployment2-cloud-options.png)

### Deployment Name:
Enter in a name for your deployment (you can leave the default, some combination of your user name and date, or set some other meaningful name for you)

![FHIR Server Deployment - name](/images/fhir-server-create-deployment3-deployment-name.png)

### Review:
Review the various details and press Create

![FHIR Server Deployment - review](/images/fhir-server-create-deployment4-review.png)

As mentioned this will take several minutes (typicaly could be 15 minutes or even a little more)
You will see your deployment in the list of deployments, with a status of CREATING

### Creation Process:
![FHIR Server Deployment - creating](/images/fhir-server-create-deployment5-creating.png)

Once done the deployment listing will change a little - you'll get a little blue circle in the corner, and a status of "False" (don't worry :wink: this is an OK status in the context of the exercise environment we created for the SMART Day)

We'll come back to our FHIR Server soon, but in the meantime we'll move on to setting up our OAuth server - auth0.

![FHIR Server Deployment - done](/images/fhir-server-create-deployment6-done.png)



## Auth0 account:
SMART On FHIR requires OAUTH2 as a protocol for authorization, for this example we are going to use Auth0 as external Oauth2 server. To use it you should create an account from [here] (https://auth0.com/). Your Auth0 user will be the user to access to the web application.

### Signing Up:

Click the Signup and register your email and password:

![OAuth Signup - done](/images/auth0-signup1.png)

![OAuth Signup - email](/images/auth0-signup2-email.png)

![OAuth Signup - password](/images/auth0-signup3-password.png)

When asked you can simply choose you'll use this for Coding, but leave the checkboxes empty:

![OAuth Signup - coding](/images/auth0-signup4-profile-coding.png)

You should see a message that auth0 is setting up your tenant:

![OAuth Signup - tenant](/images/auth0-signup5-settingup-tenant.png)

And eventually you should get a Welcome screen, which you can simply Skip.

![OAuth Signup - welcome](/images/auth0-signup6-welcome-skip.png)

### Creating an Application:

Once you're in the first step we'll want to do is to create an application.

The first screen could should this option - Create Application, or you can choose Applications from the left side menu tree:

![OAuth Create App - Create Start](/images/auth0-create-app.png)

![OAuth Create App - Create Menu](/images/auth0-create-app0.png)

Via either way we will arrive at the Application Creation page, we will give it a name (fhirapp) and a Type - Single Page Web Application (or SPA), and simply press Create:

![OAuth Create App - Name and Type](/images/auth0-create-app1-name-spa.png)

You should see now your application page:

![OAuth Create App - Created](/images/auth0-create-app2-created.png)

### Application URLs:

We will now want to setup some relevant URLs in our application settings:

![OAuth URLs - Settings](/images/auth0-create-app3-settings.png)

The URL we will enter in several places is:
```
https://localhost
```
(note this is https and not http)

We will enter this in the Callback URL:
![OAuth URLs - Callback](/images/auth0-create-app4-callback-url.png)

In the Allowed Web Origin:
![OAuth URLs - Allowed Web](/images/auth0-create-app5-allowed-web-origin.png)

And in the Allowed Origin (CORS):
![OAuth URLs - Allowed CORS](/images/auth0-create-app6-allowed-origin-cors.png)

Finally simply press Save Changes in the right bottom corner:
![OAuth URLs - Save](/images/auth0-create-app7-save.png)

We'll come back to our application soon, but for now we'll go and create a User for logging into our application

### Application User Creation:

Under User Management choose Users:
![OAuth User - Menu](/images/auth0-create-user1.png)

Simply press the Create User button:
![OAuth User - Button](/images/auth0-create-user2-press.png)

Enter in the details for the User - Email address and Password, and press Create.
Note this can be the same information you used when signing up to auth0, or something else.
![OAuth User - Details](/images/auth0-create-user3-details.png)

Then you should see your User's page:
![OAuth User - Created](/images/auth0-create-user4-created.png)

We'll come back to our User later.

For now we need to make sure our Cloud FHIR Server is up and running, to grab some information from there, and do some more setup.


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