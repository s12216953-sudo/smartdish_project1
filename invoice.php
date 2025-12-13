<?php

$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "smartdish"; 

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (!isset($_GET['order_id'])) {
    die("No order specified!");
}
$order_id = intval($_GET['order_id']);

$order_sql = "SELECT * FROM orders WHERE order_id = $order_id";
$order_result = $conn->query($order_sql);
if ($order_result->num_rows === 0) {
    die("Order not found!");
}
$order = $order_result->fetch_assoc();

$items_sql = "SELECT * FROM order_items WHERE order_id = $order_id";
$items_result = $conn->query($items_sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #<?php echo $order_id; ?></title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7; }
        .invoice { max-width: 600px; margin: auto; background: #fff; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="invoice">
        <h2>SmartDish Invoice</h2>
        <p><strong>Order ID:</strong> <?php echo $order['order_id']; ?></p>
        <p><strong>Order Time:</strong> <?php echo $order['order_time']; ?></p>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <?php while($item = $items_result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($item['item_name']); ?></td>
                        <td><?php echo $item['quantity']; ?></td>
                        <td>$<?php echo number_format($item['price'], 2); ?></td>
                        <td>$<?php echo number_format($item['quantity'] * $item['price'], 2); ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <p class="total">Total Price: $<?php echo number_format($order['total_price'], 2); ?></p>
    </div>
</body>
</html>

