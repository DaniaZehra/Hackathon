from models.user import User

def test_user_model():
    new_user = User(
        firstname="Vaniya",
        lastname="Rehan",
        username="vaniya123",
        password="secret123",
        balance=1000,
        monthly_spends=200,
        daily_avg_spend=6.67,
        transaction_history=[{"date": "2026-02-10", "amount": 50, "desc": "Groceries"}]
    )
    new_user.save()
    print(f"Inserted user with id: {new_user.id}")

    users = User.get_all_users()
    print("All users:")
    for u in users:
        print(u.firstname, u.lastname, u.username, u.balance)

    updated_user = User.update_user(new_user.id, {"balance": 1200})
    print(f"Updated balance: {updated_user.balance}")


if __name__ == "__main__":
    test_user_model()
