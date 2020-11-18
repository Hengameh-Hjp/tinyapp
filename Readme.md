# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["This is a login page."](#)
!["This page shows when you login as a user"](#)
!["This page shows the registration form"](#)
!["This page shows when you login and want to create new url"](#)
## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Go to localhost:8080 on your browser.


# Register/Login
- Users must be logged in to create new links, view and edit the links.
- For registration, click Register on right top, put in your email and password.

# Create New Links
- Either click Create a New Short Link in My URLs page, or Create New URL on navigation bar. Then simply - enter the long URL you want to shorten.

# Edit or Delete Short Links
- In My URLs, you can delete any link you want.
- You can also click Edit, and then enter a new long URL to update your link. It will be the same short URL, but redirect to an updated long URL.

# Use Your Short Link
- The path to use any short link is /u/:shortLink. This will redirect you to the long URL.