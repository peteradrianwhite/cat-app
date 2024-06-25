Cats FTW - Peter White App

Thanks for taking the time to review my submission. Please let me know if there are any questions or anything is unclear. As I mention below, the CATaaS API will occasionally take a second to fire up the first cat pic, so if it seems as though it isn’t loading, give it a second. 

Notes for bonus points:

I know the request was to constrain images by width but I constrained images based on height instead as I found constraining by width negatively impacted the appearance of wide photos. 
Public deployment completed
Microsoft technologies used: Azure for deployment, VS Code for development. 

Other notes:
Component resizes to fit screen down to a minimum size 
Added an extra feature where you can save cat photos so you don’t lose your favorites
Occasionally the API (cataas) is slow to respond and images take a minute to appear. 


Deployment
The app is currently live on Azure at https://lemon-ground-03ead1c0f.4.azurestaticapps.net/. It is deployed with CI/CD using Github Actions, pulled from this repo: https://github.com/peteradrianwhite/cat-app

It can be run locally by unzipping and navigating to the root folder (cat-app) in a command shell. From there you can type ‘npm start’ to start the app locally. 

Time Spent
Approximately 2 hours plus whatever it took to write this up. 

Challenges: took a minute to get CI/CD flow working with Azure. 

Compromises/Shortcuts - I used GPT to make the stylesheet because no one should have to write CSS for free. Save cat feature is pretty basic and only saves for the session as I didn’t want to get a DB involved. 

Feedback - With free hosting offers from all cloud platforms it would make sense to make a quick CI deployment a part of the project. 

Forward Looking Items - Definitely a check on the validity of photos returned by the API, as occasionally they are invalid. Also not relying on a third party API for pics, we’d have to build our own database. Better colors/images/etc. Some user authorization would be nice, as well as a better ability to save images. Would add a search feature as well. Allow users to upload pictures. Realistically this is bare bones, so there are infinite things we could do with it. Why not hook it all up to the blockchain and we’ll sell the pics as NFTs and live like royalty. Royalty!  

Thanks for reading!
Peter

