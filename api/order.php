<?php
$product = $_GET['product'];
$fio = $_GET['fio'];
$email = $_GET['email'];
$phone = $_GET['phone'];
$address = $_GET['address'];
$note = $_GET['note'];

//ilya.silitski@gmail.com
$mail = 'ilya.silitski@gmail.com';
http_response_code(200);

exit(0);
$message = "
    Товар: $product\n
    ФИО: $fio\n
    Email: $email\n
    Телефон: $phone\n
    Адрес: $address\n
    Комментарий к заказу: $note\n";
mail($mail, "Заказ: $product", $message);