FROM python:3.13.0

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/larcai_api/

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \         
    libjpeg-dev \     
    libxml2-dev \       
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install -r ./requirements.txt
RUN python ./manage.py migrate

# Expose port 80 (adjust as necessary)
EXPOSE 80
WORKDIR /code/larcai_api
# Command to run Django server
CMD ["gunicorn", "larc_dev_api.wsgi:application", "--bind", "0.0.0.0:8000"]
