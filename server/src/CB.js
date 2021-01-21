const SERVICE_NAME = "CircuitBraker";
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
    _dontSendResult = true
    _lastError = null

    /* Дефолтные значения, которые юзер может менять */
    timeout = 2000         // время ожидания выполнения запроса
    failure_threshold = 5  // количество ошибок, после которого сервер меняет состояние
    success_threshold = 5  // количество запросов, которые должны пройти успешно, для возвращения в CLOSED
    time_threshold = 60000 // время, в течении которого подсчитывается количество ошибок
    waiting_time = 20000   // время ожидания (между переходом из OPENED в HALFOPENED)

    constructor(serverAddr) {
        this._serverAddr = serverAddr;
        if (this._timer != null)
            clearInterval(this._timer);
        // Устанавливаем планировщик, которые каждые $time_threshold мс сбрасывает счетчик ошибок
        this._timer = setInterval(() => { 
            this._failure_counter = 0; 
            console.log("Failure counter is reset!");
        }, this.time_threshold);
        this.close();
        this._dontSendResult = true;
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
            res.status(503).send({ service: SERVICE_NAME, message: "Service is unavailiable" });
        }
    };

    _sendResult = (res, result) => {
        res.status(200).send(result.data);
    };

    fetch = async (req, res = null) => {
        console.log("~~ ~~ ~~ ~~ ~~ ~~ ~~\nDEBUG:\nstate:", this._state);

        switch (this._state) {
            case CLOSED:
                return this._sendRequest(req)
                .then(result => {
                    if (this._dontSendResult) {
                        return result;
                    } else {
                        this._sendResult(res, result);
                    }
                })
                .catch(error => {
                    if  ((error.response != undefined && error.response.status != undefined && error.response.status >= 500) ||
                            (error.code != undefined && error.code == 'ECONNREFUSED')) 
                    {
                        if (error.code != undefined && error.code == 'ECONNREFUSED') {
                            const msg = `Connect ECONNREFUSED ${this._serverAddr}`;
                            console.log(msg);
                            this._lastError = Error(msg);
                            this._lastError.service = SERVICE_NAME;
                        } else {
                            this._lastError = Error(`Request failed with status code ${error.response.status}`);
                            this._lastError.service = SERVICE_NAME;
                        }

                        this._failure_counter += 1;
                        console.log(`CLOSED: error occured - counted \x1b[33m${this._failure_counter}\x1b[0m of \x1b[31m${this.failure_threshold}\x1b[0m failures` + 
                            "\n~~ ~~ ~~ ~~ ~~ ~~ ~~");

                        if (this._failure_counter >= this.failure_threshold) {
                            this.open();
                        }
                        if (this._dontSendResult) {
                            throw this._lastError;
                        } else {
                            this._sendError(res);
                        }
                    } else {
                        if (this._dontSendResult) {
                            throw this._lastError;
                        } else {
                            this._sendError(res, error.response.status, error.response.statusText);
                        }
                    }
                });
                break;
            case OPENED:
                if (this._dontSendResult) {
                    throw this._lastError;
                } else {
                    this._sendError(res);
                }
                break;
            case HALFOPENED:
                return this._sendRequest(req)
                .then(result => {
                    this._success_counter += 1;
                    console.log(`HALFOPENED: success - counted \x1b[33m${this._success_counter}\x1b[0m of \x1b[32m${this.success_threshold}\x1b[0m successes` + 
                        "\n~~ ~~ ~~ ~~ ~~ ~~ ~~");

                    if (this._success_counter >= this.success_threshold) {
                        this.close();
                    }
                    if (this._dontSendResult) {
                        return result;
                    } else {
                        this._sendResult(res, result);
                    }
                })
                .catch(error => {
                    console.log("HALFOPENED: error occured\n~~ ~~ ~~ ~~ ~~ ~~ ~~");

                    this.open();
                    if (this._dontSendResult) {
                        this._lastError = error;
                        this._lastError.service = SERVICE_NAME;
                        throw this._lastError;
                    } else {
                        this._sendError(res);
                    }
                })
                break;
            default:
                console.log("Wrong value was given in CASE statement!");
        };
    }

    open = () => {
        console.log("State was changed to {\x1b[31mOPENED\x1b[0m}...");
        this._state = OPENED;
        setTimeout(this.halfopen, this.waiting_time);
    }

    halfopen = () => {
        console.log("State was changed to {\x1b[33mHALFOPENED\x1b[0m}...");
        this._success_counter = 0;
        this._state = HALFOPENED;
    }

    close = () => {
        console.log("State was changed to {\x1b[32mCLOSED\x1b[0m}...");
        this._failure_counter = 0;
        this._state = CLOSED;
    }
};

module.exports = CB;
