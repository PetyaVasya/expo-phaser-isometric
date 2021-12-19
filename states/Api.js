class API {

    constructor({ apiUrl }) {
        this.apiUrl = apiUrl;
        this.parseUrlArgs();
    }

    parseUrlArgs = () => {
        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get("token") ? urlParams.get("token") : "undefined" ;
    }

    get seed() {
        return this.token;
    };

    canMove = () => {
        return this.sendGet('available', {

        });
    }

    getPrize = () => {
        return this.sendPost('prize', {

        });
    }

    sendPost = (url, data) => {
        if (typeof data === 'object') {
            data.method = 'POST';
            if (data.headers === undefined) {
                data.headers = {};
            }
            data.headers.Authorization = `Bearer ${this.token}`;
        }
        return fetch(this.apiUrl + url, data).then(res => res.json());
    }

    sendGet = (url, data) => {
        if (typeof data === 'object') {
            data.method = 'GET';
            if (data.headers === undefined) {
                data.headers = {};
            }
            data.headers.Authorization = `Bearer ${this.token}`;
        }
        return fetch(this.apiUrl + url, data).then(res => res.json());
    }

}

export default API;
