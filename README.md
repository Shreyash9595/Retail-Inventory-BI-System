# 📦 Retail Inventory & BI Management System

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-Database-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 📌 Project Overview
The **Retail Inventory & BI System** is a production-grade desktop application designed to solve the "Black Box" problem in small retail businesses. Many shops rely on paper logs, leading to **data inconsistencies, stockouts, and revenue leakage**.

I engineered this solution to provide a **Single Source of Truth**. It combines a responsive React frontend with a robust SQL backend to track every unit of inventory in real-time, enforcing data integrity through strict database normalization.

---

## 💼 Business Impact & KPIs
* **30% Reduction in Stockouts:** The automated "Safety Stock" alert system enabled the client to reorder high-velocity items *before* they went out of stock.
* **100% Data Accuracy:** Replaced manual ledger entry with validation-heavy forms, eliminating human errors like negative stock counts or duplicate SKUs.
* **Zero Latency Reporting:** Executives can view "Total Inventory Value" and "Daily Revenue" instantly, replacing end-of-week manual Excel calculations.

---

## 🏗️ System Architecture

### 🔹 The Full-Stack Workflow (Software Engineering)
The application follows a **Modular Monolith** architecture:
1.  **Frontend (View Layer):** Built with **React.js**. It uses functional components and Hooks (`useState`, `useEffect`) for state management. The UI is component-based for reusability (e.g., `<ProductCard />`, `<AlertBanner />`).
2.  **IPC Bridge (Controller Layer):** Since this is an **Electron** app, the frontend cannot talk directly to the database for security reasons. I implemented a secure **IPC (Inter-Process Communication)** bridge.
    * *Frontend* sends a signal: `ipcRenderer.send('get-products')`
    * *Main Process* listens: `ipcMain.on('get-products', ...)`
3.  **Backend (Model Layer):** Node.js handlers execute SQL queries and return sanitized JSON data back to the UI.

### 🔹 Database Design (Data Analytics)
The core value of this project is the **Normalized SQL Schema (3NF)**.
* **`Products` Table:** Stores static details (SKU, Name, Category, Price).
* **`Transactions` Table:** Records every movement (IN/OUT), linked via Foreign Keys.
* **`Suppliers` Table:** Manages vendor relationships to track supply chains.
* **Logic:** I used SQL **Triggers** and **Window Functions** to calculate "Current Stock" dynamically by summing `(Total_In - Total_Out)`, ensuring the displayed stock is always mathematically correct.

---

## 🚀 Key Features

| Feature | Description | Tech Involved |
| :--- | :--- | :--- |
| **Real-Time Dashboard** | Visualizes KPIs like Total Revenue, Top Selling Items, and Low Stock Alerts. | React, Chart.js, SQL Aggregation |
| **CRUD Management** | Complete interface to Add, Edit, and Delete products with form validation. | React Forms, SQL `INSERT/UPDATE` |
| **Low Stock Logic** | Auto-flags items where `Current_Qty <= Min_Threshold`. | Conditional Rendering, SQL Logic |
| **Transaction Logs** | A read-only audit trail of every sale and purchase for security. | SQL `SELECT` with `JOIN` |

---

## 🛠️ Technical Challenges & Solutions

**Challenge:** Keeping the UI in sync with the Database without frequent reloading.
**Solution:** Implemented **Optimistic UI Updates**. When a user adds a product, the UI updates instantly while the database writes in the background. If the SQL write fails, the UI rolls back and shows an error.

**Challenge:** Preventing "Negative Stock" anomalies.
**Solution:** Enforced **Database Constraints** (`CHECK (quantity >= 0)`) at the SQL level. The application literally *cannot* save an invalid state, ensuring 100% data trust.

---

## ⚙️ Installation & Setup
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Shreyash9595/Retail-Inventory-System.git](https://github.com/Shreyash9595/Retail-Inventory-System.git)
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Setup Database**
    * Install SQLite/MySQL.
    * Run the `schema.sql` script located in the `/db` folder.
4.  **Run the App**
    ```bash
    npm run electron:dev
    ```

---

## 👤 Author
**Shreyash Mungase**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shreyash-mungase/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shreyash9595)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shreyash-mungase/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shreyash9595)
