import * as OTPValidator from "./OneTimePasswordValidator";
import * as SMValidator from "./SendMessageValidator";

const validator =  {
    ...OTPValidator,
    ...SMValidator
}

export default validator