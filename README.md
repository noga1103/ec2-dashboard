# ec2-dashboard

To launch the app, go to "https://ec2dashboard-z89h.onrender.com/instances?accessKey=YOUR-ACCESSKEY&secretKey=YOUR-SECRETKEY&region=YOUR-REGION". Replace YOUR-ACCESSKEY, YOUR-SECRETKEY, and YOUR-REGION with your access key, secret key, and region, respectively. SECERTKEY could contain special characters such as '/' or '='. Make sure you urlencode it before using it in the API!

If you want to sort, add "&sortBY=ATTRIBUTE" to the URL, and replace ATTRIBUTE with one of the following: Name, Id, Type, State, AZ, PublicIP, or PrivateIPs.

If you want the result to be paged, add "&page=NUM1&pageSize=NUM2" to the URL. You can change NUM2 to the number of instances you wish to be shown on a page, and NUM1 to the page number.
 
 
