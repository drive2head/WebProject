export const CB = {
    _time: 2000,
    isClosed: false,
    fetch(res, req) {
        if (this.isClosed) {
            res.status(500).send('Server sdox');
        } else {
            // ....
            // .then(res => )
            // .catch(err => {
            //     this.close()
            // }
        }
    },

    close() {
        this.isClosed = true;
        setTimeout(() => {
            this.isClosed = false
            fetch()
        }, this._time)
    }
};
