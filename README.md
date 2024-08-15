# vue-3-cod3r-knowledge-2024

## Reference project
https://github.com/cod3rcursos/knowledge

## Notes
1. Install tools
1. .env file on backend

## Tools ubuntu0.22.04.1
1. Mongo DB v7
    1. **TODO** Install
        1. https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
    1. sigin
        ```
        sudo mongod
        ```
1. psql (PostgreSQL) 14.12
    ```bash
    # apt-get install
    sudo apt-get install postgresql postgresql-contrib 
    # sudo sigin
    sudo su - postgres
    # CLI
    psql -U postgres
    # list database
    \l
    # exit CLI
    \q
    # create final project database
    CREATE DATABASE knowledge_final;
    # connect database
    \c knowledge_final
    # show tables
    \dt
    ```
    1. Create database
    ```sql
    CREATE DATABASE knowledge
    ```
    1. Connect to created database
    ```bash
    \c knowledge 
    ```
1. knex 3.1.0
    1. Install
    ```bash
    sudo npm i -g knex
    ```
    1. Init
    ```bash
    knext init
    ```
    1. Migrate
    ```bash
    knext migrate:make create_table_users
    ```
