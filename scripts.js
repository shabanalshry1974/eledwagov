// تثبيت الهيدر عند التمرير
window.addEventListener("scroll", function() {
    const header = document.getElementById("main-header");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});

// إرسال النموذج
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("تم إرسال الرسالة بنجاح!");
    this.reset(); // إعادة تعيين النموذج بعد الإرسال
});


const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// إنشاء اتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // اسم المستخدم
    password: '', // كلمة المرور
    database: 'dashboard_db' // اسم قاعدة البيانات
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// API لجلب بيانات الطلبات
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN status = 'جاري' THEN 1 ELSE 0 END) AS ongoing,
            SUM(CASE WHEN status = 'منتهي' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN status = 'متبقي' THEN 1 ELSE 0 END) AS pending
        FROM orders;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results[0]);
    });
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});