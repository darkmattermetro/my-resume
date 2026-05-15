def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Division by zero"
    return a / b

def power(a, b):
    return a ** b

#operations["5"] = ("Power", power)  # done!
operations = {
    "1": ("Add", add),
    "2": ("Subtract", subtract),
    "3": ("Multiply", multiply),
    "4": ("Divide", divide),
    "5": ("POwer", power),
}

print("=== Simple Calculator ===")
while True:
    print("Choose an operation:")
    print("1. Add\n2. Subtract\n3. Multiply\n4. Divide\n5. Power\n6. Exit")

    choice = input("Enter choice (1-5): ")
    # rest stays the sam

    if choice == "6":
        print("Goodbye!")
        break

    if choice not in operations:
        print("Invalid choice. Please try again.")
        continue

    try:
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
    except ValueError:
        print("Invalid input. Please enter numbers.")
        continue

    name, func = operations[choice]
    result = func(num1, num2)
    print(f"{name}: {num1} ? {num2} = {result}")
