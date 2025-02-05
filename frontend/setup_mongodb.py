from datetime import datetime

from pymongo import MongoClient
from pymongo.errors import CollectionInvalid


def setup_database():
    # 连接到MongoDB
    client = MongoClient('mongodb://localhost:27017/')

    # 选择或创建数据库
    db = client['your_database_name']

    # 创建users集合
    try:
        db.create_collection("users")
        print("Users collection created successfully.")
    except CollectionInvalid:
        print("Users collection already exists.")

    # 创建login_attempts集合
    try:
        db.create_collection("login_attempts")
        print("Login attempts collection created successfully.")
    except CollectionInvalid:
        print("Login attempts collection already exists.")

    # 获取集合引用
    users_collection = db["users"]
    login_attempts_collection = db["login_attempts"]

    # 为users集合创建索引
    users_collection.create_index("username", unique=True)
    users_collection.create_index("email", unique=True)

    # 为login_attempts集合创建索引
    login_attempts_collection.create_index("username")
    login_attempts_collection.create_index("timestamp")

    return db, users_collection, login_attempts_collection


if __name__ == "__main__":
    db, users, login_attempts = setup_database()

    # 示例：添加用户
    try:
        result = users.insert_one({
            "username": "john",
            "email": "john@example.com",
            "password_hash": "hashed_password_here"
        })
        print(f"User inserted with id: {result.inserted_id}")
    except Exception as e:
        print(f"Error inserting user: {e}")

    # 示例：记录登录尝试
    login_attempts.insert_one({
        "username": "johndoe",
        "timestamp": datetime.utcnow(),
        "success": True
    })

    # 查询示例
    user = users.find_one({"username": "johndoe"})
    print(f"Found user: {user}")

    recent_attempts = login_attempts.find({"username": "johndoe"}).sort("timestamp", -1).limit(5)
    print("Recent login attempts:")
    for attempt in recent_attempts:
        print(f"  {attempt['timestamp']}: {'Success' if attempt['success'] else 'Failure'}")