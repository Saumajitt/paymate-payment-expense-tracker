# PayMate — Payment & Expense Splitting Platform

PayMate is a full-stack expense-splitting and group-payment management system built with **Java**, **Spring Boot**, **React**, **MySQL**, and integrations with **Stripe** and **PayPal**.  
It allows users to create groups, add members, split expenses, track balances, and settle payments reliably.

---

## 🚀 Features

- User authentication & role-based access  
- Group creation and member management  
- Expense creation, splitting logic & balance tracking  
- Payment settlement with Stripe & PayPal  
- Webhook-based transaction verification  
- Real-time updates for group activity  
- Modular backend architecture for clean extensibility  

---

## 🧱 Architecture Overview

Below is the high-level architecture diagram showing how the system is organized:

![Architecture Diagram](/backend/assets/paymate-architecture.png)

The backend follows a modular structure:

- **User Management:** authentication, roles, profiles  
- **Group Management:** groups, members, invitations  
- **Expense Management:** expenses, splits, balance calculations  
- **Payment & Settlement:** external payment gateways, webhooks, transactions  

Each module uses a clean Controller → Service → Repository pattern.

---

## 🗄️ Database Design

The system uses MySQL with entities such as:

- `users`  
- `roles`  
- `groups`  
- `group_members`  
- `expenses`  
- `expense_splits`  
- `transactions`

---

## 📡 Tech Stack

**Backend:** Java, Spring Boot, Spring MVC, JPA/Hibernate  
**Frontend:** React.js  
**Payments:** Stripe, PayPal  
**Database:** MySQL  
**Other:** Docker, Postman, JWT Authentication  

---

## 📂 Legacy Code

All previous implementation is available in the `legacy-code` branch.  
The main branch contains the architecture, documentation, and ongoing refactor.

---

## 📝 Status

This repository contains the architecture and ongoing improvements as part of a backend engineering–focused rewrite.  
