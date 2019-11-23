'use strict';

module.exports = () => {
    return {
        api: {
            host: '0.0.0.0',
            port: 4567
        },
        postgres: {
            connectionString: 'postgres://postgres:postgres@127.0.0.1/mobilehybriddb'
        },
        firebase: {
            serverkey: 'AAAAy1UhsUg:APA91bEfBlk83wpfARCmSHWARzER_XVzW8jcmEur-d6f4Cwkcbtnsw9HWZSg-DyoTdocoibb74Jt7DYPcaZA66zKlHnsEjUUGJQx0wk05phB8EASkk8OazGUsNrZM6bc7ADhgHy2vsSg'
        }
    }
}