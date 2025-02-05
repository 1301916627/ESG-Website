from pymongo import MongoClient

# 如果MongoDB安装在本地则改成localhost,否则改成MongoDB所在的电脑或服务器的IP地址
# mongodb_host = 'mongodb://localhost:27017/'

mongodb_host = 'mongodb://192.168.1.9:27017/'
database_name = 'ecom'
collection_name = 'ecom_collection'

client = MongoClient(mongodb_host)
ecom_db = client[database_name]
ecom_collection = ecom_db[collection_name]
