<?php
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if(!isset($input['orders'])){
    echo json_encode(["status"=>"error","message"=>"No orders received"]);
    exit;
}

$conn = new mysqli("localhost","root","","smartdish");
if($conn->connect_error){
    echo json_encode(["status"=>"error","message"=>$conn->connect_error]);
    exit;
}

$total_price = 0;
foreach($input['orders'] as $item){
    $total_price += $item['total'];
}

$stmt = $conn->prepare("INSERT INTO orders (total_price) VALUES (?)");
$stmt->bind_param("d", $total_price);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

foreach($input['orders'] as $item){
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isid", $order_id, $item['name'], $item['quantity'], $item['price']);
    $stmt->execute();
    $stmt->close();
}

$conn->close();

echo json_encode(["status"=>"success","order_id"=>$order_id]);
?>

