FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/src ./src
ENV PYTHONUNBUFFERED=1
CMD ["python", "src/app.py"]
