FROM python:3.13.0

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/larcai_api/

RUN pip install -r ./larcai_api/requirements.txt
RUN python ./larcai_api/manage.py migrate

# Expose port 80 (adjust as necessary)
EXPOSE 80
WORKDIR /code/larcai_api
# Command to run Django server
CMD ["gunicorn", "larc_dev_api.wsgi:application", "--bind", "0.0.0.0:8000"]
