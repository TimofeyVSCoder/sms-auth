// API ключ от sms.ru
const apiKey = ''; // вставьте сюда свой API ключ

let currentPhoneNumber = '';
let sentCode = '';

// Генерация случайного 4-значного кода
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Отправка SMS через API sms.ru
function sendSms(phone, message) {
  const url = `https://sms.ru/sms/send?api_id=${apiKey}&to=${phone}&msg=${encodeURIComponent(message)}&json=1`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === "OK") {
        console.log('SMS успешно отправлено');
        return true;
      } else {
        console.error('Ошибка отправки SMS:', data);
        alert('Ошибка при отправке SMS: ' + data.status_text);
        return false;
      }
    })
    .catch(error => {
      console.error('Ошибка сети:', error);
      alert('Ошибка сети при отправке SMS.');
      return false;
    });
}

// Обработка номера и отправка кода
function processPhone() {
  const input = document.getElementById('phoneInput').value.trim();
  let cleaned = input.replace(/[^\d+]/g, '');
  let normalizedNumber = '';

  if (cleaned.startsWith('8')) {
    normalizedNumber = '+7' + cleaned.slice(1);
  } else if (cleaned.startsWith('+7')) {
    normalizedNumber = cleaned;
  } else if (cleaned.startsWith('7') && cleaned.length >=11) {
    normalizedNumber = '+' + cleaned;
  } else if (cleaned.startsWith('9') && cleaned.length ===10) {
    normalizedNumber = '+7' + cleaned;
  } else if (/^\d{10,}$/.test(cleaned)) {
    normalizedNumber = '+7' + cleaned.slice(-10);
  } else {
    alert('Пожалуйста, введите номер в правильном формате.');
    return;
  }

  // Проверка длины номера
  const digitsOnly = normalizedNumber.replace(/\D/g, '');
  if (digitsOnly.length !==11 || !normalizedNumber.startsWith('+7')) {
    alert('Некорректная длина номера!');
    return;
  }

  currentPhoneNumber = normalizedNumber;
  // Генерация кода
  sentCode = generateCode();
  // Отправка SMS
  sendSms(currentPhoneNumber, `Ваш код подтверждения: ${sentCode}`)
    .then(success => {
      if(success){
        alert('Код отправлен! Проверьте ваши сообщения.');
        document.getElementById('codeInput').disabled = false;
        document.querySelector('button[onclick="verifyCode()"]').disabled = false;
      }
    });
}
// Проверка введенного кода
function verifyCode() {
  const userCode = document.getElementById('codeInput').value.trim();

  if (!userCode) {
    alert('Пожалуйста, введите код.');
    return;
  }

  if (userCode === sentCode) {
    alert('Код подтвержден! Вы успешно авторизовались.');
  } else {
    alert('Неверный код. Попробуйте еще раз.');
  }
}