import Morgan from "morgan"
import bodyParser from "body-parser";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import cors from "cors";
import helmet from "helmet";
import {usePassport} from './config/passport'
import {AuthController} from "./controller";
import {Api_v1} from "./api_v1";

class App extends Server {
    private readonly SERVER_STARTED = 'Сервер запущен: ';

    constructor() {
        super();

        this.initMiddlewares()
        this.initControllers()
    }

    private initMiddlewares() {
        usePassport()
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(Morgan('combined'));
        this.app.use(helmet());
        this.app.use(cors());
    }

    private initControllers() {
        // const apiV1 = new Api_v1()
        const authController = new AuthController()
        super.addControllers([authController])
    }

    public start() {
        this.app.listen(process.env.PORT, () => {
            Logger.Imp(this.SERVER_STARTED + process.env.PORT);
        });
    }
}

export default App;
