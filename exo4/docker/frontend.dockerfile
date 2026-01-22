FROM nginx:alpine
COPY frontend/src/ /usr/share/nginx/html/
# proxy /api vers backend via réseau docker
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  location / { root /usr/share/nginx/html; try_files $uri /index.html; }' \
'  location /api/ { proxy_pass http://backend:5000; proxy_set_header Host $host; }' \
'}' > /etc/nginx/conf.d/default.conf
