import AuthRouter from "./routes"
import Morgan from "morgan"
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import cors from "cors";
import helmet from "helmet";

class App extends Server {
    private port = process.env.PORT || 1488;
    private readonly SERVER_STARTED = 'Example server started on port: ';

    constructor() {
        super();

        this.initMiddlewares()
        this.initRoutes()
    }

    private initMiddlewares() {
        this.app.use(bodyParser.json());
        // this.app.use(cookieParser());
        this.app.use(Morgan('combined'));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.get('/', (req, res) => res.sendStatus(404));
    }

    private initRoutes() {
        this.app.use(AuthRouter);
    }

    public start() {
        this.app.listen(this.port, () => {
            Logger.Imp(this.SERVER_STARTED + this.port);
        });
    }
}

export default App;
