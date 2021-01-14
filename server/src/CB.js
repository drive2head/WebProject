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
    time_threshold = 60000 // время, в течении которого подсчитывается количество ошибок
    waiting_time = 60000   // время ожидания (между переходом из OPENED в HALFOPENED)

    constructor(serverAddr) {
        console.log(this)
        this._serverAddr = serverAddr;
        if (this._timer != null)
            clearInterval(this._timer);
        // Устанавливаем планировщик, которые каждые $time_threshold мс сбрасывает счетчик ошибок
        this._timer = setInterval(() => { this._failure_counter = 0; }, this.time_threshold);
    }

    _sendRequest = async (req) => {
        console.log("this:", this);
        return await axios({
            method: req.method,
            url: path.join(this._serverAddr, req.url),
            data: req.body
        });
    };

    _sendError = (res) => {
        res.status(503).send({ service: "CircuitBraker", message: "Service is unavailiable" });
    };

    _sendResult = (res, result) => {
        res.status(200).send(result); // TODO: проверить, нужно ли отправлять весь result
    };

    fetch = async (req, res) => {
        console.log("this._state:", this._state);
        console.log("this._serverAddr:", this._serverAddr);
        switch (this._state) {
            case CLOSED:
                this._sendRequest(req)
                .then(result => {
                    console.log("RESULT:\n", result);
                    this._sendResult(res, result);
                })
                .catch(error => {
                    console.log("ERROR:\n", error);
                    this._failure_counter += 1;
                    if (this._failure_counter >= this.failure_threshold) {
                        this.open();
                    }
                    // this._sendError(res);
                });
                break;
            case OPENED:
                this._sendError(res);
                break;
            case HALFOPENED:
                this._sendRequest(req)
                .then(result => {
                    console.log("RESULT:\n", result);
                    this._success_counter += 1;
                    if (this._success_counter >= success_threshold) {
                        this.close();
                    }
                    this._sendResult(res, result);
                })
                .catch(error => {
                    console.log("ERROR:\n", error);
                    this.open();
                    this._sendError(res);
                })
                break;
            default:
                console.log("Wrong value was given in CASE statement!");
        };
    }

    open = () => {
        this._state = OPENED;
        setTimeout(this.halfopen, this.waiting_time);
    }

    halfopen = () => {
        this._success_counter = 0;
        this._state = HALFOPENED;
    }

    close = () => {
        this._failure_counter = 0;
        this._state = CLOSED;
    }
};

module.exports = CB
