var pg = require('pg');
var pgclient = require('./PGconnect');// 引用上述文件
pgclient.getConnection();   
// 调用上述四个函数即可  
//pgclient.save('teacher',{'Name': a},cb);

/* 
 * 使用连接池 
 * */  
function connectPgWithPool() {  
    var pgConfig = {  
        user: 'postgres',  
        database: 'postgres',  
        password: '123456',  
        host: '127.0.0.1',  
        port: '5432',  
        poolSize: 5,  
        poolIdleTimeout: 30000,  
        reapIntervalMillis: 10000  
    };  
    var pgPool = new pg.Pool(pgConfig);  
    // var pgPool = new pg.pools.getOrCreate(pgConfig);// 低版本的pg模块需要这样来创建连接池  
      
    pgPool.connect(function (isErr, client, done) {  
        if (isErr) {  
            console.log('connect query:' + isErr.message);  
            return;  
        }  
        client.query('select now();', [], function (isErr, rst) {  
            done();  
            if (isErr) {  
                console.log('query error:' + isErr.message);  
            } else {  
                console.log('connectPgWithPool query success, data is: ' + rst.rows[0].now);  
            }  
        })  
    });  
}  
/** 不使用连接池* */  
function connectPgWithoutPool() {  
    var conStr = "postgres://postgres:123456@127.0.0.1:5432/postgres";  
    var client = new pg.Client(conStr);  
    client.connect(function (isErr) {  
        if (isErr) {  
            console.log('connect error:' + isErr.message);  
            client.end();  
            return;  
        }  
        client.query('select now();', [], function (isErr, rst) {  
            if (isErr) {  
                console.log('query error:' + isErr.message);  
            } else {  
                console.log('connectPgWithoutPool query success, data is: ' + rst.rows[0].now);  
            }  
            client.end();  
        })  
    })  
}  
connectPgWithPool();
connectPgWithoutPool();
