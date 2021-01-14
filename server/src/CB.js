const CLOSED = 0;
const OPENED = 1;
const HALFOPENED = 2;
var path = require("path");

export const CB = {
    /* Внутренние значения, которые меняются ТОЛЬКО самим CB */
    _state: CLOSED,
    _failure_counter: 0,
    _success_counter: 0,
    _timer: null,

    /* Дефолтные значения, которые юзер может менять */
    timeout: 2000,         // время ожидания выполнения запроса
    failure_threshold: 5,  // количество ошибок, после которого сервер меняет состояние
    success_threshold: 5,  // количество запросов, которые должны пройти успешно, для возвращения в CLOSED
    time_threshold: 60000, // время, в течении которого подсчитывается количество ошибок
    waiting_time: 60000,   // время ожидания (между переходом из OPENED в HALFOPENED)

    init(serverAddr) {
        this._serverAddr = serverAddr;
        if (this._timer != null)
            clearInterval(this._timer);
        // Устанавливаем планировщик, которые каждые $time_threshold мс сбрасывает счетчик ошибок
        this._timer = setInterval(() => { _failure_counter = 0; }, time_threshold);
    },

    async fetch(req, res) {
        async function _sendRequest (req) {
            return await axios({
                method: req.method,
                url: path.join(this.serverAddr, req.url),
                data: req.body
            });
        };

        function _sendError (res) {
            res.status(503).send({ service: this._serviceName, message: "Service is unavailiable" });
        }

        function _sendResult (res, result) {
            res.status(200).send(result); // TODO: проверить, нужно ли отправлять весь result
        }


        switch (this._state) {
            case CLOSED:
                _sendRequest(req)
                .then(result => {
                    _sendResult(res, result);
                })
                .catch(error => {
                    this._failure_counter += 1;
                    if (this._failure_counter >= failure_threshold) {
                        open();
                    }
                    _sendError(res);
                });
                break;
            case OPENED:
                _sendError(res);
                break;
            case HALFOPENED:
                _sendRequest(req)
                .then(result => {
                    this._success_counter += 1;
                    if (this._success_counter >= success_threshold) {
                        close();
                    }
                    _sendResult(res, result);
                })
                .catch(error => {
                    open();
                    _sendError(res);
                })
                break;
            default:
                console.log("Wrong value was given in CASE statement!");
        };
    },

    open() {
        this._state = OPENED;
        setTimeout(halfopen, this.waiting_time);
    },

    halfopen() {
        this._success_counter = 0;
        this._state = HALFOPENED;
    },

    close() {
        this._failure_counter = 0;
        this._state = CLOSED;
    }
};
