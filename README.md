# Simple POS System

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

This POS application, built with Astro, is designed to facilitate seamless order operations. It includes core features such as a streamlined checkout process, product and inventory management, and transaction tracking.
## Demo

It's live on [https://spacerpos.vercel.com](https://robustpos.vercel.com?table=skdsj)

OR

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)
(with table 10)

## Features

 - Order
 - Payment with [Midtrans](https://midtrans.com) (Sandbox mode)
 - Authentication
 - Simple Dashboard Admin
## Scenario

- Each table on place will has a QRCode for the detail.
- Every order must include the table detail.
- User will continue their order as usual.
## Endpoint

- Initial data(s) are dummy from seeding.
- Default user:  
  *Username:*  ```admin```  
  *Password:*  ```password```  


- ```/order``` => Order page
- ```/login``` & ```/register``` => Authentication
- ```/dashboard``` => Dashboard Admin