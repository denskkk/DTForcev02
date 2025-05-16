<?php
// filepath: c:\Users\Admin\Desktop\DTForcev02-main\DTForcev02-main\send_mail.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Укажите ваш email
    $to = "nikolaycpitera01@gmail.com"; // Замените на ваш email
    $subject = "Новий запит з форми зворотного зв'язку";
    $body = "Ім'я: $name\nТелефон: $phone\nEmail: $email\nПовідомлення:\n$message";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Ваше повідомлення успішно надіслано!";
    } else {
        echo "На жаль, сталася помилка при відправці повідомлення.";
    }
} else {
    echo "Неправильний метод запиту.";
}
?>
