const CLOSED = 0;
const OPENED = 1;
const HALFOPENED = 2;
const axios = require('axios');
const path = require("path");

class CB {
    /* Внутренние значения, которые меняются ТОЛЬКО самим CB */
    _state = CLOSED
    _failure_counter = 0
    _success_counter = 0
    _timer = null
    _serverAddr = "CircuitBraker"

    /* Дефолтные значения, которые юзер может менять */
    timeout = 2000         // время ожидания выполнения запроса
    failure_threshold = 5  // количество ошибок, после которого сервер меняет состояние
    success_threshold = 5  // количество запросов, которые должны пройти успешно, для возвращения в CLOSED
    time_threshold = 20000 // время, в течении которого подсчитывается количество ошибок
    waiting_time = 20000   // время ожидания (между переходом из OPENED в HALFOPENED)

    constructor(serverAddr) {
        console.log(this)
        this._serverAddr = serverAddr;
        if (this._timer != null)
            clearInterval(this._timer);
        // Устанавливаем планировщик, которые каждые $time_threshold мс сбрасывает счетчик ошибок
        this._timer = setInterval(() => { 
            this._failure_counter = 0; 
            console.log("Failure counter is reset!");
        }, this.time_threshold);
        this.close();
    }

    _sendRequest = async (req) => {
        return await axios({
            method: req.method,
            url: this._serverAddr + req.url,
            data: req.body
        });
    };

    _sendError = (res, statusCode = null, statusText = null) => {
        if (statusCode != null) {
            res.status(statusCode).send({ message: statusText });
        } else {
            res.status(503).send({ service: "CircuitBraker", message: "Service is unavailiable" });
        }
    };

    _sendResult = (res, result) => {
        res.status(200).send(result.data);
    };

    fetch = async (req, res) => {
        console.log("state:", this._state);

        switch (this._state) {
            case CLOSED:
                this._sendRequest(req)
                .then(result => {
                    this._sendResult(res, result);
                })
                .catch(error => {
                    if (error.response.status != undefined && error.response.status >= 500) {
                        console.log("CLOSED: error occured");
                        this._failure_counter += 1;
                        console.log(`Counted ${this._failure_counter} of ${this.failure_threshold} failures`);
                        if (this._failure_counter >= this.failure_threshold) {
                            this.open();
                        }
                        this._sendError(res);
                    } else {
                        this._sendError(res, error.response.status, error.response.statusText);
                    }
                });
                break;
            case OPENED:
                this._sendError(res);
                break;
            case HALFOPENED:
                this._sendRequest(req)
                .then(result => {
                    this._success_counter += 1;
                    console.log(`Counted ${this._success_counter} of ${this.success_threshold} successes`);
                    if (this._success_counter >= this.success_threshold) {
                        this.close();
                    }
                    this._sendResult(res, result);
                })
                .catch(error => {
                    console.log("HALFOPENED: error occured");
                    this.open();
                    this._sendError(res);
                })
                break;
            default:
                console.log("Wrong value was given in CASE statement!");
        };
    }

    open = () => {
        console.log("OPENED!");
        this._state = OPENED;
        setTimeout(this.halfopen, this.waiting_time);
    }

    halfopen = () => {
        console.log("HALFOPENED!");
        this._success_counter = 0;
        this._state = HALFOPENED;
    }

    close = () => {
        console.log("CLOSED!");
        this._failure_counter = 0;
        this._state = CLOSED;
    }
};

module.exports = CB
