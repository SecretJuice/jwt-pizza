# Pentest Joint Report

## Names: Connor Robb, Max Miller

### Self-attack:

Connor: 

1\. Date: April 9 2026

Target: [pizza.conrobb.com](http://pizza.conrobb.com/)

Classification: Security Misconfiguration

Severity: 3-High

Description: Default Admin Credentials permitted administrator access

![][image1]

Correction: Change administrator password

2\. Date: April 9 2026

Target: [pizza.conrobb.com](http://pizza.conrobb.com/)

Classification: Broken Access Control

Severity: 3-High

Description: Unprotected route `DELETE /api/franchise/:id` did not properly require admin privileges and permits unauthenticated callers to delete entire franchises

![][image2]
Correction: Enforce admin privilege at `DELETE /api/franchise/:id` by using the token middleware and checking for it in the handler.

3\. Date: April 9 2026

Target: [pizza.conrobb.com](http://pizza.conrobb.com/)

Classification: Injection

Severity: 3-High

Description: SQL Injection on User Information Edit form. Allows for changing information including usernames, emails, and passwords on different accounts, including those with elevated access. Conceptually could be used to scan and destroy database.

![][image3]
Correction: Use SQL parameters instead of string concatenation to build queries

4\. Date: April 9 2026

Target: [pizza.conrobb.com](http://pizza.conrobb.com/)

Classification: Insecure Design

Severity: 3-High

Description: User can pay (or take) arbitrary amounts of currency when ordering

![][image4]
Correction: Use item’s cost in database instead of given from user

5\. Date: April 10 2026

Target: [pizza.conrobb.com](http://pizza.conrobb.com/)

Classification: Security Misconfiguration

Severity: 1-Low

Description: Exceptions in service return stack traces

![][image5]
Correction: Modify top-level error handler not to include stack traces

Max: 

1. Date: Apr 9 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Identification and Authentication Failures  
     
   Severity: 3-High  
     
   Description: Empty password in login request lets anyone sign in with a known email. This could let attackers sign in as admins if they know their email.   
     
   Images: 

   ![][image6]![][image7]

Correction: Check for empty password before sending login request to database. 

2. Date: Apr 9 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Edit Object Creation   
     
   Severity: 1-Low  
     
   Description: Attackers can change item names and prices in orders.   
     
   Images:   
   ![][image6]![][image7]  
     
   Correction: Check item name and price against database. Throw an error if not.   
     
3. Date: Apr 10 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Edit Object Creation   
     
   Severity: 1-Low  
     
   Description: Attackers can change the storeId/franchiseId to a store that doesn’t exist.   
     
   Images:   
   ![][image8]![][image9]  
     
   Correction: Check that storeId/franchiseId is in the database before adding the order to the database. Throw an error if not.   
     
4. Date: Apr 11 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Edit Object Creation   
     
   Severity: 2-Medium  
     
   Description: Attackers can change store/franchise names while they’re being created.   
     
   Images:   
   ![][image10]![][image11]  
     
   Correction:   
     
5. Date: Apr 11 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Edit Object Creation  
     
   Severity: 3-High  
     
   Description: Attackers can change the franchise owner while creating a franchise. If they hacked into an admin account with attack 1 they could make themselves the owner of a new franchise.   
     
   Images:   
   ![][image12]![][image13]  
     
   Correction:   
     
6. Date: Apr 11 2026  
     
   Target: [https://pizza.pizza-factory-mrm-franchise.click](https://pizza.pizza-factory-mrm-franchise.click)   
     
   Classification: Get Unauthorized Data   
     
   Severity: 1-Low  
     
   Description: Calling GET /api/franchise/:userId with no userId while logged in as diner returns the franchise with userId 1\.   
     
   Images:   
   ![][image14]![][image15]  
     
   Correction: Check userId is valid before sending the request to the database. Throw an error if not.   
   

### Peer-attack:

Connor: 

1. Date: Apr 13 2026  
   Target: [https://pizza.pizza-factory-mrm-franchise.click/](https://pizza.pizza-factory-mrm-franchise.click/)  
   Classification: Security Misconfiguration  
   Severity: 3-High  
   Description: Used default ‘admin’ password to get into [a@jwt.com](mailto:a@jwt.com)’s account and gain admin privileges. Worked  
   Image: ![][image17]  
   Correction: Change administrator password after default account creation  
     
     
2. Date: Apr 13 2026  
   Target: [https://pizza.pizza-factory-mrm-franchise.click/](https://pizza.pizza-factory-mrm-franchise.click/)  
   Classification: Broken Access Control  
   Severity: 3-High  
   Description: Unprotected route `DELETE /api/franchise/:id` did not properly require admin privileges and permits unauthenticated callers to delete entire franchises. Worked.  
   Images: ![][image18]  
   ![][image19]  
   Correction: Protect handler with admin privileges  
     
3. Date: Apr 13 2026  
   Target: [https://pizza.pizza-factory-mrm-franchise.click/](https://pizza.pizza-factory-mrm-franchise.click/)  
   Classification: Injection  
   Severity: 3-High  
   Description: SQL injection on Update User Info form allows attackers to change name, email, and passwords of other accounts. Worked.  
   Images: ![][image20]  
   Correction: Use SQL parameters rather than string concatenation to build queries  
     
4. Date Apr 13 2025  
   Target: [https://pizza.pizza-factory-mrm-franchise.click/](https://pizza.pizza-factory-mrm-franchise.click/)  
   Classification: Insecure Design  
   Description: Failed to change price on order placing request  
   Severity: 0-Failed  
   Images: ![][image21]  
   Correction: Good job\!  
     
5. Date Apr 13 2026  
   Target  
   Classification: Security Misconfiguration  
   Severity: 1-Low  
   Description: Stack traces returned from the application  
   Image:![][image22]  
   Correction: Adjust high-level error handler to not include the stack trace  
   

Max: 

1. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Identification and Authentication Failures  
     
   Severity: 3-High  
     
   Description: I could login to [d@jwt.com](mailto:d@jwt.com) and [a@jwt.com](mailto:a@jwt.com) accounts without knowing the password.   
     
   Image:   
   ![][image23]  
     
2. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Edit Object Creation   
     
   Severity: 1-Low  
     
   Description: I could edit item names, but not prices.   
     
   Images:   
   ![][image24]![][image25]

3. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Edit Object Creation   
     
   Severity: 1-Low  
     
   Description: I could set storeId and franchiseId to stores that didn't exist.   
     
   Images:   
   ![][image26]![][image27]  
     
4. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Edit Object Creation   
     
   Severity: 2-Medium  
     
   Description: I could change the name of a franchise as it was being made.   
     
   Images:   
   ![][image28]![][image29]  
     
5. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Edit Object Creation  
     
   Severity: 3-High  
     
   Description: I could change the owner of a franchise as it was being made.   
     
   Images:   
   ![][image30]![][image31]  
     
6. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Get Unauthorized Data   
     
   Severity: 1-Low  
     
   Description: I could get data on the franchise with franchiseId 1 as a diner.   
     
   Images:   
   ![][image32]![][image33]![][image34]  
     
7. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Change User Information  
     
   Severity: 3-High  
     
   Description: I tried changing an admin user's roles. It didn’t work.   
     
   Images:   
   ![][image35]![][image36]  
     
8. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Change User Information  
     
   Severity: 3-High  
     
   Description: I tried changing my user's role to admin. It didn’t work.   
     
   Images:   
   ![][image37]![][image38]  
     
9. Date: Apr 12 2026  
     
   Target: [pizza.conrobb.com](http://pizza.conrobb.com/)   
     
   Classification: Get Unauthorized Data   
     
   Severity: 1-Low  
     
   Description: I tried to get an admin user's order history while signed in as a diner. It didn’t work.   
     
   Images:   
   ![][image38]![][image39]  
     
   

### Summary of learnings: 

Conner: 

* How easy it can be to miss small but critical things.
* How to perform SQL Injection

Max: 

* jwt tokens in PUT and POST requests include the request body and a “issued at” timestamp of the request. If the jwt doesn’t match the request body you get an error 400 “bad request.”   
* The difference between SQL string concatenation and SQL parameters. 

[image1]: Pentest_Joint_Report_images/page001_img001.png
[image2]: Pentest_Joint_Report_images/page002_img001.png
[image3]: Pentest_Joint_Report_images/page003_img001.png
[image4]: Pentest_Joint_Report_images/page004_img001.png
[image5]: Pentest_Joint_Report_images/page005_img001.png
[image6]: Pentest_Joint_Report_images/page006_img001.png
[image7]: Pentest_Joint_Report_images/page007_img001.png
[image8]: Pentest_Joint_Report_images/page007_img002.png
[image9]: Pentest_Joint_Report_images/page008_img001.png
[image10]: Pentest_Joint_Report_images/page008_img002.png
[image11]: Pentest_Joint_Report_images/page009_img001.png
[image12]: Pentest_Joint_Report_images/page009_img002.png
[image13]: Pentest_Joint_Report_images/page010_img001.png
[image14]: Pentest_Joint_Report_images/page010_img002.png
[image15]: Pentest_Joint_Report_images/page011_img001.png
[image16]: Pentest_Joint_Report_images/page011_img002.png
[image17]: Pentest_Joint_Report_images/page012_img001.png
[image18]: Pentest_Joint_Report_images/page013_img001.png
[image19]: Pentest_Joint_Report_images/page013_img002.png
[image20]: Pentest_Joint_Report_images/page014_img001.png
[image21]: Pentest_Joint_Report_images/page015_img001.png
[image22]: Pentest_Joint_Report_images/page016_img001.png
[image23]: Pentest_Joint_Report_images/page017_img001.png
[image24]: Pentest_Joint_Report_images/page018_img001.png
[image25]: Pentest_Joint_Report_images/page018_img002.png
[image26]: Pentest_Joint_Report_images/page019_img001.png
[image27]: Pentest_Joint_Report_images/page019_img002.png
[image28]: Pentest_Joint_Report_images/page020_img001.png
[image29]: Pentest_Joint_Report_images/page020_img002.png
[image30]: Pentest_Joint_Report_images/page021_img001.png
[image31]: Pentest_Joint_Report_images/page021_img002.png
[image32]: Pentest_Joint_Report_images/page022_img001.png
[image33]: Pentest_Joint_Report_images/page022_img002.png
[image34]: Pentest_Joint_Report_images/page022_img003.png
[image35]: Pentest_Joint_Report_images/page023_img001.png
[image36]: Pentest_Joint_Report_images/page023_img002.png
[image37]: Pentest_Joint_Report_images/page024_img001.png
[image38]: Pentest_Joint_Report_images/page024_img002.png
[image39]: Pentest_Joint_Report_images/page025_img001.png
