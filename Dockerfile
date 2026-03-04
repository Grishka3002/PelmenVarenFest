diff --git a/c:\Users\PVN-LP7\Desktop\Bot\SitePelmen\Dockerfile b/c:\Users\PVN-LP7\Desktop\Bot\SitePelmen\Dockerfile
new file mode 100644
--- /dev/null
+++ b/c:\Users\PVN-LP7\Desktop\Bot\SitePelmen\Dockerfile
@@ -0,0 +1,9 @@
+FROM node:24-alpine
+
+WORKDIR /app
+
+COPY . .
+
+EXPOSE 3000
+
+CMD ["npm", "start"]
