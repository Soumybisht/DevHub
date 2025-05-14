APIs we are going to build using express routers

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/editPassword


# connectionRequestRouter
- POST /request/send/interested/:userID
- pOST /request/send/ignored/:userID
- POST /request/review/accepted/:senderID
- POST /request/review/rejected/:senderID

# userRouter
- GET /connections
- GET /feed
- GET /request/received