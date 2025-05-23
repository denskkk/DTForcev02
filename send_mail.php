<?php
<?php
// Проверка, что форма отправлена
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получение данных из формы
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : 'Не указано';
    $privacy = isset($_POST['privacy']) ? true : false;
    
    // Проверка обязательных полей
    if (empty($name) || empty($phone) || !$privacy) {
        http_response_code(400);
        echo "Будь ласка, заповніть всі обов'язкові поля.";
        exit;
    }
    
    // Email получателя
    $to = 'failarm13@gmail.com';
    
    // Тема письма
    $subject = 'Новий запит з сайту DTForce';
    
    // Содержимое письма
    $email_content = "Ім'я: $name\n";
    $email_content .= "Телефон: $phone\n";
    $email_content .= "Повідомлення: $message\n";
    
    // Заголовки письма
    $headers = "From: DTForce <noreply@dtforce.in.ua>\n";
    $headers .= "Reply-To: $name <noreply@dtforce.in.ua>\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Отправка письма
    if (mail($to, $subject, $email_content, $headers)) {
        // Успешно отправлено
        http_response_code(200);
        
        // Перенаправление на страницу благодарности
        header("Location: thank-you.html");
        exit;
    } else {
        // Ошибка отправки
        http_response_code(500);
        echo "Виникла помилка при відправці повідомлення.";
    }
} else {
    // Запрос не POST
    http_response_code(403);
    echo "Доступ заборонено.";
}
?>


