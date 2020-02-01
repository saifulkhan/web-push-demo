# Web Push Demo

Main libraries and frameworks used:
- Node.js
- web-push

# Getting Started

**Starting backend server:**

```sh
cd backend
npm install
npm run dev
```

**Starting frontend:**

```sh
cd frontend
npm install
# -c-1 disable caching, to load changed files immediately
npx http-server -c-1 -p 8000
```

**Test:**
- To check the server started, open: `localhost:4000/health`
- To send test notification, open: `localhost:4000/send-notification`

# References

- Web-push page in [GitHub](https://github.com/web-push-libs/web-push)
- Google's [Introduction to Push Notification](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications)

- [What is VAPID?](https://labs.bawi.io/web-push-notifications-through-vapid-method-7d4d6927a006)
- Adapted from the [example tutorial](https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679)
- Another [Angular example](https://malcoded.com/posts/angular-push-notifications/)
