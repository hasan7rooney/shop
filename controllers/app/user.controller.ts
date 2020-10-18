import { Request, Response } from "express";
import { okRes, errRes, getOTP, hashMyPassword} from "../../helpers/tools";
import * as validate from "validate.js";
import validation from "../../helpers/validation.helper";
import { User } from "../../src/entity/User";
import PhoneFormat from "../../helpers/phone.helper";
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

/**
 *
 */
export default class UserController {
  /**
   *
   * @param req
   * @param res
   */
  static async register(req: Request, res: Response): Promise<object> {
    let notValid = validate(req.body, validation.register());
    if (notValid) return errRes(res, notValid);
    let phoneObj = PhoneFormat.getAllFormats(req.body.phone);
    if (!phoneObj.isNumber)
      return errRes(res, `Phone ${req.body.phone} is not a valid`);

    let user: any;

    try {
      user = await User.findOne({ where: { phone: req.body.phone } });
      if (user) return errRes(res, `Phone ${req.body.phone} already exists`);
    } catch (error) {
      return errRes(res, error);
    }

    // TODO: create JWT Token
    // TODO: Hash the password
    // TODO: send the SMS
    
    const hash = await hashMyPassword(req.body.password);
    user = await User.create({
      ...req.body,
      active: true,
      complete: false,
      otp: getOTP(),
      password:hash
      
    });
    
    await user.save();
    
    var token = jwt.sign({ id: user.id }, "shhhhh");
   
    return okRes(res, {user,token,hash});
  }



  static async otp(req: Request, res: Response): Promise<object>{
    let notValid = validate(req.body, validation.otp());
    if (notValid) return errRes(res, notValid);

    let user = await User.findOne({where: {phone: req.body.phone }})
    if (user.otp != req.body.otp) return errRes(res, "otp is wrong")
    else {
      user.complete=true;
      user.save();
      return okRes(res, "it worked!");
    }

  }


  static async login(req: Request, res: Response): Promise<object>{
    let notValid = validate(req.body, validation.login());
    if (notValid) return errRes(res, notValid);





  



    let user = await User.findOne({where: {phone: req.body.phone }})
  if (!user) return errRes(res, `Phone ${req.body.phone} does not exists, go register`);
   if (user.complete == false)  return errRes(res, `u haven't finished registering, go back :)`);


  bcrypt.compare(req.body.password, user.password, function(err, rest) {
    if(rest){
       var token = jwt.sign({ id: user.id }, "shhhhh");
      return okRes(res, {token });
    } else {

      return errRes(res, "password is wrong");;
  
  
    }
  });




//  const enter = bcrypt.compare(req.body.password, user.password)
   
//  if (!enter) return errRes(res, enter);


//  result == true

// let enter = bcrypt.compare(req.body.password, user.password)
// if (enter) return errRes(res, enter);


  }

  // static async otp(req: Request, res: Response): Promise<object>{

  




  // }

}



