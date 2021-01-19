import {ChildControllers, Controller} from "@overnightjs/core";
import {AuthController} from "./controller";

@Controller('v1')
@ChildControllers([AuthController])
export class Api_v1 {

}
