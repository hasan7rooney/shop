const jwt = require("jsonwebtoken");
import {errRes}  from "./helpers/tools";

let auth = (req, res, next) => {
    // get token from req headers
    const token = req.headers.token;
    if (!token) return errRes(res, "Token is missing");
    // verify the token with the key
    try {
      const payload = jwt.verify(token, "shhhhh");
      // if ok -> next()
      next();
    } catch (error) {
      // if not return error
      return errRes(res, "Token is not valid");
    }
  };

export default auth


// let checkToken = (req, res) => {
//     //verify the JWT token generated for the user
//     jwt.verify(req.token, 'shhhhh', (err, authorizedData) => {
//         if(err){
//             //If error send Forbidden (403)
//             console.log('ERROR: Could not connect to the protected route');
//             res.sendStatus(403);
//         } else {
//             //If token is successfully verified, we can send the autorized data 
//             res.json({
//                 message: 'Successful log in',
//                 authorizedData
//             });
//             console.log('SUCCESS: Connected to protected route');
//         }
//     })
// };

// export default checkToken