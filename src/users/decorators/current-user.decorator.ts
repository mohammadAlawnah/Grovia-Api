import { createParamDecorator ,ExecutionContext} from "@nestjs/common";
import { JWTPayloadType } from "src/utils/types";

// CurrentUser Parameter Decorator 
export const CurrentUser = createParamDecorator(
    (data,context: ExecutionContext) =>{
        const request = context.switchToHttp().getRequest();
        const paylod : JWTPayloadType = request["user"]

        return paylod;
    }
)

