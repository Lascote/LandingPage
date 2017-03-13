<?php
$product = htmlentities($_GET['product']);
$article = htmlentities($_GET['article']);
$fio = htmlentities($_GET['fio']);
$email = htmlentities($_GET['email']);
$phone = htmlentities($_GET['phone']);

$locality = htmlentities($_GET['locality']);
$street = htmlentities($_GET['street']);
$house = htmlentities($_GET['house']);
$housing = htmlentities($_GET['housing']);
$apartment = htmlentities($_GET['apartment']);

$note = htmlentities($_GET['note']);

// ilya.silitski@gmail.com kirill300300@gmail.com
$to = 'ilya.silitski@gmail.com';

$subject = "Заказ: $product";

$headers = "From: xn80ab6c@vh93.hoster.by\r\n";
$headers .= "Reply-To: xn80ab6c@vh93.hoster.by\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

$message = "
    Товар: <u>$product</u><br>
    Артикул: <u>$article</u><br>
    Фамилия, Имя: $fio<br>
    Email: $email<br>
    Телефон: $phone<br>
    Адрес:<br>
    - Населенный пункт: $locality<br>
    - Улица: $street<br>
    - Дом: $house<br>
    - Корпус: $housing<br>
    - Дом: $apartment<br>
    Комментарий к заказу: $note";

mail($to, $subject, $message, $headers);

http_response_code(200);