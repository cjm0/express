
# node.js express 项目模板

这是一个 node.js express 项目模板

## 启动项目

```bash
git clone git@github.com:cjm0/express.git

yarn & yarn dev

```

## 说明

1. `node-dev` 
    
    监听文件，当有修改后自动去重启nodejs进程

2. `nodemon` 
    
    监视 node.js 应用程序中的任何更改并自动重启服务

3. `npm start` 
    
    本地启动 无监听

4. `npm run dev` 
    
    本地启动 有监听

5. `npm run prod` 
    
    线上启动

6. `redis & mongodb`
    
    需要额外启动 redis 和 mongodb  

    **linux 安装启动 redis**
        ```
        wget http://download.redis.io/releases/redis-5.0.0.tar.gz
        tar xzf redis-5.0.0.tar.gz
        cd redis-5.0.0
        make 
        src/redis-server

        检测后台进程是否存在 => ps -ef | grep redis

        检测6379端口是否在监听 => netstat -lanp | grep 6379

        编译时报错，关于gcc的，需要下载gcc => yum install gcc

        开机自启动
            1. 复制配置文件
                cd redis-5.0.0/
                mkdir /etc/redis
                cp redis.conf /etc/redis/6379.conf

                cd utils
                vi redis_init_script 
                    添加这几行
                    #!/bin/sh
                    # chkconfig:   2345 90 10
                    # description:  Redis is a persistent key-value database

                cp redis_init_script /etc/init.d/redisd

            2. 参考
                EXEC=/usr/local/bin/redis-server
                CLIEXEC=/usr/local/bin/redis-cli

                PIDFILE=/var/run/redis_${REDISPORT}.pid
                CONF="/etc/redis/${REDISPORT}.conf"

            3. 复制启动文件
                cp redis-server /usr/local/bin
                cp redis-benchmark /usr/local/bin
                cp redis-cli /usr/local/bin
                cp redis.conf /usr/local/bin
                cd /usr/local/bin

            4. 启动命令
                设置为开机自启动 => chkconfig redisd on 
                启动/关闭redis服务 => service redisd start
                关闭redis => service redisd stop
        ```
   
    **linux 安装启动 mongodb** 
        ```
        1. 安装mongodb数据库: 
            yum -y install mongodb-server mongodb 
            service mongod start #启动mongodb 服务 
            pstree -p | grep mongod #进程列表 
            chkconfig mongod on #开机启动mongod服务

        2. 进入mongodb数据库: 
            mongo # 进入mongodb命令行模式 
            show dbs #显示所有的表 
            db #当前数据库 
            show tables #当前数据库多少个集合 
            show collections #当前数据库多少个集合[*]
        ```
        
## 地址

[站点地址](http://express.bigqianduan.top)

## License

[MIT](./License)
