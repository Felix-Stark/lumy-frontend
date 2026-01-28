## Lumy-Frontend
Lumy is a production-ready frontend web application for a performance-feedback platform, currently live in production and used by pilot customers.

The platform replaces traditional performance reviews with continuous, peer-driven feedback and turns that data into clear, actionable performance insights for individuals and managers.

This repository contains the complete frontend implementation of Lumy and focuses on scalable architecture, role-based UX, and data visualization for a real-world SaaS product.

## Overview

Lumy is designed to collect feedback through integrations with collaboration tools like Slack and Microsoft Teams, while the web app acts as the central interface for:

viewing and analyzing performance data

managing users and roles

configuring feedback workflows

supporting ongoing iteration based on real user usage

The frontend is built to operate independently of backend implementation details and consumes data exclusively through APIs.

## What the Frontend App Does

The Lumy frontend is responsible for user experience, application state, and data presentation across the entire platform.

# Key responsibilities

Role-based UI architecture
Separate layouts and navigation flows for employees, managers, and admins, ensuring clarity, security, and relevance of information.

Authentication-aware routing
Protected routes, login flows, and permission-based rendering handled on the frontend.

Performance analytics & data visualization
Aggregated feedback is displayed using interactive charts and dashboards to highlight trends, averages, and changes over time.

API-driven data handling
Async data loading, error handling, and empty states designed for real production scenarios.

Scalable Vue 3 architecture
Modular components, shared layouts, centralized state management, and a structure designed to support growth and new features.

Integration-ready UX
Frontend surfaces feedback originating from Slack and Microsoft Teams without coupling UI logic to integration-specific behavior.

## Production Context

- The application is live in production.

- Used by pilot customers.

- UX and frontend decisions are informed by real user behavior and feedback, not hypothetical use cases.

## Scope

This repository is frontend-only.
Backend services, databases, and integrations are assumed to exist and are consumed via APIs.
The focus of this codebase is frontend engineering, UX decisions, and maintainable architecture.

## Tech Stack

Vue 3
TypeScript
Tailwind CSS
Vue Router
Pinia (state management)
Chart.js / vue-chartjs

## Why This Project Matters

This project demonstrates:

- Ownership of a production SaaS frontend
- Designing and maintaining role-based, data-heavy interfaces
- Turning complex datasets into clear, usable UI
- Writing frontend code that scales beyond a single feature or demo