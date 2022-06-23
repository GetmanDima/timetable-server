### Серверная часть приложения для работы с расписанием

В данном репозитории располагается только серверная часть. Также присутствует клиент и парсер.  
Планы развития проекта описаны в репозитории с клиентом.  
Клиент: https://github.com/GetmanDima/timetable-client  
Парсер: https://github.com/GetmanDima/timetable-server-parser  

Запуск миграций:
```
npx sequelize-cli db:migrate
```
Запуск сидов:
```
npx sequelize-cli db:seed:all
```
Запуск сервера:
```
npm start
```
или
```
npm run dev
```
